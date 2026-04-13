import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Essencial para o Electron encontrar arquivos em build (protocolo file://)
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    electron([
      {
        // Ponto de entrada do processo Main
        entry: 'electron/main.ts',
      },
      {
        entry: 'electron/preload.ts',
        onstart(options) {
          // Notifica o renderer que o preload terminou de compilar
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  server: {
    host: true, // Habilita o acesso pelo IP da rede
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
