import { app, BrowserWindow, ipcMain } from 'electron'
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
  const iconPath = process.env.VITE_PUBLIC 
    ? path.join(process.env.VITE_PUBLIC, 'logotipo2.png')
    : path.join(__dirname, '../public/logotipo2.png');

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // Necessário para carregar o preload corretamente em alguns ambientes de dev
    },
    title: 'SGD-LHF - Gerenciamento de Documentos',
  })

  // Handler IPC para teste
  ipcMain.handle('ping', () => 'pong')

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // Carregando em produção (após o build do Vite)
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
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
