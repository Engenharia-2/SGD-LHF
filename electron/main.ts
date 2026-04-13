import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Carregando o URL do servidor de desenvolvimento se estivermos em modo DEV
// Caso contrário, carrega o arquivo index.html da pasta dist
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

console.log('Main Process iniciado')
console.log('__dirname:', __dirname)
console.log('VITE_DEV_SERVER_URL:', VITE_DEV_SERVER_URL)
console.log('Caminho do Preload:', path.join(__dirname, 'preload.js'))

function createWindow() {
  // Em produção, o diretório base muda. __dirname aponta para dist-electron.
  // O ícone deve estar em dist/logotipo2.png (Vite move o conteúdo de public para dist no build)
  const iconPath = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.VITE_PUBLIC!, 'logoLHF3.png')
    : path.join(__dirname, '../dist/logoLHF3.png');

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    title: 'SGD-LHF - Gerenciamento de Documentos',
  })

  // Habilitar DevTools mesmo em produção para depuração (Remover antes da entrega final)
  win.webContents.openDevTools();

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    // Caminho relativo ao dist-electron/main.js para encontrar o dist/index.html
    const indexHtml = path.join(__dirname, '../dist/index.html');
    win.loadFile(indexHtml);
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
