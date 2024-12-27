<template>
    <div class="hot-songs" @mouseenter="stopAutoPlay" @mouseleave="restartAutoPlay">
        <h2 class="title">单曲推荐</h2>
        <div class="song-inner">
            <div class="song-row" v-for="(row, rowIndex) in currentPlaylists" :key="rowIndex">
                <div class="song-item" @click="playSong(song.url, currentIndex * 6 + rowIndex * 3 + index)"
                    v-for="(song, index) in row" :key="song.id">
                    <div class="song-img-wrapper">
                        <img class="song-img" :src="song.album.picUrl" :alt="song.name" />
                    </div>
                    <div class="song-info">
                        <h3 class="song-name">{{ song.name }}</h3>
                        <p class="song-artist">{{ song.artists.map(artist => artist.name).join(", ") }}</p>
                    </div>
                </div>
            </div>
            <button class="song-control left" @click="prevSlide">←</button>
            <button class="song-control right" @click="nextSlide">→</button>
        </div>
    </div>
</template>



<script setup lang="ts">
import { useHotsongStore } from "@/stores/hotsong";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { usePlayinglistStore } from "@/stores/playinglist";

const hotsongStore = useHotsongStore();
const playinglistStore = usePlayinglistStore();
const currentIndex = ref(0); // 当前页索引
const interval = ref<number | null>(null); // 定时器引用
const pageSize = 6; // 每页显示6首歌

onMounted(async () => {
    if (playinglistStore.songsAtList.length === 0) {
        console.log("刷新界面");
        playinglistStore.pauseAudio();
    } else {
        console.log("不是刷新，不改变播放状态");
    }
});

const playSong = (url: string, index: number) => {
    // 本首歌的状态切换
    if (playinglistStore.audio.src === url) {
        if (playinglistStore.isPlaying) {
            // 如果当前正在播放，点击则暂停
            console.log("正在播放这首歌，暂停")
            playinglistStore.pauseAudio();
        } else {
            // 暂停了，继续播放
            console.log("正在暂停这首歌，播放")
            playinglistStore.playAudio(url);
        }
    } else {
        // 如果当前未播放或者放的别的歌
        console.log("未播放或者放别的歌");
        playinglistStore.clearAll();
        playinglistStore.songsAtList.push(...hotsongStore.songs);
        playinglistStore.playingIndex = index;
        playinglistStore.playAudio(url); // 播放音乐
    }
};

// 计算当前显示的歌单
const currentPlaylists = computed(() => {
    const start = currentIndex.value * pageSize;    //这一页的第一个歌单在hotsongs里的索引
    const end = start + pageSize;
    const pageSongs = hotsongStore.songs.slice(start, end);

    // 将歌曲分成两行，每行3首
    const rows = [];
    for (let i = 0; i < pageSongs.length; i += 3) {
        rows.push(pageSongs.slice(i, i + 3));
    }
    return rows;
});

// 下一页
const nextSlide = () => {
    const totalPages = Math.ceil(hotsongStore.songs.length / pageSize); // 动态计算总页数
    currentIndex.value = (currentIndex.value + 1) % totalPages;
};

// 上一页
const prevSlide = () => {
    const totalPages = Math.ceil(hotsongStore.songs.length / pageSize);
    currentIndex.value = (currentIndex.value - 1 + totalPages) % totalPages;
};

// 自动播放逻辑
const startAutoPlay = () => {
    interval.value = setInterval(() => {
        nextSlide();
    }, 5000); // 每 5 秒切换一次
};

// 停止自动播放
const stopAutoPlay = () => {
    if (interval.value) {
        clearInterval(interval.value);
        interval.value = null;
    }
};

// 鼠标移开时重新开始自动播放
const restartAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
};

// 生命周期钩子
onMounted(async () => {
    await hotsongStore.getSongs(); // 获取歌单数据
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay(); // 清理定时器
});
</script>



<style scoped>
.hot-songs {
    position: relative;
    width: 100%;
    max-width: 1300px;
    margin-left: 0;
    overflow: hidden;
}

.title {
    margin-bottom: 30px;
    color: #ddd;
}

.song-inner {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.song-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    /* 项目间距 */
    margin-bottom: 20px;
    /* 两行之间的间距 */
}

.song-item {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.05);
    transition: background 0.3s ease;
}

.song-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.song-img-wrapper {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    margin-right: 15px;
    overflow: hidden;
    border-radius: 8px;
}

.song-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.song-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: #ddd;
    overflow: hidden;
}

.song-name {
    font-size: 18px;
    font-weight: bold;
    white-space: nowrap;
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.song-artist {
    font-size: 14px;
    color: #aaa;
    white-space: nowrap;
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.song-control {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.song-inner:hover .song-control {
    opacity: 1;
}

.song-control.left {
    left: 0;
}

.song-control.right {
    right: 0;
}

.song-control:hover {
    background: rgba(0, 0, 0, 0.7);
}
</style>
