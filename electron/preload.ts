import { contextBridge, ipcRenderer } from 'electron'

console.log('Preload script carregado!')

// Expondo APIs seguras para o processo renderer (React)
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemplo de comunicação IPC
  ping: () => ipcRenderer.invoke('ping'),
})
