import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  const cwd = process.cwd();
  const env = loadEnv(mode, cwd, '');
  const rawApiUrl = (env.VITE_API_URL ?? '').trim();
  const apiTarget = rawApiUrl || 'http://localhost:8080';
  const certPath = path.resolve(cwd, 'cert', 'cert.pem');
  const keyPath = path.resolve(cwd, 'cert', 'key.pem');
  const httpsConfig = fs.existsSync(certPath) && fs.existsSync(keyPath)
    ? {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
      }
    : undefined;

  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.js',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{js,jsx,ts,tsx}'],
      },
    },
    server: {
      port: 5173,
      host: 'localhost',
      https: httpsConfig,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/payments': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/bookings': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/users': {
          target: apiTarget,
          changeOrigin: true,
        },
        '/spots': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  };
});