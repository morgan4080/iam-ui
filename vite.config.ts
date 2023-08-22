import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "path";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue(), vuetify()],
  resolve: {
    alias: [
      { find: "@", replacement: "/src" },
      { find: "@ui", replacement: "/src/components/ui" },
      { find: "@users", replacement: "/src/Users" },
      { find: "@roles", replacement: "/src/Roles" },
    ],
  },
  envDir: path.resolve(__dirname, "./"),
  server: {},
});
