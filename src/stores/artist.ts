// stores/artist.ts
import axios from '../services/axiosInstance';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useArtistStore = defineStore('artist', () => {
    const artist = reactive({});
    const songs = reactive({});
    const cacheTimestamps = reactive({}); // 记录缓存时间戳

    const CACHE_DURATION = 5 * 60 * 1000; // 5分钟（单位：毫秒）

    // 动态生成歌曲播放链接
    const generateSongUrl = (id: number) =>
      `https://music.163.com/song/media/outer/url?id=${encodeURIComponent(id)}.mp3`;

    async function getArtist(id: number) {
        const now = Date.now();
        // 如果缓存未过期，直接返回已有数据
        if (cacheTimestamps[id] && now - cacheTimestamps[id] < CACHE_DURATION) {
            console.log(`使用缓存的歌手数据，id: ${id}`);
            return;
        }

        try{
            const data = await axios.get(`/artists?id=${encodeURIComponent(id)}`);
            if (data) {
                //歌手信息部分
                if(data.artist) {
                    artist[id] = {
                        id: data.artist.id || 0,
                        name: data.artist.name || '',
                        desc: data.artist.briefDesc || '暂无简介',
                        picUrl: data.artist.img1v1Url || '',
                        musicSize: data.artist.musicSize || 0,
                        albumSize: data.artist.albumSize || 0,
                        mvSize: data.artist.mvSize || 0,
                        alias: data.artist.alias.map(alia => alia) || []
                    };
                } else {
                    console.error(`歌手信息缺失，ID: ${id}`);
                }

                //歌手热歌部分
                if(data.hotSongs && Array.isArray(data.hotSongs)) {
                    songs[id] = data.hotSongs.map(song => ({
                        id: song.id,
                        name: song.name,
                        url: generateSongUrl(song.id),
                        artists: Array.isArray(song.ar)
                            ? song.ar.map((artist) => ({
                                id: artist.id,
                                name: artist.name,
                            }))
                            : [],
                        album: {
                            id: song.al?.id || 0,
                            name: song.al?.name || '未知专辑',
                            picUrl: song.al?.picUrl || ''
                        }
                    }));
                } else {
                    console.error(`热歌信息缺失，ID: ${id}`);
                }

                // 更新缓存时间
                cacheTimestamps[id] = now;
                
            } else {
                console.error('API歌手详情格式有误');
            }
        } catch(error){
            console.log('获取歌手详情信息出错:', error);
        }

    };

    return {
        artist,
        songs,
        getArtist
    };
},{
    persist:true
});
