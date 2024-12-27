<template>
    <div class="carousel" @mouseenter="stopAutoPlay" @mouseleave="restartAutoPlay">
        <div class="carousel-inner">
            <div v-for="(album, index) in bannerStore.albums" :key="album.id" class="carousel-item" :class="{
                active: index === currentIndex,
                prev: index === getPrevIndex(),
                next: index === getNextIndex()
            }">

                <!-- 添加 router-link -->
                <router-link v-if="index === currentIndex" :to="{ path: '/album', query: { albumid: album.id } }"
                    class="router-link">
                    <!-- 背景模糊部分 -->
                    <div class="blur-bg" :style="{ backgroundImage: `url(${album.picUrl})` }"></div>
                    <!-- 正方形图片 -->
                    <div class="center-image-wrapper">
                        <img :src="album.picUrl" :alt="album.name" class="center-image" />
                    </div>
                    <!-- 信息部分 -->
                    <div class="album-info">
                        <h3>{{ album.name }}</h3>
                    </div>
                </router-link>

                <!-- 非 active 状态内容保持原样 -->
                <div v-else class="router-link">
                    <div class="center-image-wrapper">
                        <img :src="album.picUrl" :alt="album.name" class="center-image" />
                    </div>
                </div>

            </div>
            <button class="carousel-control left" @click="prevSlide">←</button>
            <button class="carousel-control right" @click="nextSlide">→</button>
        </div>

    </div>
</template>


<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useBannerStore } from '@/stores/banner';

const bannerStore = useBannerStore();
const currentIndex = ref(0); // 当前显示的轮播图索引
const interval = ref<number | null>(null); // 定时器引用

// 获取前一个索引
const getPrevIndex = () => {
    return (currentIndex.value - 1 + bannerStore.albums.length) % bannerStore.albums.length;
};

// 获取后一个索引
const getNextIndex = () => {
    return (currentIndex.value + 1) % bannerStore.albums.length;
};

// 切换到下一张
const nextSlide = () => {
    currentIndex.value = getNextIndex();
    restartAutoPlay(); // 手动切页后，重新计时
};

// 切换到上一张
const prevSlide = () => {
    currentIndex.value = getPrevIndex();
    restartAutoPlay(); // 手动切页后，重新计时
};

// 自动播放逻辑
const startAutoPlay = () => {
    interval.value = setInterval(() => {
        nextSlide();
    }, 3000); // 每 3 秒切换一次
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
    stopAutoPlay(); // 清理旧的计时器
    startAutoPlay(); // 启动新的计时器
};

// 生命周期钩子
onMounted(async () => {
    await bannerStore.getBanner(); // 获取最新专辑数据
    startAutoPlay();
});

onUnmounted(() => {
    stopAutoPlay(); // 清理定时器
});
</script>

<style scoped>
.carousel {
    position: relative;
    width: 100%;
    max-width: 1300px;
    margin: 0 auto;
    overflow: hidden;
}

.carousel-inner {
    position: relative;
    height: 300px;
    /* 高度固定为400px */
}

.carousel-item {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: transform 0.3s ease, z-index 0.3s ease;
}

.carousel-item.active {
    z-index: 3;
    opacity: 1;
}

.carousel-item.prev {
    transform: translateX(-30%) scale(1);
    z-index: 2;
    opacity: 1;
}

.carousel-item.next {
    transform: translateX(30%) scale(1);
    z-index: 2;
    opacity: 1;
}

.router-link {
    display: contents;
    /* 保持内部结构 */
    text-decoration: none;
    /* 移除下划线 */
    color: inherit;
    /* 保持文本颜色 */
}

.blur-bg {
    position: absolute;
    top: 0;
    left: 50%;
    width: 65%;
    height: 100%;
    transform: translateX(-50%);
    background-size: cover;
    background-position: center;
    filter: blur(10px);
    /* 模糊效果 */
    z-index: 0;
    border-radius: 16px;
}

.carousel-item.active .center-image-wrapper {
    position: relative;
    width: auto;
    /* 固定正方形宽度 */
    height: 70%;
    /* 固定正方形高度 */
    z-index: 2;
    overflow: hidden;
    /* 防止溢出 */
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
}

.carousel-item.prev .center-image-wrapper,
.carousel-item.next .center-image-wrapper {
    position: relative;
    width: 40%;
    /* 固定正方形宽度 */
    height: 85%;
    /* 固定正方形高度 */
    z-index: 2;
    overflow: hidden;
    /* 防止溢出 */
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    filter: blur(1px);
}

.carousel-item.active .center-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.carousel-item.prev .center-image,
.carousel-item.next .center-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.album-info {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    text-shadow: 0 0 5px rgba(0, 0, 0, 0.7);
    z-index: 3;
}

.carousel-control {
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
    /* 默认不可见 */
    transition: opacity 0.3s ease;
    /* 平滑过渡效果 */
}

.carousel:hover .carousel-control {
    opacity: 1;
    /* 鼠标悬浮时可见 */
}

.carousel-control.left {
    left: 10px;
}

.carousel-control.right {
    right: 10px;
}

.carousel-control:hover {
    background: rgba(0, 0, 0, 0.7);
}
</style>
