import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import RepoPage from '../components/RepoPage.vue'
import ToolPage from '../components/ToolPage.vue'
import FunPage from '../components/FunPage.vue'


const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/repos', name: 'Repo', component: RepoPage },
    { path: '/tool', name: 'Tool', component: ToolPage },
    { path: '/fun', name: 'fun', component: FunPage }


]

const router = createRouter({
    history: createWebHistory(),
    routes
})

 export default router
