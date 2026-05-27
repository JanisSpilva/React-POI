import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  saveAttachmentFile: (filePath: string) =>
    ipcRenderer.invoke("save-attachment-file", filePath),

  loadPOIs: () => ipcRenderer.invoke("load-pois"),

  savePOIs: (pois: any[]) => ipcRenderer.invoke("save-pois", pois),

  cleanupUnusedFiles: (usedPaths: string[]) =>
    ipcRenderer.invoke("cleanup-unused-files", usedPaths),

  exportBackup: () => ipcRenderer.invoke("export-backup"),

  importBackup: () => ipcRenderer.invoke("import-backup"),

  openFile: (filePath: string) =>
    ipcRenderer.invoke("open-file", filePath),
});