// stores/banner.ts
import axios from '../services/axiosInstance';
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

export const useBannerStore = defineStore('banner', () => {
    const albums = reactive<{name:string, id:number, picUrl:string}[]>([]);
    const cacheTimestamps = ref<number>(); // 记录缓存时间戳

    const CACHE_DURATION = 24 * 60 * 60 * 1000; // 一天对应的分钟（单位：毫秒）

    async function getBanner() {
        const now = Date.now();
        // 如果缓存未过期，直接返回已有数据
        if (cacheTimestamps.value && now - cacheTimestamps.value < CACHE_DURATION) {
            console.log('使用缓存的banner数据');
            return;
        }

        try{
            const data: any = await axios.get(`/album/newest`);
            if (data) {
                // 清空当前的albums数组
                albums.length = 0;
                //专辑信息
                if (data.albums) {
                    albums.push(...data.albums.map(album => ({
                        id: album.id,
                        name: album.name || '',
                        picUrl: album.picUrl || ''
                    })));
                } else {
                    console.error(`专辑具体信息缺失`);
                }

                // 更新缓存时间
                cacheTimestamps.value = now;
                
            } else {
                console.error('API最新专辑格式有误');
            }
        } catch(error){
            console.log('获取最新专辑信息出错:', error);
        }

    };

    return {
        albums,
        getBanner
    }
},{
    persist: true
});