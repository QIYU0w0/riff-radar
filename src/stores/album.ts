import axios from '@/services/axiosInstance';
import { defineStore } from 'pinia';
import { reactive } from 'vue';
import type { Song } from '@/types/song';
import type { Album } from '@/types/album';

export const useAlbumStore = defineStore('album', () => {
    const descs = reactive<Record<string, Album>>({});
    const songs = reactive<Record<string, Song[]>>({});
    const cacheTimestamps = reactive<Record<string, number>>({}); // 记录缓存时间戳

    const CACHE_DURATION = 5 * 60 * 1000; // 5分钟（单位：毫秒）

    // 设置id时间戳
    function setCacheTimestamps(id: number) {
        cacheTimestamps[id] = Date.now();
    }

    // 检查缓存是否有效: 查看过并且不超过五分钟
    function isCacheValid(id:number) {
        const now = Date.now();
        const timestamp = cacheTimestamps[id];
        return timestamp && now - timestamp < CACHE_DURATION;
    }

    function getPublishTime(time: number) {
        const date = new Date(time);
        // 将日期转换为YYYY-MM-DD格式
        const year = date.getFullYear(); // 获取年份
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，月份从0开始，所以加1
        const day = date.getDate().toString().padStart(2, '0'); // 获取日期

        // 组合成YYYY-MM-DD格式
        return `${year}-${month}-${day}`;
    }

    async function getAlbum(id:number) {
        console.log('pinia: album');
        if (isCacheValid(id)) {
            console.log('专辑缓存：', id);
            return;
        }
        try {
            const data: any = await axios.get(`/album?id=${encodeURIComponent(id)}`);
            
            // 获取单曲
            if(data.songs){
                songs[id] = data.songs.map((song:any) => ({
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
                    }
                }))
            } else {
                console.error('专辑API不含单曲信息data.songs');
            }

            // 获取描述
            if(data.album){
                descs[id] = {
                    id: data.album.id,
                    name: data.album.name,
                    size: data.album.size,
                    picUrl: data.album.picUrl,
                    description: data.album.description,
                    publishTime: getPublishTime(data.album.publishTime),
                    artist: {
                        id: data.album.artist?.id || 0,
                        name: data.album.artist?.name || '未知艺术家',
                        picUrl: data.album.artist?.img1v1Url || ''
                    }
                }
                console.log(descs);
            } else {
                console.error('专辑API不含专辑信息data.album');
            }

            setCacheTimestamps(id); // 在请求成功后更新缓存时间

        } catch(error) {
            console.log('获取专辑信息出错：', error);
        }
    }

    return {
        descs,
        songs,
        getAlbum
    }
},{
    persist:true
})