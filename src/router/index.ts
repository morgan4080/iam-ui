import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from "@/views/Dashboard.vue"

const routes = [
    {path:'/', name: 'Home', component: Dashboard},
    {path:'/dashboard', name: 'Dashboard', component: () => import("@/views/Dashboard.vue")},
    {path:'/users', name: 'Users', component: () => import("@/views/Users.vue")},
    {path:'/users/:id', name: 'UserView', component: () => import("@/views/Profiles/_id.vue")},
    {path:'/users/:id/edit', name: 'UsersEdit', component: () => import("@/views/Profiles/Edit.vue")},
    {path:'/profiles/:id', name: 'ProfileView', component: () => import("@/views/Profiles/_id.vue")},
    {path:'/profiles/:id/edit', name: 'ProfilesEdit', component: () => import("@/views/Profiles/Edit.vue")},
    {path:'/new-users', name: 'NewUsers', component: () => import("@/views/NewUser.vue")},
    {path:'/roles', name: 'Roles', component: () => import("@/views/Roles.vue")},
    {path:'/password/reset', name: 'Password-Reset', component: () => import("@/views/RecoverPassword.vue")},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
