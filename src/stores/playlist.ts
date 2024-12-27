// stores/playlist.ts 歌单详情
import axios from '../services/axiosInstance';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import type { Playlist } from '@/types/playlist';
import type { Song } from '@/types/song';

export const usePlaylistStore = defineStore('playlist', ()=>{
    const descs = reactive<Record<string, Playlist>>({});
    const songs = reactive<Record<string, Song[]>>({});
    const cacheTimestamps = reactive<Record<string, number>>({}); // 记录缓存时间戳

    const CACHE_DURATION = 5 * 60 * 1000; // 5分钟（单位：毫秒）

    // 设置id时间戳
    function setCacheTimestamps(id:number) {
        cacheTimestamps[id] = Date.now();
    }

    // 检查缓存是否有效: 查看过并且不超过五分钟
    function isCacheValid(id:number) {
        const now = Date.now();
        const timestamp = cacheTimestamps[id];
        return timestamp && now - timestamp < CACHE_DURATION;
    }

    async function getDescs(id:number){
        try{
            //获取歌单描述
            const data: any = await axios.get(`/playlist/detail?id=${encodeURIComponent(id)}`);
            if(data) {
                if(data.playlist) {
                    descs[id] = {
                        id: data.playlist.id,
                        name: data.playlist.name,
                        picUrl: data.playlist.coverImgUrl,
                        trackCount: data.playlist.trackCount,
                        playCount: data.playlist.playCount,
                        creatorName: data.playlist.creator.nickname,
                        creatorPicUrl: data.playlist.creator.avatarUrl
                    }
                    console.log(descs[id]);
                    return data.playlist.trackCount;
                } else {
                    console.error(`歌单描述信息缺失，ID: ${id}`);
                }
            } else {
                console.error(`API歌单描述信息格式有误，ID: ${id}`);
            }
        } catch(error){
            console.log('获取歌单描述出错，', error);
        }
    }

    async function getSongs(id:number, trackCnt: number){
        const limit = 10; // 每次请求的最大歌曲数
        const totalPages = Math.ceil(trackCnt / limit); // 计算总页数
        const allSongs:Song[] = []; // 用于存储所有歌曲
        
        try {
            // 构造所有请求的 Promise
            const requests = Array.from({ length: totalPages }, (_, page) => {
                const offset = page * limit;
                return axios.get(`/playlist/track/all`, {
                    params: {
                        id: encodeURIComponent(id),
                        limit,
                        offset,
                    },
                });
            });

            // 并发发送请求
            const responses = await Promise.all(requests);
            console.log('responses在这里：', responses);

            // 处理所有返回数据
            responses.forEach((response:any, page:number) => {
                if (response.songs) {
                    // console.log(`成功获取第 ${page + 1} 页数据`);
                    allSongs.push(
                        ...response.songs.map((song: any) => ({
                            id: song.id,
                            name: song.name,
                            url: `https://music.163.com/song/media/outer/url?id=${encodeURIComponent(song.id)}.mp3`,
                            artists: Array.isArray(song.ar)
                                ? song.ar.map((artist: any) => ({
                                    id: artist.id,
                                    name: artist.name,
                                }))
                                : [],
                            album: {
                                id: song.al?.id || 0,
                                name: song.al?.name || '未知专辑',
                                picUrl: song.al?.picUrl || '',
                            },
                        }))
                    );
                } else {
                    console.error(`第 ${page + 1} 页数据缺失`);
                }
            });

            // 保存数据和缓存时间
            songs[id] = allSongs;
            console.log(`成功获取歌单 ${id} 的所有歌曲，共 ${allSongs.length} 首`);

        } catch(error) {
            console.error('获取歌单详情信息出错：', error);
        }
    }

    async function getDetail(id: number){
        console.log('pinia歌单详情函数');
        if (isCacheValid(id)) {
            console.log(`使用缓存的歌单数据，id: ${id}`);
            return;
        }
        try {
            const trackCnt = await getDescs(id);
            await getSongs(id, trackCnt);
            setCacheTimestamps(id); // 在请求成功后更新缓存时间
        } catch (error) {
            console.error('搜索出错:', error);
        }
    }
    return {
        descs,
        songs,
        getDetail,
    }
},{
    persist:true
})