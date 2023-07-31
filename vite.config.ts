import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@ui", replacement: "/src/components/ui" },
      { find: "@users", replacement: "/src/Users" },
      { find: "@roles", replacement: "/src/Roles" },
    ],
  },
  envDir: path.resolve(__dirname, "./"),
  server: {
    /*proxy: {
          '/users-admin/api/users': {
            target: 'https://accounts.presta.co.ke',
            changeOrigin: true,
            secure: true
          },
          // authentication for supplied token
          '/authentication': {
            target: 'https://accounts.presta.co.ke',
            changeOrigin: true,
            secure: true
          },
          // to get single user by id
          '^/users-admin/api/users/.*': {
            target: 'https://accounts.presta.co.ke',
            changeOrigin: true,
            secure: true
          },
          '/users-admin/api/register': {
            target: 'https://accounts.presta.co.ke',
            changeOrigin: true,
            secure: true
          },
          '/users-admin/api/permissions': {
            target: 'https://accounts.presta.co.ke',
            changeOrigin: true,
            secure: true
          },
          '/auth/realms/t74209/protocol/openid-connect/token': {
            target: 'https://iam.presta.co.ke',
            changeOrigin: true,
            secure: true
          },
          '/users-admin/api/roles': {
            target: 'https://accounts.presta.co.ke',
            changeOrigin: true,
            secure: true
          },
          '^/users-admin/api/roles/.*': {
            target: 'https://accounts.presta.co.ke',
            changeOrigin: true,
            secure: true
          }
        }*/
  },
});
