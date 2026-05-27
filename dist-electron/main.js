import { app, ipcMain, dialog, shell, BrowserWindow, protocol } from "electron";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const dataFolder = path.join(app.getPath("userData"), "poi-map-data");
const attachmentsFolder = path.join(dataFolder, "attachments");
const poiFile = path.join(dataFolder, "pois.json");
function ensureDataFolders() {
  if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);
  if (!fs.existsSync(attachmentsFolder)) fs.mkdirSync(attachmentsFolder);
}
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  for (const item of fs.readdirSync(source)) {
    const sourcePath = path.join(source, item);
    const targetPath = path.join(target, item);
    if (fs.statSync(sourcePath).isDirectory()) {
      copyFolderSync(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
ipcMain.handle("export-backup", async () => {
  ensureDataFolders();
  const result = await dialog.showOpenDialog({
    title: "Choose folder to export backup into",
    properties: ["openDirectory"]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return false;
  }
  const backupFolder = path.join(
    result.filePaths[0],
    `poi-map-backup-${Date.now()}`
  );
  copyFolderSync(dataFolder, backupFolder);
  return true;
});
ipcMain.handle("import-backup", async () => {
  const result = await dialog.showOpenDialog({
    title: "Choose backup folder",
    properties: ["openDirectory"]
  });
  if (result.canceled || result.filePaths.length === 0) {
    return false;
  }
  ensureDataFolders();
  const selectedFolder = result.filePaths[0];
  copyFolderSync(selectedFolder, dataFolder);
  return true;
});
ipcMain.handle("load-pois", () => {
  ensureDataFolders();
  if (!fs.existsSync(poiFile)) {
    return [];
  }
  const data = fs.readFileSync(poiFile, "utf-8");
  return JSON.parse(data);
});
ipcMain.handle("save-pois", (_event, pois) => {
  ensureDataFolders();
  fs.writeFileSync(poiFile, JSON.stringify(pois, null, 2), "utf-8");
  return true;
});
ipcMain.handle("save-attachment-file", (_event, filePath) => {
  ensureDataFolders();
  const fileName = `${Date.now()}-${path.basename(filePath)}`;
  const destination = path.join(attachmentsFolder, fileName);
  fs.copyFileSync(filePath, destination);
  return {
    name: path.basename(filePath),
    path: destination
  };
});
ipcMain.handle("cleanup-unused-files", (_event, usedPaths) => {
  ensureDataFolders();
  const usedSet = new Set(usedPaths);
  const files = fs.readdirSync(attachmentsFolder);
  for (const file of files) {
    const fullPath = path.join(attachmentsFolder, file);
    if (!usedSet.has(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
  return true;
});
ipcMain.handle("open-file", async (_event, filePath) => {
  await shell.openPath(filePath);
  return true;
});
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1600,
    height: 1e3,
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  win.maximize();
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(() => {
  protocol.registerFileProtocol("localfile", (request, callback) => {
    const filePath = decodeURIComponent(
      request.url.replace("localfile://", "")
    );
    callback({ path: filePath });
  });
  protocol.registerFileProtocol("markericon", (request, callback) => {
    const iconPath = decodeURIComponent(
      request.url.replace("markericon://", "")
    );
    const markerIconsFolder = app.isPackaged ? path.join(process.resourcesPath, "marker-icons") : "C:\\Users\\sairo\\MAP\\latvia-marker-icons";
    const fullPath = path.join(markerIconsFolder, iconPath);
    callback({ path: fullPath });
  });
  protocol.registerFileProtocol("offlinetile", (request, callback) => {
    const tilePath = decodeURIComponent(
      request.url.replace("offlinetile://", "")
    );
    const tilesFolder = app.isPackaged ? path.join(process.resourcesPath, "offline-tiles") : "C:\\Users\\sairo\\MAP\\latvia-offline-tiles";
    const fullPath = path.join(tilesFolder, tilePath);
    callback({ path: fullPath });
  });
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
