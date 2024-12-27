// stores/hotplaylist.ts
import axios from '../services/axiosInstance';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import type { Song } from '@/types/song';

export const useHotsongStore = defineStore('hotsong', () => {
    const songs = reactive<Song[]>([]);
    const cacheTimestamps = ref<number>(); // 记录缓存时间戳

    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 一天对应的分钟（单位：毫秒）

    async function getSongs() {
        const now = Date.now();
        // 如果缓存未过期，直接返回已有数据
        if (cacheTimestamps.value && now - cacheTimestamps.value < CACHE_DURATION) {
            console.log('使用缓存的hotsongs数据');
            return;
        }

        try{
            const data: any = await axios.get(`/personalized/newsong?limit=30`);
            console.log('hotsong数据，', data);
            if (data) {
                // 清空当前的playlists数组
                songs.length = 0;
                // 单曲信息
                if (data.result) {
                    songs.push(...data.result.map((result:any) => ({
                        id: result.id,
                        name: result.name,
                        url: `https://music.163.com/song/media/outer/url?id=${encodeURIComponent(result.id)}.mp3`,
                        artists: result.song.artists.map((artist:any) => ({
                            id: artist.id,
                            name: artist.name
                        })),
                        album: {
                            id: result.song.album.id,
                            name: result.song.album.name,
                            picUrl: result.picUrl
                        }
                    })))
                    console.log(songs);                
                } else {
                    console.error(`单曲推荐具体信息缺失`);
                }

                // 更新缓存时间
                cacheTimestamps.value = now;
                
            } else {
                console.error('API单曲推荐格式有误');
            }
        } catch(error){
            console.log('获取单曲推荐信息出错:', error);
        }

    };

    return {
        songs,
        getSongs
    }
},{
    persist: true
});