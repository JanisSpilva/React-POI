"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  saveAttachmentFile: (filePath) => electron.ipcRenderer.invoke("save-attachment-file", filePath),
  loadPOIs: () => electron.ipcRenderer.invoke("load-pois"),
  savePOIs: (pois) => electron.ipcRenderer.invoke("save-pois", pois)
});
