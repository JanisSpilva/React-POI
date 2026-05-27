"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  saveAttachmentFile: (filePath) => electron.ipcRenderer.invoke("save-attachment-file", filePath),
  loadPOIs: () => electron.ipcRenderer.invoke("load-pois"),
  savePOIs: (pois) => electron.ipcRenderer.invoke("save-pois", pois),
  cleanupUnusedFiles: (usedPaths) => electron.ipcRenderer.invoke("cleanup-unused-files", usedPaths),
  exportBackup: () => electron.ipcRenderer.invoke("export-backup"),
  importBackup: () => electron.ipcRenderer.invoke("import-backup"),
  openFile: (filePath) => electron.ipcRenderer.invoke("open-file", filePath)
});
