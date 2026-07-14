import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // 起動ポートを3000に固定
    proxy: {
      // フロントエンドからの「/api」で始まる通信を、裏でSpring Boot（8080）に転送する
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})