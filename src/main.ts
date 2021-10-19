import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Dashboard from '@/views/Dashboard.vue'
import Users from '@/views/Users.vue'
import Roles from '@/views/Roles.vue'
import Landing from '@/views/Landing.vue'
import './index.css'

const router = createRouter({
    routes: [
        {path:'/', name: 'Landing', component: Landing},
        {path:'/dashboard', name: 'Dashboard', component: Dashboard},
        {path:'/users', name: 'Users', component: Users},
        {path:'/roles', name: 'Roles', component: Roles},
    ],
    history: createWebHistory()
})

createApp(App)
    .use(router)
    .mount('#app')
