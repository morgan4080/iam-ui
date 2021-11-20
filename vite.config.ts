import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  envDir: path.resolve(__dirname, './'),
  server: {
    proxy: {
      '/authentication': {
        target: 'https://accounts.presta.co.ke',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '^/users-admin/api/users/.*': {
        target: 'https://accounts.presta.co.ke',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '^/users-admin/api/.*': {
        target: 'https://accounts.presta.co.ke',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/auth/realms/t74209/protocol/openid-connect/token': {
        target: 'https://iam.presta.co.ke',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '^/users-admin/api/roles/.*': {
        target: 'https://accounts.presta.co.ke',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    }
  }
})
