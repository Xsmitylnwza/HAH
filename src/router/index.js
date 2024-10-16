import { createRouter, createWebHistory } from 'vue-router';
import LoginModal from '../components/LoginModal.vue';
import MusicApp from '../components/MusicApp.vue';
import PlaylistFormModal from '../components/PlaylistFormModal.vue';
import createMySong from '../components/createMySong.vue';

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
          path: 'create',
          name: 'create',
          component: PlaylistFormModal
        },
        {
          path: 'AddSong', 
          name: 'AddSong',
          component: createMySong,
        },
        {
          path: 'edit/:id',
          name: 'edit',
          component: PlaylistFormModal
        }
      ]
    }
  ]
});

export default router;
