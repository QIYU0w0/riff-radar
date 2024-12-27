<!-- MiniPlayer.vue -->
<template>
    <div class="mini-player">
        <div class="song-info">
            <div class="img-wrapper" v-if="thisSong">
                <img :src="songPicUrl" alt="">
            </div>
            <div class="img-wrapper" v-else>
            </div>
            <div class="name-info">
                <p class="song-name">{{ songName }}</p>
                <p class="artist-name">{{ artistName }}</p>
            </div>
        </div>
        <div class="player-info">
            <div class="player-buttons">
                <div class="to-pre" @click="playPrev(songUrl)"><img src="./icons/prev.svg" alt=""></div>
                <div class="play-it" @click="playSelfSong(songUrl)"><img :src="getSelfPlayPauseIcon(songUrl)" alt="">
                </div>
                <div class="to-next" @click="playNext(songUrl)"><img src="./icons/next.svg" alt=""></div>
            </div>
            <div class="progress-bar" @mousedown="startDrag" @mousemove="drag" @mouseup="endDrag" @mouseleave="endDrag">
                <div class="progress" :style="{ width: progress + '%' }"></div>
                <div class="progress-handle" :style="{ left: progress + '%' }" @mousedown.stop="startHandleDrag">
                </div>
            </div>
        </div>
        <div class="right-buttons">
            <div class="like" @click="toggleLike(songId)"><img :src="getLikeDislikeIcon(songId)" alt=""></div>
            <div class="list" @click="displayList()"><img src="./icons/list.svg" alt=""></div>
        </div>
    </div>
    <div v-if="listIsVisiable" class="playlist">
        <div class="playlist-wrapper" v-for="(song, index) in songs" :key="index">
            <p class="id-num">{{ index + 1 }}</p>
            <div class="album-pic"><img :src="song.album.picUrl" alt="无封面"></div>
            <p class="song-name">{{ song.name }}</p>
            <p class="artist-name">
                {{ song.artists.map(artist => artist.name).join(', ') }}
            </p>
            <div class="play-button" @click="playSong(song.url, index)">
                <img :src="getPlayPauseIcon(song.url)" alt="">
            </div>
            <div class="like-button" @click="toggleLike(song.id)"><img :src="getLikeDislikeIcon(song.id)" alt=""></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { usePlayinglistStore } from '@/stores/playinglist';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Song } from '@/types/song';
import { useMysongStore } from '@/stores/mysong';
import { ElMessageBox, ElMessage } from 'element-plus';

const mysongStore = useMysongStore();
const playinglistStore = usePlayinglistStore();
const songs = computed((): Song[] => playinglistStore.songsAtList || []);
const songIndex = computed(() => playinglistStore.playingIndex || 0);
const thisSong = computed((): Song | null => {
    return playinglistStore.songsAtList[songIndex.value] || null;
});
const songUrl = computed(() => thisSong.value?.url || '');
const songId = computed(() => thisSong.value?.id || 0);
const songName = computed(() => thisSong.value?.name || '未知歌名');
const artistName = computed(() => thisSong.value?.artists.map(artist => artist.name).join('、') || '未知歌手');
const songPicUrl = computed(() => thisSong.value?.album.picUrl);

const listIsVisiable = ref(false);

const progress = ref(0);
const isDragging = ref(false);

const startHandleDrag = (event: MouseEvent) => {
    event.stopPropagation(); // 防止触发父元素的事件
    isDragging.value = true;
};

const startDrag = (event: MouseEvent) => {
    isDragging.value = true;
    updateProgressFromEvent(event, false); // 拖拽时仅更新显示
};

const drag = (event: MouseEvent) => {
    if (isDragging.value) {
        updateProgressFromEvent(event, false); // 拖拽时仅更新显示
    }
};

const endDrag = () => {
    if (isDragging.value) {
        isDragging.value = false;
        // 拖拽结束时更新音频播放位置
        if (playinglistStore.audio.duration) {
            playinglistStore.audio.currentTime = (progress.value / 100) * playinglistStore.audio.duration;
        }
    }
};

