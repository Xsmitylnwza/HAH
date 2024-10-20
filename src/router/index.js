import { createRouter, createWebHistory } from 'vue-router'
import LoginModal from '../components/LoginModal.vue'
import MusicApp from '../components/MusicApp.vue'
import PlaylistFormModal from '../components/PlaylistFormModal.vue'
import createMySong from '../components/CreateMySong.vue'
import MySong from '../components/MySong.vue'
import EditMySong from '@/components/EditMySong.vue'
import PlayList from '@/components/PlayList.vue'
import SearchPage from '@/components/SearchPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/music'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginModal
    },
    {
      path: '/music',
      name: 'music',
      component: MusicApp,
      children: [
        {
          path: ':playlistid',
          name: 'playlist',
          component: PlayList
        },
        {
          path: 'create',
          name: 'create',
          component: PlaylistFormModal
        },
        {
          path: 'edit/:id',
          name: 'edit',
          component: PlaylistFormModal
        }
      ]
    },
    {
      path: '/mysong',
      name: 'mysong',
      component: MySong,
      children: [
        {
          path: '/mysong/add',
          name: 'AddSong',
          component: createMySong
        },
        {
          path: '/mysong/edit',
          name: 'EditSong',
          component: EditMySong
        }
      ]
    },
    {
      path: '/serch',
      name: 'search',
      component: SearchPage
    }
  ]
})

export default router
