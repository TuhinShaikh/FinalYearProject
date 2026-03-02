import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const rawApiUrl = (env.VITE_API_URL ?? '').trim();
  const apiTarget = rawApiUrl || 'http://localhost:8080';

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: 'localhost',
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});