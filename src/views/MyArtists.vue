<!-- MyArtists.vue -->
<template>
    <div class="myartist-desc">
        <div class="myartist-pic-wrapper">
            <img class="myartist-pic" src="../components/icons/artist.svg" alt="">
        </div>
        <div class="myartist-info">
            <p class="name">关注歌手</p>
            <div class="count">
                <span class="artist-cnt">关注数：{{ artistsList.length }}</span>
            </div>
        </div>
    </div>
    <ArtistsList :artists="artistsList" />
</template>

<script setup lang="ts">
import ArtistsList from '@/components/ArtistsList.vue';
import { computed } from 'vue';
import { useMyartistStore } from '@/stores/myartist';

const myartistStore = useMyartistStore();

const artistsList = computed(() => Object.values(myartistStore.artists) || []);
</script>

<style scoped>
.myartist-desc {
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 100px;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    height: 180px;
    max-width: 1300px;
}

.myartist-pic-wrapper {
    width: 180px;
    height: 180px;
    border: 8px solid #98bac7;
    border-radius: 24px;
    margin-right: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.myartist-pic {
    width: 70%;
}

.myartist-info {
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
}
</style>