const updateProgressFromEvent = (event: MouseEvent, updateAudioTime: boolean) => {
    const progressBar = event.currentTarget as HTMLDivElement;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newProgress = Math.min(Math.max(offsetX / rect.width, 0), 1); // 限制范围在 0-1
    progress.value = newProgress * 100;

    // 如果需要实时更新 audio 时间
    if (updateAudioTime && playinglistStore.audio.duration) {
        playinglistStore.audio.currentTime = newProgress * playinglistStore.audio.duration;
    }
};

const updateProgress = () => {
    if (!isDragging.value && playinglistStore.audio.duration) {
        progress.value = (playinglistStore.audio.currentTime / playinglistStore.audio.duration) * 100;
    }
};

onMounted(() => {
    playinglistStore.audio.addEventListener('timeupdate', updateProgress);
});

onUnmounted(() => {
    playinglistStore.audio.removeEventListener('timeupdate', updateProgress);
});


const getSelfPlayPauseIcon = (url: string) => {
    // if (playinglistStore.playingUrl === url && (!playinglistStore.audio.paused)) {
    if (playinglistStore.playingUrl === url && (playinglistStore.isPlaying)) {
        // 这里的地址必须是相对根目录的
        return "./icons/pause.svg";
    }
    return "./icons/play.svg";
};

const playSelfSong = (url: string) => {
    // 本首歌的状态切换
    if (playinglistStore.audio.src === url) {
        if (playinglistStore.isPlaying) {
            // 如果当前正在播放，点击则暂停
            console.log("正在播放这首歌，暂停")
            playinglistStore.pauseAudio();
            console.log("paused??:", playinglistStore.audio.paused)
        } else {
            // 暂停了，继续播放
            console.log("正在暂停这首歌，播放")
            playinglistStore.playAudio(url);
            console.log("paused??:", playinglistStore.audio.paused)
        }
    }
};

const playPrev = (url: string) => {
    // 本首歌的状态切换
    if (playinglistStore.audio.src === url) {
        if (playinglistStore.isPlaying) {
            // 如果当前正在播放，点击则暂停了再切下一首
            console.log("正在播放这首歌，暂停后播上一首")
            playinglistStore.pauseAudio();
        } else {
            // 暂停了，直接下一首
            console.log("正在暂停这首歌，直接上一首")
        }
        playinglistStore.playingIndex = (playinglistStore.playingIndex as number - 1 + playinglistStore.songsAtList.length) % playinglistStore.songsAtList.length;
        playinglistStore.playAudio(songUrl.value);
    }
    else {
        console.log("没数据，不干");
        return;
    }
};

const playNext = (url: string) => {
    // 本首歌的状态切换
    if (playinglistStore.audio.src === url) {
        if (playinglistStore.isPlaying) {
            // 如果当前正在播放，点击则暂停了再切下一首
            console.log("正在播放这首歌，暂停后播下一首")
            playinglistStore.pauseAudio();
        } else {
            // 暂停了，直接下一首
            console.log("正在暂停这首歌，直接下一首")
        }
        playinglistStore.playingIndex = (playinglistStore.playingIndex as number + 1) % playinglistStore.songsAtList.length;
        playinglistStore.playAudio(songUrl.value);
    }
    else {
        console.log("没数据，不干");
        return;
    }
};

const getLikeDislikeIcon = (id: number) => {
    return mysongStore.isAtList(id)
        ? "./icons/heartfill.svg"
        : "./icons/heart.svg";
}

const toggleLike = (id: number) => {
    //已收藏，取消收藏
    if (mysongStore.isAtList(id)) {
        //弹窗询问是否取消
        ElMessageBox.confirm(
            '确定取消收藏？', // 弹窗提示
            '取消收藏', // 弹窗标题
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning', // 设置弹窗类型为警告
            }
        ).then(() => {
            // 用户确认取消关注，删除歌手
            delete mysongStore.songs[id]; // 使用 delete 删除对象中的属性
        }).catch(() => {
            // 用户点击了取消，不做任何操作
            console.log('取消这次操作');
        });
    } else {    //关注
        mysongStore.songs[id] = thisSong.value as Song;

        // 显示收藏成功的提示消息
        ElMessage({
            message: '收藏成功',
            type: 'success',  // 成功类型
            duration: 1000,   // 1秒后自动关闭
        });
    }
}

