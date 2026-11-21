import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const hasLocalEnvFile =
    fs.existsSync(path.resolve(process.cwd(), '.env')) ||
    fs.existsSync(path.resolve(process.cwd(), '.env.production')) ||
    fs.existsSync(path.resolve(process.cwd(), '.env.local'));

  const mapsKey =
    command === 'serve'
      ? env.VITE_GOOGLE_MAPS_API_KEY ||
        process.env.VITE_GOOGLE_MAPS_API_KEY ||
        env.GOOGLE_MAPS_API_KEY ||
        process.env.GOOGLE_MAPS_API_KEY ||
        ''
      : hasLocalEnvFile || process.env.GITHUB_ACTIONS === 'true'
        ? env.VITE_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || ''
        : '';

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(mapsKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      ...(process.env.DISABLE_HMR === 'true' ? { ws: false as const } : {}),
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
