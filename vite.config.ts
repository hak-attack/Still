import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages project site: https://<user>.github.io/Still/
export default defineConfig({
  base: '/Still/',
  plugins: [tailwindcss(), react()],
})
