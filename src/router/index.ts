import { createRouter, createWebHistory, RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/recommend',
    component: () => import('../views/Recommend.vue')
  },
  {
    path: '/playlist',
    component: () => import('../views/Playlist.vue')
  },
  {
    path: '/ranking',
    component: () => import('../views/Ranking.vue')
  },
  {
    path: '/artist',
    component: () => import('../views/Artist.vue')
  },
  {
    path: '/local',
    component: () => import('../views/Local.vue')
  },
  {
    path: '/download',
    component: () => import('../views/Download.vue')
  },
  {
    path: '/recent',
    component: () => import('../views/Recent.vue')
  },
  {
    path: '/cloud',
    component: () => import('../views/Cloud.vue')
  },
  {
    path: '/favorite',
    component: () => import('../views/Favorite.vue')
  },
  {
    path: '/search',
    component: () => import('../views/Search.vue')
  },
  {
    path: '/playlist/:id',
    component: () => import('../views/PlaylistDetail.vue')
  },
  {
    path: '/login',
    component: () => import('../views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const userStore = useUserStore()
  
  if (!userStore.isLoggedIn && to.meta.requiresAuth) {
    next('/login')
  } else {
    next()
  }
})

export default router 