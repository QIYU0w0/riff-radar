<!-- SearchArtist.vue -->
<template>
    <ArtistsList :artists="artistsList" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import ArtistsList from '@/components/ArtistsList.vue';

const route = useRoute();
const searchStore = useSearchStore();
const artistsList = ref<{ id: number, name: string, picUrl: string }[]>([]);

// 使用 onMounted 来确保 Pinia store 加载完数据.获取数据.
onMounted(async () => {
    if (!searchStore.isCacheValid(searchStore.currentQuery)) {
        await searchStore.searchAll(searchStore.currentQuery);
    }
    artistsList.value = searchStore.artists[searchStore.currentQuery] || [];
});

// 监听路由query变化
watch(() => route.query.keywords, async (newQuery) => {
    if (newQuery) {
        searchStore.currentQuery = newQuery as string;
        if (!searchStore.isCacheValid(newQuery as string)) {
            await searchStore.searchAll(newQuery as string);
        }
        artistsList.value = searchStore.artists[newQuery] || [];
    }
});

</script>

<style scoped></style>