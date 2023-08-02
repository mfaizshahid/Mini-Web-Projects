// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                crud_app: resolve(__dirname, 'src/projects/crud_app/index.html'),
                profile_form: resolve(__dirname, 'src/projects/profile_form/index.html'),
            },
        },
    },
})