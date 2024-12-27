// stores/hotartist.ts
import axios from '../services/axiosInstance';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useHotartistStore = defineStore('hotartist', () => {
    const artists = reactive<{id:number, name:string, picUrl: string}[]>([]);
    const cacheTimestamps = ref<number>(); // 记录缓存时间戳

    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 一天对应的分钟（单位：毫秒）

    async function getArtists() {
        const now = Date.now();
        // 如果缓存未过期，直接返回已有数据
        if (cacheTimestamps.value && now - cacheTimestamps.value < CACHE_DURATION) {
            console.log('使用缓存的hotartist数据');
            return;
        }

        try{
            const data: any = await axios.get(`/top/artists?offset=0&limit=20`);
            if (data) {
                // 清空当前的artists数组
                artists.length = 0;
                //专辑信息
                if (data.artists) {
                    artists.push(...data.artists.map((artist:any) => ({
                        id: artist.id,
                        name: artist.name,
                        picUrl: artist.img1v1Url
                    })));
                } else {
                    console.error(`热门歌手具体信息缺失`);
                }

                // 更新缓存时间
                cacheTimestamps.value = now;
                
            } else {
                console.error('API热门歌手格式有误');
            }
        } catch(error){
            console.log('获取热门歌手信息出错:', error);
        }

    };

    return {
        artists,
        getArtists
    }
},{
    persist: true
});