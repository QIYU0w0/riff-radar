<!-- ArtistInfo.vue -->
<template>
    <div class="artist-brief">
        <img class="artist-pic" :src="artist.picUrl" alt="歌手头像" v-if="artist.picUrl">
        <div class="artist-info">
            <p class="name">{{ artist.name }}</p>
            <div class="alias" v-if="artist.alias">别名：
                <span class="alia" v-for="(alia, index) in artist.alias" :key="index">{{ alia
                    }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <div class="count">
                <span class="music-cnt">歌曲数：{{ artist.musicSize }}</span>
                <span class="album-cnt">专辑数：{{ artist.albumSize }}</span>
                <span class="mv-cnt">MV数：{{ artist.mvSize }}</span>
            </div>
            <div class="follow-button" @click="toggleFollow(artist.id)" :style="getFollowButtonStyles(artist.id)">
                {{ getFollowButtonText(artist.id) }}
            </div>
        </div>
    </div>
    <SongsList :songs="songsList" />
</template>

<script setup lang="ts">
import SongsList from '@/components/SongsList.vue';
import { useRoute } from 'vue-router';
import { onMounted, computed, watch, reactive } from 'vue';
import { useArtistStore } from '@/stores/artist';
import { useMyartistStore } from '@/stores/myartist';
import { ElMessageBox, ElMessage } from 'element-plus';

// 路由实例
const route = useRoute();
// Pinia 歌手数据存储
const artistStore = useArtistStore();
const myartistStore = useMyartistStore();

// 当前歌手ID（确保是有效的数字）
const artistId = computed(() => {
    const id = route.query.artistid;
    return id && !isNaN(Number(id)) ? Number(id) : 0;
});

// 歌手数据
const artist = computed(() => artistStore.artist[artistId.value] || {});

// 热门歌曲数据
const songsList = computed(() => artistStore.songs[artistId.value] || []);

// 页面加载时获取歌手信息
const loadArtist = async (id: number | null) => {
    if (!id) {
        console.error(`未提供有效的歌手ID, ${id}`);
        return;
    }
    // id是数字就直接请求，缓存是否有效会在函数内部处理
    await artistStore.getArtist(id);
};

const toggleFollow = (id: number) => {
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
        myartistStore.artists[id] = {
            id: artist.value.id,
            name: artist.value.name,
            picUrl: artist.value.picUrl
        };

        // 显示关注成功的提示消息
        ElMessage({
            message: '关注成功',
            type: 'success',  // 成功类型
            duration: 1000,   // 2秒后自动关闭
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

// 初次加载
onMounted(() => loadArtist(artistId.value));

// 路由变化时重新加载
watch(artistId, (newId) => loadArtist(newId));
</script>

<style scoped>
.artist-brief {
    /* border: red solid 1px; */
    margin-left: 250px;
    margin-right: 80px;
    margin-top: 100px;
    padding: 0;
    display: flex;
    justify-content: flex-start;
    height: 180px;
    max-width: 1300px;
}

.artist-pic {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 30px;
}

.artist-info {
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

.alias {
    font-size: 20px;
    line-height: 20px;
}

.count {
    font-size: 20px;
    line-height: 20px;
    /* margin-bottom: 15px; */
}

.count>* {
    margin-right: 30px;
}
</style>