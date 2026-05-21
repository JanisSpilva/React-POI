import { app, BrowserWindow, ipcMain, protocol, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

const dataFolder = path.join(app.getPath("userData"), "poi-map-data");
const attachmentsFolder = path.join(dataFolder, "attachments");
const poiFile = path.join(dataFolder, "pois.json");

function ensureDataFolders() {
  if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);
  if (!fs.existsSync(attachmentsFolder)) fs.mkdirSync(attachmentsFolder);
}

function copyFolderSync(source: string, target: string) {
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
    properties: ["openDirectory"],
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
    properties: ["openDirectory"],
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

ipcMain.handle("save-attachment-file", (_event, filePath: string) => {
  ensureDataFolders();

  const fileName = `${Date.now()}-${path.basename(filePath)}`;
  const destination = path.join(attachmentsFolder, fileName);

  fs.copyFileSync(filePath, destination);

  return {
    name: path.basename(filePath),
    path: destination,
  };
});

ipcMain.handle("cleanup-unused-files", (_event, usedPaths: string[]) => {
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

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  protocol.registerFileProtocol("localfile", (request, callback) => {
    const filePath = decodeURIComponent(
      request.url.replace("localfile://", "")
    );

    callback({ path: filePath });
  });

  createWindow();
});
