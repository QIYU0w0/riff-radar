<template>
    <div class="album-desc">
        <img class="album-pic" :src="desc.picUrl" alt="专辑封面" v-if="desc.picUrl">
        <div class="album-info">
            <p class="name">{{ desc.name }}</p>
            <div class="count">
                <span class="publish-time">{{ desc.publishTime }}&nbsp;发行</span>
                <span class="track-cnt">{{ desc.size }}&nbsp;首歌</span>
            </div>
            <div v-if="desc.artist" class="artist">
                <router-link class="router-link" :to="{ path: '/artist', query: { artistid: desc.artist.id } }">
                    <img class="artist-pic" :src="desc.artist.picUrl" alt="">
                    <p class="artist-name">{{ desc.artist.name }}</p>
                </router-link>
            </div>
        </div>
    </div>
    <SongsList :songs="songsList" />
</template>

<script setup lang="ts">
import SongsList from '@/components/SongsList.vue';
import { useRoute } from 'vue-router';
import { onMounted, computed, watch } from 'vue';
import { useAlbumStore } from '@/stores/album';

// 路由实例
const route = useRoute();
// pinia专辑数据
const albumStore = useAlbumStore();

// 当前专辑ID（确保是有效的数字）
const albumId = computed(() => {
    const id = route.query.albumid;
    return id && !isNaN(Number(id)) ? Number(id) : null;
});

// 专辑描述数据
const desc = computed(() => albumStore.descs[albumId.value as number] || {});

const songsList = computed(() => albumStore.songs[albumId.value as number] || []);

// 页面加载时获取专辑信息
const loadAlbum = async (id: number | null) => {
    if (!id) {
        console.error(`未提供有效专辑ID, ${id}`);
        return;
    }
    // id是数字就直接请求，缓存是否有效会在函数内部处理
    await albumStore.getAlbum(id);
}

// 初次加载
onMounted(() => {
    loadAlbum(albumId.value);
});

// 路由变化时重新加载
watch(albumId, (newId) => loadAlbum(newId));
</script>

<style scoped>
.album-desc {
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 100px;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    height: 180px;
    max-width: 1300px;
}

.album-pic {
    width: 180px;
    height: 180px;
    border-radius: 8px;
    margin-right: 30px;
}

.album-info {
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

.publish-time {
    margin-right: 30px;
}

.router-link {
    display: contents;
    /* 保持内部结构 */
    color: inherit;
    /* 保持文本颜色 */
}

.artist {
    font-size: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
}

.artist-pic {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
}
</style>