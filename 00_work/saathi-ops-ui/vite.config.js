import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  // Load environment variables
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [react()],
    build: {
      sourcemap: true,
    },
    optimizeDeps: {
      include: ['uuid', 'react', 'react-dom', '@tanstack/react-query'],
    },
  };
});
