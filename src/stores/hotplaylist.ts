// stores/hotplaylist.ts
import axios from '../services/axiosInstance';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import type { Playlist } from '@/types/playlist';

export const useHotplaylistStore = defineStore('hotplaylist', () => {
    const playlists = reactive<Playlist[]>([]);
    const cacheTimestamps = ref<number>(); // 记录缓存时间戳

    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 一天对应的分钟（单位：毫秒）

    async function getPlaylists() {
        const now = Date.now();
        // 如果缓存未过期，直接返回已有数据
        if (cacheTimestamps.value && now - cacheTimestamps.value < CACHE_DURATION) {
            console.log('使用缓存的hotplaylist数据');
            return;
        }

        try{
            const data: any = await axios.get(`/personalized?limit=20`);
            if (data) {
                // 清空当前的playlists数组
                playlists.length = 0;
                //专辑信息
                if (data.result) {
                    playlists.push(...data.result.map(playlist => ({
                        id: playlist.id,
                        name: playlist.name,
                        picUrl: playlist.picUrl,
                        trackCount: playlist.trackCount,
                        playCount: playlist.playCount,
                        creatorName: '',
                        creatorPicUrl: ''
                    })));
                } else {
                    console.error(`热门歌单具体信息缺失`);
                }

                // 更新缓存时间
                cacheTimestamps.value = now;
                
            } else {
                console.error('API热门歌单格式有误');
            }
        } catch(error){
            console.log('获取热门歌单信息出错:', error);
        }

    };

    return {
        playlists,
        getPlaylists
    }
},{
    persist: true
});