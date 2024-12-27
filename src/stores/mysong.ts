import { defineStore } from 'pinia'
import { reactive } from 'vue'
import type { Song } from '@/types/song';

export const useMysongStore = defineStore('mysong',()=>{
    const songs = reactive<Record<string, Song>>({});
    
    function isAtList(id:number):boolean {
        return songs.hasOwnProperty(id);
    }

    return {
        songs,
        isAtList
    }
},{
    persist:true
})