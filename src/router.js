import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () => import(/* webpackChunkName: "Discovery" */ '@/page/discovery')
const Playlists = () => import(/* webpackChunkName: "Playlists" */ '@/page/playlists')
const Songs = () => import(/* webpackChunkName: "Songs" */ '@/page/songs')
const Mvs = () => import(/* webpackChunkName: "Mvs" */ '@/page/mvs')
const PlaylistDetail = () => import('@/page/playlist-detail')
const Mv = () => import(/* webpackChunkName: "Mv" */ '@/page/mvdetail')

const Search = () => import(/* webpackChunkName: "Search" */ '@/page/search')
const SearchSongs = () => import(/* webpackChunkName: "Search" */ '@/page/search/songs')
const SearchPlaylists = () => import(/* webpackChunkName: "Search" */ '@/page/search/playlists')
const SearchMvs = () => import(/* webpackChunkName: "Search" */ '@/page/search/mvs')

// 内容需要居中的页面
export const layoutCenterNames = ['discovery', 'playlists', 'songs', 'mvs']

// 定义layout中菜单选项的数据
export const menuRoutes = [
  {
    path: '/discovery',
    name: 'discovery',
    component: Discovery,
    meta: {
      title: '发现音乐',
      icon: 'music'
    }
  },
  {
    path: '/playlists',
    name: 'playlists',
    component: Playlists,
    meta: {
      title: '推荐歌单',
      icon: 'playlist-menu'
    }
  },
  {
    path: '/songs',
    name: 'songs',
    component: Songs,
    meta: {
      title: '最新音乐',
      icon: 'yinyue'
    }
  },
  {
    path: '/mvs',
    name: 'mvs',
    component: Mvs,
    meta: {
      title: '最新MV',
      icon: 'mv'
    }
  }
]

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  // 将菜单选项数据同步到路由中
  routes: [
    {
      path: '/',
      redirect: '/discovery'
    },
    {
      path: '/playlist/:id',
      name: 'playlist',
      component: PlaylistDetail
    },
    {
      path: '/mv/:id',
      name: 'mv',
      component: Mv,
      props: (route) => ({ id: +route.params.id })
    },
    {
      path: '/search/:keywords',
      name: 'search',
      component: Search,
      props: true,
      children: [
        {
          path: '/',
          redirect: 'songs'
        },
        {
          path: 'songs',
          name: 'searchSongs',
          component: SearchSongs
        },
        {
          path: 'playlists',
          name: 'searchPlaylists',
          component: SearchPlaylists
        },
        {
          path: 'mvs',
          name: 'searchMvs',
          component: SearchMvs
        }
      ]
    },
    ...menuRoutes
  ]
})
