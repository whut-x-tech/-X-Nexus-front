import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/blog', component: () => import('../views/Blog.vue') },
  { path: '/forum', component: () => import('../views/Forum.vue') },
  { path: '/team', component: () => import('../views/Team.vue') },
  { path: '/tools', component: () => import('../views/Tools.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
