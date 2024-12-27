<!-- MySongs.vue -->
<template>
    <div class="mysong-desc">
        <div class="mysong-pic-wrapper">
            <img class="mysong-pic" src="../components/icons/like.svg" alt="">
        </div>
        <div class="mysong-info">
            <p class="name">红心单曲</p>
            <div class="count">
                <span class="track-cnt">歌曲数：{{ songsList.length }}</span>
            </div>
        </div>
    </div>
    <SongsList :songs="songsList" />
</template>

<script setup lang="ts">
import SongsList from '@/components/SongsList.vue';
import { computed } from 'vue';
import { useMysongStore } from '@/stores/mysong';

const mysongStore = useMysongStore();

const songsList = computed(() => Object.values(mysongStore.songs) || []);
</script>


<style scoped>
.mysong-desc {
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 100px;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    height: 180px;
    max-width: 1300px;
}

.mysong-pic-wrapper {
    width: 180px;
    height: 180px;
    border: 8px solid #98bac7;
    border-radius: 24px;
    margin-right: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.mysong-pic {
    width: 80%;
}

.mysong-info {
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