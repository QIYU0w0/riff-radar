import {defineStore} from 'pinia'
import { ref, reactive } from 'vue'
import type { Song } from '@/types/song';

export const usePlayinglistStore = defineStore('playinglist',()=>{
    const songsAtList = reactive<Song[]>([]);
    const playingIndex = ref<number|null>(null);
    const playingUrl = ref('');
    const isPlaying = ref(false);

    const audio = new Audio();

    function clearAll (){
        songsAtList.splice(0, songsAtList.length);
        playingIndex.value = null;
        // audio.src = '';
        playingUrl.value = '';
        isPlaying.value = false;
    }

    function playAudio(url: string) {
        if (audio && audio.src === url) {
            // 如果当前 audio 实例存在且是同一首歌，从当前位置继续播放
            if (audio.paused) {
                audio.play(); // 如果是暂停状态，继续播放
                isPlaying.value = true;
            }
        } else {
            // 如果不是同一首歌或 audio 实例不存在，创建新的 audio 实例或重置 src 并播放
            audio.src = url;

            audio.oncanplaythrough = () => {
                audio.play();
                isPlaying.value = true;
                playingUrl.value = url;
            };
            audio.onerror = (event) => {
                console.error('播放音频失败:', event);
                alert('暂无版权');
            };
            audio.onended = () => {
                isPlaying.value = false; // 音乐播放结束后停止播放状态
            };
        }
        console.log("当前列表：", songsAtList);
    }


    function pauseAudio() {
        if (audio) {
            audio.pause();
            console.log('pauseAudio暂停');
            isPlaying.value = false;
            console.log(isPlaying.value);
        }
    }

    return{
        songsAtList,
        playingIndex,
        playingUrl,
        isPlaying,
        audio,

        clearAll,
        playAudio,
        pauseAudio
    }
},{
    persist: true
})