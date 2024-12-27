<script setup lang="ts">
</script>

<template>
    <div class="search-type">
        <router-link :to="{ path: '/search/songs', query: { keywords: $route.query.keywords } }">单曲</router-link>
        <router-link :to="{ path: '/search/artists', query: { keywords: $route.query.keywords } }">歌手</router-link>
        <router-link :to="{ path: '/search/playlists', query: { keywords: $route.query.keywords } }">歌单</router-link>
    </div>
    <router-view />

</template>

<style scoped>
.search-type {
    position: fixed;
    left: 210px;
    right: 0;
    top: 50px;
    display: flex;
    /* align-items: center; */
    justify-content: space-around;

    background-color: #1d4655;
    border-radius: 0 0 0 3px;

    z-index: 4;
}

@media (max-width: 950px) {
    .search-type {
        margin-left: 150px;
        /* 进一步减小宽度 */
    }
}

.search-type a {
    font-size: 18px;
    color: #ccc;
    position: relative;
    /* 使下划线相对于链接定位 */
    padding-top: 12px;
    padding-bottom: 12px;
    /* 为下划线留出空间 */
}

.search-type a::after {
    content: '';
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    height: 2px;
    /* 下划线的厚度 */
    background-color: transparent;
    transition: all 0.2s;
    /* 过渡效果 */
}

.search-type a:hover::after {
    width: 20%;
    background-color: #98bac7;
}

.search-type a.router-link-active::after {
    width: 45%;
    background-color: #98bac7;
}
</style>