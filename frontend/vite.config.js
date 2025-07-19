import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd())

  const socketUrl = env.VITE_SOCKET_URL

  return {
    server: {
      proxy: {
        '/users': socketUrl,
        '/videos': socketUrl,
        '/likes': socketUrl,
        '/comments': socketUrl,
        '/subscriptions': socketUrl,
        '/playlists': socketUrl,
      }
    },
    build: {
      outDir: 'dist' 
    },
    plugins: [react(), tailwindcss()],
  }
})
