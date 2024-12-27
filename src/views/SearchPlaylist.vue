<template>
    <ul class="playlists-list">
        <li>
            <p class="id-num">#</p>
            <p class="playlist-pic">封面</p>
            <p class="playlist-name">标题</p>
            <p class="track-cnt">歌曲数</p>
            <p class="creator-name">创建者</p>
            <p class="play-cnt">播放量</p>
        </li>
        <li v-for="(playlist, index) in playlistsList" :key="index + 1">
            <router-link :to="{ path: '/playlist', query: { playlistid: playlist.id } }">
                <p class="id-num">{{ index + 1 }}</p>
                <div class="playlist-pic"><img :src="playlist.picUrl" alt="无封面"></div>
                <p class="playlist-name">{{ playlist.name }}</p>
                <p class="track-cnt">{{ playlist.trackCount }}首</p>
                <p class="creator-name">{{ playlist.creatorName }}</p>
                <p class="play-cnt">{{ playlist.playCount }}</p>
            </router-link>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSearchStore } from '@/stores/search';
import type { Playlist } from '@/types/playlist';
const route = useRoute();
const searchStore = useSearchStore();
const playlistsList = ref<Playlist[]>([]);

// 使用 onMounted 来确保 Pinia store 加载完数据.获取歌曲数据.
onMounted(async () => {
    if (!searchStore.isCacheValid(searchStore.currentQuery)) {
        await searchStore.searchAll(searchStore.currentQuery);
    }
    playlistsList.value = searchStore.playlists[searchStore.currentQuery] || [];
});

// 监听路由query变化
watch(() => route.query.keywords, async (newQuery) => {
    if (newQuery) {
        searchStore.currentQuery = newQuery as string;
        if (!searchStore.isCacheValid(newQuery as string)) {
            await searchStore.searchAll(newQuery as string);
        }
        playlistsList.value = searchStore.playlists[newQuery as string] || [];
    }
});
</script>

<style scoped>
.playlists-list {
    /* border: red solid 1px; */
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 150px;
    padding: 0;
}

li,
li a {
    display: flex;
    margin-bottom: 25px;
    align-items: center;
    color: #fff;
}

li>* {
    padding: 0;
    margin: 0;
    border: none;
    text-align: center;
}

.id-num {
    flex: 1;
}

.playlist-pic {
    flex: 2;
}

.playlist-pic img {
    border-radius: 8px;
    width: 50%;
}

.playlist-name {
    flex: 6
}

.track-cnt {
    flex: 2;
}

.creator-name {
    flex: 4;
}

.play-cnt {
    flex: 3;
}
</style>