// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const os = require('os');
const path = require('path');
const { contextBridge, ipcRenderer } = require('electron');
const { writeFile } = require('fs');

contextBridge.exposeInMainWorld('preload', {
  getVideoSources: () => ipcRenderer.invoke('get-video-sources'),
  onSelectedSource: (callback) => ipcRenderer.on('select-source', callback),
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  writeFile: (...args) => writeFile(...args),
  buffer: (...args) => Buffer.from(...args),
});

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
});
