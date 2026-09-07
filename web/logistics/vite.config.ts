import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import path from 'path';
import { type PluginOption, defineConfig } from 'vite';

// These options were migrated by @nx/vite:convert-to-inferred from the project.json file.
//const configValues = { default: {}, development: {}, production: {} };

// Determine the correct configValue to use based on the configuration
//const nxConfiguration = process.env.NX_TASK_TARGET_CONFIGURATION ?? 'default';

/* const options = {
  ...configValues.default,
  ...(configValues[nxConfiguration] ?? {}),
}; */

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: path.resolve(__dirname, './src/routes'),
      generatedRouteTree: path.resolve(__dirname, './src/routeTree.gen.ts'),
    }),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ] as PluginOption[],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['logistics.apexafrica.com'],
    hmr: {
      protocol: 'wss',
      host: 'logistics.apexafrica.com',
      clientPort: 443,
    },
  },
});
