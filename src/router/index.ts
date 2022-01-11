import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from "@/views/Dashboard.vue"

const routes = [
    {path:'admin/', name: 'Home', component: Dashboard},
    {path:'admin/dashboard', name: 'Dashboard', component: () => import("@/views/Dashboard.vue")},
    {path:'admin/users', name: 'Users', component: () => import("@/views/Users.vue")},
    {path:'admin/users/:id', name: 'UserView', component: () => import("@/views/Profiles/_id.vue")},
    {path:'admin/users/:id/edit', name: 'UsersEdit', component: () => import("@/views/Profiles/Edit.vue")},
    {path:'admin/profiles/:id', name: 'ProfileView', component: () => import("@/views/Profiles/_id.vue")},
    {path:'admin/profiles/:id/edit', name: 'ProfilesEdit', component: () => import("@/views/Profiles/Edit.vue")},
    {path:'admin/new-users', name: 'NewUsers', component: () => import("@/views/NewUser.vue")},
    {path:'admin/roles', name: 'Roles', component: () => import("@/views/Roles.vue")},
    {path:'admin/password/reset', name: 'Password-Reset', component: () => import("@/views/RecoverPassword.vue")},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
