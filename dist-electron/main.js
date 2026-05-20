import { app, ipcMain, BrowserWindow, protocol } from "electron";
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
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
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
  createWindow();
});
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
