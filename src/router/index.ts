import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from "@/views/Dashboard.vue"

const routes = [
    {path:'/', name: 'Home', component: Dashboard},
    {path:'/dashboard', name: 'Dashboard', component: () => import("@/views/Dashboard.vue")},
    {path:'/users', name: 'Users', component: () => import("@/views/Users/index.vue")},
    {path:'/users/create', name: 'NewUsers', component: () => import("@/views/Users/create.vue")},
    {path:'/users/:id', name: 'UserView', component: () => import("@/views/Users/_id.vue")},
    {path:'/users/:id/edit', name: 'UsersEdit', component: () => import("@/views/Users/Edit.vue")},
    {path:'/users/:id/change-password', name: 'UsersChangePassword', component: () => import("@/views/Users/change-password.vue")},
    {path:'/users/:id/change-pin', name: 'UsersChangePin', component: () => import("@/views/Users/change-pin.vue")},
    {path:'/users/:id/assign-roles', name: 'UsersAssignRoles', component: () => import("@/views/Users/assign-roles.vue")},
    {path:'/profiles/:id', name: 'ProfileView', component: () => import("@/views/Users/_id.vue")},
    {path:'/profiles/:id/edit', name: 'ProfilesEdit', component: () => import("@/views/Users/Edit.vue")},
    {path:'/roles', name: 'Roles', component: () => import("@/views/Roles/index.vue")},
    {path:'/roles/create', name: 'RolesCreate', component: () => import("@/views/Roles/create.vue")},
    {path:'/roles/:id', name: 'RolesView', component: () => import("@/views/Roles/_id.vue")},
    {path:'/roles/:id/edit', name: 'RolesEdit', component: () => import("@/views/Roles/edit.vue")},
    {path:'/password/reset', name: 'Password-Reset', component: () => import("@/views/RecoverPassword.vue")},
    {path: '/test/:id', component: () => import("@/views/Users/test.vue")}
]

const router = createRouter({
    history: createWebHistory('/admin/'),
    routes
})

export default router
