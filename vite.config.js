/* eslint-env node */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ruta base del sitio. En GitHub Pages el workflow la define como
  // /<nombre-del-repositorio>/; en desarrollo se usa la raíz.
  base: process.env.BASE_PATH || "/",
})
