<template>
    <div class="side-bar">
        <h1>RiffRadar</h1>
        <ul>
            <li><router-link to="/myhome">&nbsp; 主页广场</router-link></li>
            <li><router-link to="/mysongs">&nbsp; 红心单曲</router-link></li>
            <li><router-link to="/myartists">&nbsp; 关注歌手</router-link></li>
        </ul>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.side-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100vh;
    background-color: #0a171c;
    color: white;
    padding-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
    transition: width 0.2s;
    border-radius: 0 10px 10px 0;
    /* 平滑过渡效果 */
}

@media (max-width: 950px) {
    .side-bar {
        width: 150px;
        /* 进一步减小宽度 */
    }
}

.side-bar h1 {
    font-size: 24px;
    margin-bottom: 50px;
}

.side-bar ul {
    padding: 0;
}

.side-bar li {
    border-radius: 3px;
    margin-bottom: 20px;

}

.side-bar li:hover {
    /* background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%); */
    background-color: #132f39;
}

.side-bar li>a {
    display: block;
}

.side-bar li>a.router-link-active {
    background-color: #1d4655;
}
</style>