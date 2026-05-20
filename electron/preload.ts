import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  saveAttachmentFile: (filePath: string) =>
    ipcRenderer.invoke("save-attachment-file", filePath),

  loadPOIs: () => ipcRenderer.invoke("load-pois"),

  savePOIs: (pois: any[]) => ipcRenderer.invoke("save-pois", pois),
});