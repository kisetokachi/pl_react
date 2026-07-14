import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 外部（コンテナ外）からのアクセスを許可
    port: 3000,      // docker-compose.yamlで指定したポートに合わせる
    watch: {
      usePolling: true, // コンテナ内でのファイルの変更検知（ホットリロード）を確実にする
    },
  },
})
