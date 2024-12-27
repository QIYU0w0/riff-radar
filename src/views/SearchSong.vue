<template>
    <SongsList :songs="songsList" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import SongsList from '@/components/SongsList.vue';
import type { Song } from '@/types/song';

const route = useRoute();
const searchStore = useSearchStore();
const songsList = ref<Song[]>([]);

// 使用 onMounted 来确保 Pinia store 加载完数据.获取歌曲数据.
onMounted(async () => {
    if (!searchStore.isCacheValid(searchStore.currentQuery)) {
        await searchStore.searchAll(searchStore.currentQuery);
    }
    songsList.value = searchStore.songs[searchStore.currentQuery] || [];
});

// 监听路由query变化
watch(() => route.query.keywords, async (newQuery) => {
    if (newQuery) {
        searchStore.currentQuery = newQuery as string;
        if (!searchStore.isCacheValid(newQuery as string)) {
            await searchStore.searchAll(newQuery as string);
        }
        songsList.value = searchStore.songs[newQuery as string] || [];
    }
});
</script>

<style scoped></style>