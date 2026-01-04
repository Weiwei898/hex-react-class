import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  //開發中產品路徑
  base: process.env.NODE_ENV === 'production' ? '/hex-react-class/' : '/',
  plugins: [react()],
})
