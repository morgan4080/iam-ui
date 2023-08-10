const rolesRoutes = [
  {
    path: "/roles",
    name: "Roles",
    component: () => import("@roles/views/index.vue"),
  },
  {
    path: "/roles/create",
    name: "RolesCreate",
    component: () => import("@roles/views/create.vue"),
  },
  {
    path: "/roles/:id/view",
    name: "RolesView",
    component: () => import("@/Roles/views/view.vue"),
  },
  {
    path: "/roles/:id/edit",
    name: "RolesEdit",
    component: () => import("@roles/views/edit.vue"),
  },
];

export default rolesRoutes;
