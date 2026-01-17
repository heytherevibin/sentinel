const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSensorStatus: () => ipcRenderer.invoke('get-sensor-status'),
  getSensorId: () => ipcRenderer.invoke('get-sensor-id'),
  getHqServerUrl: () => ipcRenderer.invoke('get-hq-server-url'),
  updateHqServerUrl: (url) => ipcRenderer.invoke('update-hq-server-url', url),
});
