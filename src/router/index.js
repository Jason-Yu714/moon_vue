import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import RepoPage from '../components/RepoPage.vue'
import ToolPage from '../components/ToolPage.vue'

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/repo', name: 'Repo', component: RepoPage },
    { path: '/tools', name: 'Tools', component: ToolPage },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