const displayList = () => {
    listIsVisiable.value = !listIsVisiable.value;
}

const getPlayPauseIcon = (url: string) => {
    // if (playinglistStore.playingUrl === url && (!playinglistStore.audio.paused)) {
    if (playinglistStore.playingUrl === url && (playinglistStore.isPlaying)) {
        // 这里的地址必须是相对根目录的
        return "./icons/暂停.svg";
    }
    return "./icons/播放.svg";
};

const playSong = (url: string, index: number) => {
    // 本首歌的状态切换
    if (playinglistStore.audio.src === url) {
        if (playinglistStore.isPlaying) {
            // 如果当前正在播放，点击则暂停
            console.log("正在播放这首歌，暂停")
            playinglistStore.pauseAudio();
            console.log("paused??:", playinglistStore.audio.paused)
        } else {
            // 暂停了，继续播放
            console.log("正在暂停这首歌，播放")
            playinglistStore.playAudio(url);
            console.log("paused??:", playinglistStore.audio.paused)
        }
    } else {
        // 如果当前未播放或者放的别的歌
        console.log("未播放或者放别的歌");
        playinglistStore.playingIndex = index;
        playinglistStore.playAudio(url); // 播放音乐

    }
};
</script>

<style scoped>
.mini-player {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-left: 1px solid #fff;
    width: 900px;
    padding-left: 50px;
    box-sizing: content-box;
    height: 100%;
    margin-left: 20px;
}

.song-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.img-wrapper {
    width: 47px;
    height: 47px;
    border: 7px solid #222;
    border-radius: 50%;
    overflow: hidden;
    background-color: #333;
}

img {
    width: 100%;
    height: 100%;
}

.name-info {
    margin: auto 10px;
}

.song-name {
    font-size: 14px;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
}

.artist-name {
    font-size: 8px;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
}

.player-info {
    width: 75%;
}

.player-buttons {
    height: 20px;
    width: 40%;
    margin: 10px auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.player-buttons>* {
    width: 20px;
    transform: translateY(10%);
    transition: 0.4s;
}

.player-buttons>*:hover {
    transform: translateY(20%);
}

.progress-bar {
    position: relative;
    width: 400px;
    margin: 6px auto;
    height: 4px;
    background-color: #ccc;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
}

.progress {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background-color: #83acbb;
    border-radius: 4px;
    transition: width 0.1s linear;
}

.progress-handle {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
    height: 12px;
    background-color: #fff;
    border: 2px solid #83acbb;
    border-radius: 50%;
    display: none;
}

.progress-bar:hover .progress-handle,
.progress-bar .progress-handle:active {
    display: block;
}

.right-buttons {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-right: 20px;
}

.right-buttons>* img {
    position: relative;
    width: 180%;
    transform: translateY(10%);
    transition: 0.4s;
}

.right-buttons>* img:hover {
    transform: translateY(-30%);
}

.like {
    margin-right: 20px;
}

.playlist {
    top: 100%;
    /* 紧贴 mini-player 的下边框 */
    right: 0;
    /* 与 mini-player 的右边框对齐 */
    z-index: 5;
    position: absolute;
    width: 400px;
    /* padding-left: 50px; */
    box-sizing: border-box;
    box-shadow: -8px 8px 8px #0e232b;
    border-radius: 8px;
    height: 700px;
    margin-right: 20px;
    padding-bottom: 10px;
    background-color: #132f39;
    overflow-y: auto;
}

.playlist::-webkit-scrollbar {
    width: 0;
    /* 滚动条宽度 */
}

.playlist>.playlist-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: center;
    margin-top: 10px;
}

.id-num {
    flex: 1;
}

.album-pic {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.album-pic img {
    width: 80%;
}

.playlist .song-name {
    flex: 3;
}

.playlist .artist-name {
    flex: 2;
}

.play-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.play-button img {
    width: 24px;
}

.like-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.like-button img {
    width: 24px;
}
</style>