import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ConsoleTagVitePlugin } from '@sprit/console-tag';

export default defineConfig({
  plugins: [
    react(),
    ConsoleTagVitePlugin({
      git: { branch: true, hash: 7, version: true, lastCommitDateTime: true },
      custom: () => ({ '构建时间': new Date().toISOString() }),
    }),
  ],
});
