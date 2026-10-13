import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'generate-404-fallback',
      closeBundle() {
        try {
          const dir = import.meta.dirname || process.cwd();
          const indexPath = path.resolve(dir, 'dist/index.html');
          const notFoundPath = path.resolve(dir, 'dist/404.html');
          if (fs.existsSync(indexPath)) {
            fs.copyFileSync(indexPath, notFoundPath);
            console.log('✓ Generated dist/404.html for static hosting fallback');
          }
        } catch (e) {
          console.error('Failed to generate 404.html:', e);
        }
      }
    }
  ],
})

