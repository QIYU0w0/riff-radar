<template>
    <div class="top-bar">
        <div class="search">
            <input type="text" placeholder="发现新音乐" @keydown.enter="handleSearch" v-model="tempQuery">
            <div class="search-icon" @click="handleSearch"></div>
        </div>
        <MiniPlayer />
    </div>
</template>

<script setup lang="ts">
import MiniPlayer from './MiniPlayer.vue'
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();

import { useSearchStore } from '../stores/search';
const searchStore = useSearchStore();

const tempQuery = ref(''); // 临时搜索关键词

const handleSearch = async () => {
    if (tempQuery.value) {
        // 将临时关键词更新到路由和状态
        router.push({ path: '/search/songs', query: { keywords: tempQuery.value } });
        searchStore.currentQuery = tempQuery.value;
    }
};

// 监听 route.query.keywords 变化，更新 searchStore.currentQuery
watch(() => route.query.keywords, async (newQuery) => {
    if (newQuery && newQuery != tempQuery.value) {
        searchStore.currentQuery = newQuery as string;  // 更新查询关键词
        tempQuery.value = newQuery as string;
    }
}, { immediate: true });

</script>

<style scoped>
.top-bar {
    position: fixed;
    top: 0;
    left: 210px;
    right: 0;
    height: 50px;
    background-color: #1d4655;
    /* border-radius: 3px 0 0 3px; */
    border-radius: 3px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    transition: 0.2s;
    z-index: 100;
}

@media (max-width: 950px) {
    .top-bar {
        left: 160px;
    }

    input {
        width: 130px;
    }
}

.search {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.top-bar input {
    margin-right: 5px;
    padding-left: 10px;
    background-color: #d6e3e8;
    border-radius: 6px;
    border: #0a171c solid 1px;
    font-size: 14px;
    height: 24px;
    outline: none;
    transition: 0.2s;
}

.search-icon {
    background-image: url('./icons/search.svg');
    background-size: 14px 14px;
    background-color: #d6e3e8;
    border: #0a171c solid 1px;
    border-radius: 6px;
    /* 设置图标大小 */
    background-repeat: no-repeat;
    /* 防止重复 */
    background-position: center;
    /* 将图标居中 */
    width: 24px;
    /* 背景框宽度 */
    height: 24px;
    /* 背景框高度 */
}

/* a {
    display: block;
    width: 100%;
    height: 100%;
} */
</style>
