const userRoutes = [
    {path: '/users', name: 'Users', component: () => import("@users/views/index.vue")},
    {path: '/users/create', name: 'NewUsers', component: () => import("@/views/Users/create.vue")},
    {path: '/users/:id', name: 'UserView', component: () => import("@users/views/_id.vue")},
    {path: '/users/:id/edit', name: 'UsersEdit', component: () => import("@/views/Users/Edit.vue")},
    {
        path: '/users/:id/change-password',
        name: 'UsersChangePassword',
        component: () => import("@/views/Users/change-password.vue")
    },
    {path: '/users/:id/change-pin', name: 'UsersChangePin', component: () => import("@/views/Users/change-pin.vue")},
    {
        path: '/users/:id/assign-roles',
        name: 'UsersAssignRoles',
        component: () => import("@/views/Users/assign-roles.vue")
    },
]

export default userRoutes;
