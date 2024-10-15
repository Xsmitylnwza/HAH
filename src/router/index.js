import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import CreateMySongPage from '../components/CreateMySongPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/createmysong',
    name: 'CreateMySong',
    component: CreateMySongPage, // component ที่จะแสดงผลในหน้านี้
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
