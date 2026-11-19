import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Required for GitHub Pages (https://jhunter4.github.io/not-so-secret-santa/)
  base: '/not-so-secret-santa/',
});
