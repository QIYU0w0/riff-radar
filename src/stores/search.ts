import {defineStore} from 'pinia'
import { ref } from 'vue'
import type { Playlist } from '@/types/playlist';
import type { Song } from '@/types/song';
import axios from '../services/axiosInstance';

export const useSearchStore = defineStore('search',()=>{
    const songs = ref<Record<string, Song[]>>({});
    const artists = ref<Record<string, {id:number, name:string, picUrl: string}[]>>({});
    const playlists = ref<Record<string, Playlist[]>>({});
    const cacheTimestamps = ref({}); // 存储每个 query 的缓存时间
    const currentQuery = ref('');

    const CACHE_EXPIRATION = 5 * 60 * 1000; // 缓存有效期：5分钟（单位：毫秒）
    // 获取当前时间戳
    function getCurrentTimestamp() {
      return new Date().getTime();
    }

    // 设置query的时间戳
    function setCacheTimestamps(query:string) {
        cacheTimestamps.value[query] = getCurrentTimestamp();
    }

    // 检查缓存是否有效: 搜索过并且不超过五分钟
    function isCacheValid(query:string) {
      const timestamp = cacheTimestamps.value[query];
      return timestamp && getCurrentTimestamp() - timestamp < CACHE_EXPIRATION;
    }

    async function getPicUrl(id:number) {
        try{
            const data = await axios.get(`/album?id=${encodeURIComponent(id)}`);
            if (data.album){
                return data.album.picUrl;
            } else {
                console.error('API专辑信息有误');
            }
        } catch(error){
            console.log('获取专辑信息出错:', error);
        }
    }

    async function searchSongs(query:string){
        try {
            const data: any = await axios.get(`/search?keywords=${encodeURIComponent(query)}&limit=20&type=1`);
            // 可以用到的具体属性：id, name, artists(arr)(id,name),album(id,picId)
            if (data.result && Array.isArray(data.result.songs)) {
                const fetchAlbumsPromises = data.result.songs.map(async (song) => {
                    const picUrl = await getPicUrl(song.album.id);
                    return {
                        id: song.id,
                        name: song.name,
                        url: `https://music.163.com/song/media/outer/url?id=${encodeURIComponent(song.id)}.mp3`,
                        artists: song.artists.map(artist => ({
                            id: artist.id,
                            name: artist.name
                        })),
                        album: {
                            id: song.album.id,
                            name: song.album.name,
                            picUrl: picUrl
                        }
                    };
                });
                songs.value[query] = await Promise.all(fetchAlbumsPromises); // 等待所有 Promise 完成
                console.log(songs.value);                
            } else {
                console.error('API歌曲信息有误');
            }
        } catch (error) {
            console.error('axiosget歌曲出错:', error);
        }
    }

    async function searchArtists(query:string) {
        try {
            const data: any = await axios.get(`/search?keywords=${encodeURIComponent(query)}&limit=30&type=100`);
            // 可以用到的具体属性：
            if (data.result && Array.isArray(data.result.artists)) {
                artists.value[query] = data.result.artists.map((artist) => {
                    return {
                        id: artist.id,
                        name: artist.name,
                        picUrl: artist.img1v1Url
                    };
                });
                console.log(artists.value);
            } else {
                console.error('API 返回的数据格式不正确或没有返回歌手信息');
            }            
        } catch (error) {
            console.error('axiosget歌手出错:', error);
        }        
    }

    async function searchPlaylists(query:string) {
        try {
            const data = await axios.get(`/search?keywords=${encodeURIComponent(query)}&limit=3&type=1000`);
            // 可以用到的具体属性：
            if (data.result && Array.isArray(data.result.playlists)) {
                playlists.value[query] = data.result.playlists.map((playlist) => {
                    return {
                        id: playlist.id,
                        name: playlist.name,
                        picUrl: playlist.coverImgUrl,
                        trackCount: playlist.trackCount,
                        playCount: playlist.playCount,
                        creatorName: playlist.creator.nickname,
                        creatorPicUrl: playlist.creator.avatarUrl
                    };
                });
                console.log(playlists.value);
            } else {
                console.error('API 返回的数据格式不正确或没有返回歌单信息');
            }            
        } catch (error) {
            console.error('axiosget歌单出错:', error);
        }
    }

    async function searchAll(query:string) {
        console.log('pinia搜索函数');
        try {
            await searchSongs(query);
            await searchArtists(query);
            await searchPlaylists(query);
            setCacheTimestamps(query); // 在请求成功后更新缓存时间
        } catch (error) {
            console.error('搜索出错:', error);
        }
    }

    return{
        songs,
        artists,
        playlists,
        currentQuery,
        isCacheValid,
        searchAll,
    }
},{
    persist:true
})