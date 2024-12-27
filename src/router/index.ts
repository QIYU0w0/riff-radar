import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/views/Index.vue';
import MyHome from '@/views/MyHome.vue';
import MySongs from '@/views/MySongs.vue';
import MyArtists from '@/views/MyArtists.vue';
import Search from '@/views/Search.vue'
import ArtistInfo from '@/views/ArtistInfo.vue';
import SearchSong from '@/views/SearchSong.vue';
import SearchArtist from '@/views/SearchArtist.vue';
import SearchPlaylist from '@/views/SearchPlaylist.vue';
import PlaylistInfo from '@/views/PlaylistInfo.vue';
import AlbumInfo from '@/views/AlbumInfo.vue';

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    redirect: '/myhome', // 设置默认跳转到/myhome
    children:[
      {
        path: 'myhome',
        component: MyHome
      },
      {
        path: 'mysongs',
        component: MySongs
      },
      {
        path: 'myartists',
        component: MyArtists
      },
      {
        path: 'search',
        component: Search,
        redirect:'search/songs',
        children:[
          {
            path:'songs',
            component: SearchSong
          },
          {
            path:'artists',
            component:SearchArtist
          },
          {
            path:'playlists',
            component:SearchPlaylist
          }
        ]
      },
      {
        path:'artist',
        component:ArtistInfo
      },
      {
        path:'playlist',
        component:PlaylistInfo
      },
      {
        path:'album',
        component: AlbumInfo
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;