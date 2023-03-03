import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from "@/views/Dashboard.vue"
import userRoutes from "@/Users/router";

const routes = [
    {path:'/', name: 'Home', component: Dashboard},
    {path:'/dashboard', name: 'Dashboard', component: () => import("@/views/Dashboard.vue")},
    {path:'/profiles/:id', name: 'ProfileView', component: () => import("@/views/Users/_id.vue")},
    {path:'/profiles/:id/edit', name: 'ProfilesEdit', component: () => import("@/views/Users/Edit.vue")},
    {path:'/roles', name: 'Roles', component: () => import("@/views/Roles/index.vue")},
    {path:'/roles/create', name: 'RolesCreate', component: () => import("@/views/Roles/create.vue")},
    {path:'/roles/:id', name: 'RolesView', component: () => import("@/views/Roles/_id.vue")},
    {path:'/roles/:id/edit', name: 'RolesEdit', component: () => import("@/views/Roles/edit.vue")},
    {path:'/password/reset', name: 'Password-Reset', component: () => import("@/views/RecoverPassword.vue")},
].concat(userRoutes)

const router = createRouter({
    history: createWebHistory('/admin/'),
    routes
})

export default router
