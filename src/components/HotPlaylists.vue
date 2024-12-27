<template>
    <div class="hot-playlists" @mouseenter="stopAutoPlay" @mouseleave="restartAutoPlay">
        <h2 class="title">精品歌单</h2>
        <div class="playlist-inner">
            <div class="playlist-row">
                <div class="playlist-item" v-for="playlist in currentPlaylists" :key="playlist.id">
                    <router-link :to="{ path: '/playlist', query: { playlistid: playlist.id } }">
                        <div class="playlist-img-wrapper">
                            <img class="playlist-img" :src="playlist.picUrl" :alt="playlist.name" />
                        </div>
                        <div class="playlist-info">
                            <h3>{{ playlist.name }}</h3>
                        </div>
                    </router-link>

                </div>
            </div>
            <button class="playlist-control left" @click="prevSlide">←</button>
            <button class="playlist-control right" @click="nextSlide">→</button>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useHotplaylistStore } from "@/stores/hotplaylist";
import { ref, computed, onMounted, onUnmounted } from "vue";

const hotplaylistStore = useHotplaylistStore();
const currentIndex = ref(0); // 当前页索引
const interval = ref<number | null>(null); // 定时器引用
const pageSize = 5; // 每页显示 5 个歌单

// 计算当前显示的歌单
const currentPlaylists = computed(() => {
    const start = currentIndex.value * pageSize;
    const end = start + pageSize;
    return hotplaylistStore.playlists.slice(start, end);
});

// 下一页
const nextSlide = () => {
    const totalPages = Math.ceil(hotplaylistStore.playlists.length / pageSize); // 动态计算总页数
    currentIndex.value = (currentIndex.value + 1) % totalPages;
};

// 上一页
const prevSlide = () => {
    const totalPages = Math.ceil(hotplaylistStore.playlists.length / pageSize);
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
    await hotplaylistStore.getPlaylists(); // 获取歌单数据
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay(); // 清理定时器
});
</script>



<style scoped>
.hot-playlists {
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

.playlist-inner {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.playlist-row {
    display: flex;
    gap: 10px;
    justify-content: space-between;
}

.playlist-item {
    flex: 1;
}

.playlist-item a {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.playlist-img-wrapper {
    position: relative;
    width: 100%;
    height: auto;
    overflow: hidden;
    border-radius: 10px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

}

.playlist-img {
    width: 100%;
    height: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    object-fit: cover;
    transition: all 0.7s ease;
}

.playlist-item:hover .playlist-img {
    transform: scale(1.2);
}

.playlist-info {
    text-align: center;
    color: #ddd;
    font-size: 16px;
    line-height: 32px;
}

.playlist-info h3 {
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 用省略号代替溢出的内容 */
    width: 250px;
    /* 设置最大宽度，确保生效 */
}

.playlist-control {
    position: absolute;
    top: 50%;
    transform: translateY(-90%);
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
    /* 默认不可见 */
    transition: opacity 0.3s ease;
    /* 平滑过渡效果 */
}

.playlist-inner:hover .playlist-control {
    opacity: 1;
    /* 鼠标悬浮时可见 */
}

.playlist-control.left {
    left: 0;
}

.playlist-control.right {
    right: 0;
}

.playlist-control:hover {
    background: rgba(0, 0, 0, 0.7);
}
</style>