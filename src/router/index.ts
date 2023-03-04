import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import userRoutes from "@/Users/router";
import rolesRoutes from "@/Roles/routes";

const routes = [
  { path: "/", name: "Home", component: Dashboard },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/views/Dashboard.vue"),
  },
  {
    path: "/password/reset",
    name: "Password-Reset",
    component: () => import("@/views/RecoverPassword.vue"),
  },
].concat(userRoutes, rolesRoutes);

const router = createRouter({
  history: createWebHistory("/admin/"),
  routes,
});

export default router;
