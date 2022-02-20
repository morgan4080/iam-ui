import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from "@/views/Dashboard.vue"

const routes = [
    {path:'/admin/', name: 'Home', component: Dashboard},
    {path:'/admin/dashboard', name: 'Dashboard', component: () => import("@/views/Dashboard.vue")},
    {path:'/admin/users', name: 'Users', component: () => import("@/views/Users/index.vue")},
    {path:'/admin/users/create', name: 'NewUsers', component: () => import("@/views/Users/create.vue")},
    {path:'/admin/users/:id', name: 'UserView', component: () => import("@/views/Profiles/_id.vue")},
    {path:'/admin/users/:id/edit', name: 'UsersEdit', component: () => import("@/views/Profiles/Edit.vue")},
    {path:'/admin/users/:id/change-password', name: 'UsersChangePassword', component: () => import("@/views/Users/change-password.vue")},
    {path:'/admin/users/:id/change-pin', name: 'UsersChangePin', component: () => import("@/views/Users/change-pin.vue")},
    {path:'/admin/users/:id/assign-roles', name: 'UsersAssignRoles', component: () => import("@/views/Users/assign-roles.vue")},
    {path:'/admin/profiles/:id', name: 'ProfileView', component: () => import("@/views/Profiles/_id.vue")},
    {path:'/admin/profiles/:id/edit', name: 'ProfilesEdit', component: () => import("@/views/Profiles/Edit.vue")},
    {path:'/admin/roles', name: 'Roles', component: () => import("@/views/Roles/index.vue")},
    {path:'/admin/roles/create', name: 'RolesCreate', component: () => import("@/views/Roles/create.vue")},
    {path:'/admin/roles/:id', name: 'RolesView', component: () => import("@/views/Roles/_id.vue")},
    {path:'/admin/roles/:id/edit', name: 'RolesEdit', component: () => import("@/views/Roles/edit.vue")},
    {path:'/admin/password/reset', name: 'Password-Reset', component: () => import("@/views/RecoverPassword.vue")},
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
