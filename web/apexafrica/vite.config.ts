import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import path from 'path';
import { type PluginOption, defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: path.resolve(import.meta.dirname, './src/routes'),
      generatedRouteTree: path.resolve(import.meta.dirname, './src/routeTree.gen.ts'),
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ] as PluginOption[],

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5176,
    allowedHosts: ['apexafrica.com'],
    hmr: {
      protocol: 'wss',
      host: 'apexafrica.com',
      clientPort: 443,
    },
  },
});
