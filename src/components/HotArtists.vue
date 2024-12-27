<template>
    <div class="hot-artists" @mouseenter="stopAutoPlay" @mouseleave="restartAutoPlay">
        <h2 class="title">热门歌手</h2>
        <div class="artist-inner">
            <div class="artist-row">
                <div class="artist-item" v-for="artist in currentArtists" :key="artist.id">
                    <router-link :to="{ path: '/artist', query: { artistid: artist.id } }">
                        <div class="artist-img-wrapper">
                            <img class="artist-img" :src="artist.picUrl" :alt="artist.name" />
                        </div>
                        <div class="artist-info">
                            <h3>{{ artist.name }}</h3>
                        </div>
                    </router-link>

                </div>
            </div>
            <button class="artist-control left" @click="prevSlide">←</button>
            <button class="artist-control right" @click="nextSlide">→</button>
        </div>
    </div>
</template>


<script setup lang="ts">
import { useHotartistStore } from "@/stores/hotartist";
import { ref, computed, onMounted, onUnmounted } from "vue";

const hotartistStore = useHotartistStore();
const currentIndex = ref(0); // 当前页索引
const interval = ref<number | null>(null); // 定时器引用
const pageSize = 5; // 每页显示 5 个歌单

// 计算当前显示的歌手
const currentArtists = computed(() => {
    const start = currentIndex.value * pageSize;
    const end = start + pageSize;
    return hotartistStore.artists.slice(start, end);
});

// 下一页
const nextSlide = () => {
    const totalPages = Math.ceil(hotartistStore.artists.length / pageSize); // 动态计算总页数
    currentIndex.value = (currentIndex.value + 1) % totalPages;
};

// 上一页
const prevSlide = () => {
    const totalPages = Math.ceil(hotartistStore.artists.length / pageSize);
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
    await hotartistStore.getArtists(); // 获取歌单数据
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay(); // 清理定时器
});
</script>



<style scoped>
.hot-artists {
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

.artist-inner {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.artist-row {
    display: flex;
    gap: 10px;
    justify-content: space-between;
}

.artist-item {
    flex: 1;
}

.artist-item a {
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.artist-img-wrapper {
    position: relative;
    width: 100%;
    height: auto;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border-radius: 50%;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;

}

.artist-img {
    width: 100%;
    height: 100%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    object-fit: cover;
    transition: all 0.7s ease;
}

.artist-item:hover .artist-img {
    transform: scale(1.2);
}

.artist-info {
    text-align: center;
    color: #ddd;
    font-size: 16px;
    line-height: 32px;
}

.artist-info h3 {
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 用省略号代替溢出的内容 */
    width: 250px;
    /* 设置最大宽度，确保生效 */
}

.artist-control {
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

.artist-inner:hover .artist-control {
    opacity: 1;
    /* 鼠标悬浮时可见 */
}

.artist-control.left {
    left: 0;
}

.artist-control.right {
    right: 0;
}

.artist-control:hover {
    background: rgba(0, 0, 0, 0.7);
}
</style>