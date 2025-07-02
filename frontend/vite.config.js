import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
  proxy:{
      '/users': 'http://localhost:5000',
      '/videos': 'http://localhost:5000',
      '/likes': 'http://localhost:5000',
      '/comments': 'http://localhost:5000',
      '/subscriptions': 'http://localhost:5000',
      '/playlists': 'http://localhost:5000',
  }
  },
  plugins: [react(),tailwindcss()],
})
