import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-plugin-tsconfig-paths';

const resolve = {
	alias: {
		'@': fileURLToPath(new URL('./src', import.meta.url)),
		'@modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
	},
};

export default defineConfig({
	css: {
		devSourcemap: true,
	},
	plugins: [react(), eslint(), tsconfigPaths()],
	resolve,
});
