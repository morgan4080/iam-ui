const userRoutes = [
  {
    path: "/users",
    name: "Users",
    component: () => import("@users/views/userIndex.vue"),
  },
  {
    path: "/users/create",
    name: "NewUsers",
    component: () => import("@/views/Users/create.vue"),
  },
  {
    path: "/users/:refId/view",
    name: "UserView",
    props: true,
    component: () => import("@users/views/userView.vue"),
  },
  {
    path: "/users/:refId/edit",
    name: "UserEdit",
    props: true,
    component: () => import("@users/views/userEdit.vue"),
  },
  {
    path: "/users/:id/change-password",
    name: "UsersChangePassword",
    component: () => import("@/views/Users/change-password.vue"),
  },
  /*{
    path: "/users/:id/change-pin",
    name: "UsersChangePin",
    component: () => import("@/views/Users/change-pin.vue"),
  },*/
  {
    path: "/users/:id/assign-roles",
    name: "UsersAssignRoles",
    component: () => import("@/views/Users/assign-roles.vue"),
  },
];

export default userRoutes;
