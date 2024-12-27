<template>
    <div class="playlist-desc">
        <img class="playlist-pic" :src="descs.picUrl" alt="歌单封面" v-if="descs.picUrl">
        <div class="playlist-info">
            <p class="name">{{ descs.name }}</p>
            <div class="count">
                <span class="play-cnt">{{ descs.playCount }}&nbsp;次播放</span>
                <span class="track-cnt">{{ descs.trackCount }}&nbsp;首歌</span>
            </div>
            <div class="creator">
                <img class="creator-pic" :src="descs.creatorPicUrl" alt="">
                <p class="creator-name">{{ descs.creatorName }}</p>
            </div>
        </div>
    </div>
    <SongsList :songs="songsList" />
</template>

<script setup lang="ts">
import SongsList from '@/components/SongsList.vue';
import { useRoute } from 'vue-router';
import { onMounted, computed, watch } from 'vue';
import { usePlaylistStore } from '@/stores/playlist';

// 路由实例
const route = useRoute();
// Pinia 歌手数据存储
const playlistStore = usePlaylistStore();

// 当前歌手ID（确保是有效的数字）
const playlistId = computed(() => {
    const id = route.query.playlistid;
    return id && !isNaN(Number(id)) ? Number(id) : null;
});

// 歌单描述数据
const descs = computed(() => playlistStore.descs[playlistId.value] || {});

// 歌单单曲数据
const songsList = computed(() => playlistStore.songs[playlistId.value] || []);

// 页面加载时获取歌单信息
const loadPlaylist = async (id: number | null) => {
    if (!id) {
        console.error(`未提供有效的歌单ID, ${id}`);
        return;
    }
    // id是数字就直接请求，缓存是否有效会在函数内部处理
    await playlistStore.getDetail(id);
};

// 初次加载
onMounted(() => loadPlaylist(playlistId.value));

// 路由变化时重新加载
watch(playlistId, (newId) => loadPlaylist(newId));

</script>

<style scoped>
.playlist-desc {
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 100px;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    height: 180px;
}

.playlist-pic {
    width: 180px;
    height: 180px;
    border-radius: 8px;
    margin-right: 30px;
}

.playlist-info {
    height: 180px;
    display: flex;
    flex-direction: column;
    /* 使子元素垂直排列 */
    justify-content: space-between;
}

.name {
    color: white;
    font-size: 36px;
    line-height: 36px;
}

.count {
    font-size: 20px;
    margin-bottom: 36px;
}

.play-cnt {
    margin-right: 30px;
}

.creator {
    font-size: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.creator-pic {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
}
</style>