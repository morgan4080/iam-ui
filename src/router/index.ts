import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/Dashboard/views/Dashboard.vue";
import userRoutes from "@/Users/router";
import rolesRoutes from "@/Roles/routes";

const routes = [
  { path: "/", name: "Home", component: Dashboard },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/Dashboard/views/Dashboard.vue"),
  },
  ...userRoutes,
  ...rolesRoutes,
];

const router = createRouter({
  history: createWebHistory("/admin/"),
  routes,
});

export default router;
