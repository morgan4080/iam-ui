import { createRouter, createWebHistory } from 'vue-router'
import Landing from "@/views/Landing.vue";

const routes = [
    {path:'/', name: 'Landing', component: Landing},
    {path:'/dashboard', name: 'Dashboard', component: () => import("@/views/Dashboard.vue") },
    {path:'/users', name: 'Users', component: () => import("@/views/Users.vue")},
    {path:'/new-users', name: 'NewUsers', component: () => import("@/views/NewUser.vue")},
    {path:'/roles', name: 'Roles', component: () => import("@/views/Roles.vue")},
    {path:'/password/reset', name: 'Password-Reset', component: () => import("@/views/RecoverPassword.vue")},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
