const userRoutes = [
  {
    path: "/users",
    name: "Users",
    component: () => import("@users/views/index.vue"),
  },
  {
    path: "/users/create",
    name: "NewUsers",
    component: () => import("@/Users/views/create.vue"),
  },
  {
    path: "/users/:refId/view",
    name: "UserView",
    props: true,
    component: () => import("@users/views/view.vue"),
  },
  {
    path: "/users/:refId/edit",
    name: "UserEdit",
    props: true,
    component: () => import("@users/views/edit.vue"),
  },
];

export default userRoutes;
