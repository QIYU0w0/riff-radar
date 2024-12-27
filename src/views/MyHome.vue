<script setup lang="ts">
import Banner from '@/components/Banner.vue';
import HotPlaylists from '@/components/HotPlaylists.vue';
import HotSongs from '@/components/HotSongs.vue';
import HotArtists from '@/components/HotArtists.vue';
</script>

<template>
    <div class="home">
        <Banner></Banner>
        <HotPlaylists></HotPlaylists>
        <HotSongs></HotSongs>
        <HotArtists></HotArtists>
    </div>
</template>

<style scoped>
.home {
    /* border: red solid 1px; */
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 100px;
    padding: 0;
}

.home>* {
    padding-bottom: 70px;
    /* 根据需要调整距离 */
}
</style>