<template>
    <ul class="songs-list">
        <li class="title" v-if="songs.length">
            <p class="id-num">#</p>
            <p class="album-pic">封面</p>
            <p class="song-name">歌曲</p>
            <p class="artist-name">歌手</p>
            <p class="album-name">专辑</p>
            <p class="playit">播放</p>
            <p class="like">收藏</p>
        </li>
        <li class="content" v-for="(song, index) in songs" :key="index + 1">
            <p class="id-num">{{ index + 1 }}</p>
            <div class="album-pic"><img :src="song.album.picUrl" alt="无封面"></div>
            <p class="song-name">{{ song.name }}</p>
            <p class="artist-name">
                {{ song.artists.map(artist => artist.name).join(', ') }}
            </p>
            <p class="album-name">{{ song.album.name }}</p>
            <!-- <div class="playit" @click=""></div> -->
            <div class="playit" @click="playSong(song.url, index)">
                <img :src="getPlayPauseIcon(song.url)" alt="">
            </div>
            <div class="like" @click="toggleLike(song.id, index)"><img :src="getLikeDislikeIcon(song.id)" alt=""></div>
        </li>
    </ul>

</template>

<script setup lang="ts">
import { defineProps, onMounted } from 'vue';
import type { Song } from '@/types/song';
import type { PropType } from 'vue';
import { useMysongStore } from '@/stores/mysong';
import { usePlayinglistStore } from '@/stores/playinglist';
import { ElMessageBox, ElMessage } from 'element-plus';

const mysongStore = useMysongStore();
const playinglistStore = usePlayinglistStore();

const props = defineProps({
    songs: {
        type: Array as PropType<Song[]>,
        required: true
    }
});

onMounted(async () => {
    if (playinglistStore.songsAtList.length === 0) {
        console.log("刷新界面");
        playinglistStore.pauseAudio();
    } else {
        console.log("不是刷新，不改变播放状态");
    }
});


const getLikeDislikeIcon = (id: number) => {
    return mysongStore.isAtList(id)
        ? "/src/components/icons/heartfill.svg"
        : "/src/components/icons/heart.svg";
}

const toggleLike = (id: number, index: number) => {
    //已收藏，取消收藏
    if (mysongStore.isAtList(id)) {
        //弹窗询问是否取消
        ElMessageBox.confirm(
            '确定取消收藏？', // 弹窗提示
            '取消收藏', // 弹窗标题
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning', // 设置弹窗类型为警告
            }
        ).then(() => {
            // 用户确认取消关注，删除歌手
            delete mysongStore.songs[id]; // 使用 delete 删除对象中的属性
        }).catch(() => {
            // 用户点击了取消，不做任何操作
            console.log('取消这次操作');
        });
    } else {    //关注
        mysongStore.songs[id] = props.songs[index];

        // 显示收藏成功的提示消息
        ElMessage({
            message: '收藏成功',
            type: 'success',  // 成功类型
            duration: 1000,   // 1秒后自动关闭
        });
    }
}


const getPlayPauseIcon = (url: string) => {
    // if (playinglistStore.playingUrl === url && (!playinglistStore.audio.paused)) {
    if (playinglistStore.playingUrl === url && (playinglistStore.isPlaying)) {
        // 这里的地址必须是相对根目录的
        return "/src/components/icons/暂停.svg";
    }
    return "/src/components/icons/播放.svg";
};

const playSong = (url: string, index: number) => {
    // 本首歌的状态切换
    if (playinglistStore.audio.src === url) {
        if (playinglistStore.isPlaying) {
            // 如果当前正在播放，点击则暂停
            console.log("正在播放这首歌，暂停")
            playinglistStore.pauseAudio();
            console.log("paused??:", playinglistStore.audio.paused)
        } else {
            // 暂停了，继续播放
            console.log("正在暂停这首歌，播放")
            playinglistStore.playAudio(url);
            console.log("paused??:", playinglistStore.audio.paused)
        }
    } else {
        // 如果当前未播放或者放的别的歌
        console.log("未播放或者放别的歌");
        playinglistStore.clearAll();
        playinglistStore.songsAtList.push(...props.songs);
        playinglistStore.playingIndex = index;
        playinglistStore.playAudio(url); // 播放音乐

    }
};

</script>

<style scoped>
.songs-list {
    /* border: red solid 1px; */
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 150px;
    padding: 0;
}

li {
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

li>.id-num {
    flex: 1;
}

li>.album-pic {
    flex: 2;
}

.album-pic img {
    border-radius: 8px;
    width: 50%;
}

li>.song-name {
    flex: 6;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
}

li>.artist-name {
    flex: 3;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
}

li>.album-name {
    flex: 6;
    white-space: nowrap;
    /* 禁止换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
}

li>.playit {
    flex: 2;

}

.playit img {
    border-radius: 8px;
    width: 30%;
    transition: 0.4s;
}

.playit img:hover {
    transform: translateY(-30%);
}

li>.like {
    flex: 1;
}

.like img {
    position: relative;
    width: 55%;
    transition: 0.4s;
}

.like img:hover {
    transform: translateY(-30%);
}
</style>