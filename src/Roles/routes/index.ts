const rolesRoutes = [
    {path:'/roles', name: 'Roles', component: () => import("@roles/views/index.vue")},
    {path:'/roles/create', name: 'RolesCreate', component: () => import("@/views/Roles/create.vue")},
    {path:'/roles/:id', name: 'RolesView', component: () => import("@/views/Roles/_id.vue")},
    {path:'/roles/:id/edit', name: 'RolesEdit', component: () => import("@/views/Roles/edit.vue")},
]

export default rolesRoutes;
