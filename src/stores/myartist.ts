import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useMyartistStore = defineStore('myartist',()=>{
    const artists = reactive<Record<string, {id:number, name:string, picUrl: string}>>({});
    
    function isFollow(id:number):boolean {
        return artists.hasOwnProperty(id);
    }

    return {
        artists,
        isFollow
    }
},{
    persist:true
})