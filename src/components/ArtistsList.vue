<!-- ArtistsList.vue -->
<template>
    <ul class="artists-list">
        <li v-for="(artist, index) in artists" :key="index + 1">
            <div class="artist-info">
                <img :src="artist.picUrl" alt="无头像">
                <router-link :to="{ path: '/artist', query: { artistid: artist.id } }" class="artist-name">
                    {{ artist.name }}
                </router-link>
            </div>
            <div class="follow-button" @click="toggleFollow(artist.id, index)"
                :style="getFollowButtonStyles(artist.id)">
                {{ getFollowButtonText(artist.id) }}
            </div>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { reactive } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import type { PropType } from 'vue';

import { useMyartistStore } from '@/stores/myartist';
const myartistStore = useMyartistStore();

const props = defineProps({
    artists: {
        type: Array as PropType<{ id: number, name: string, picUrl: string }[]>,
        required: true
    }
});

const toggleFollow = (id: number, index: number) => {
    //已关注，取消关注
    if (myartistStore.isFollow(id)) {
        //弹窗询问是否取消
        ElMessageBox.confirm(
            '确定取消关注？', // 弹窗提示
            '取消关注', // 弹窗标题
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning', // 设置弹窗类型为警告
            }
        ).then(() => {
            // 用户确认取消关注，删除歌手
            delete myartistStore.artists[id]; // 使用 delete 删除对象中的属性
        }).catch(() => {
            // 用户点击了取消，不做任何操作
            console.log('取消这次操作');
        });
    } else {    //关注
        myartistStore.artists[id] = props.artists[index];

        // 显示关注成功的提示消息
        ElMessage({
            message: '关注成功',
            type: 'success',  // 成功类型
            duration: 1000,   // 1秒后自动关闭
        });
    }
}

const getFollowButtonText = (id: number) => {
    return myartistStore.isFollow(id)
        ? '√\u00A0已关注'
        : '+\u00A0\u00A0关\u00A0\u00A0注\u00A0';
}
const followStyleObject = reactive({
    color: '#ccc',
    border: '1px solid #ccc',
    padding: '4px 8px',
    borderRadius: '10px',
    justifyContent: 'flex-end',
    fontWeight: 'bolder',
    width: '80px'
})

const unfollowStyleObject = reactive({
    color: '#98bac7',
    border: '1px solid #98bac7',
    padding: '4px 8px',
    borderRadius: '10px',
    justifyContent: 'flex-end',
    width: '80px'
})

const getFollowButtonStyles = (id: number) => {
    return myartistStore.isFollow(id)
        ? followStyleObject
        : unfollowStyleObject;
};

</script>

<style scoped>
.artists-list {
    /* border: red solid 1px; */
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 150px;
    padding: 0;
}

li {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    align-items: center;
}

li>* {
    display: flex;
    padding: 0;
    margin: 0;
    border: none;
}

.artist-info {
    justify-content: flex-start;
    align-items: center;

    /* border: red solid 1px; */
}

.artist-info img {
    border-radius: 50%;
    width: 72px;
    height: 72px;
    object-fit: cover;
    /* 确保图片在裁剪为圆形时内容不会变形 */
}

.artist-info a {
    text-align: center;
    margin-left: 5vw;
    margin-right: 5vw;
}
</style>