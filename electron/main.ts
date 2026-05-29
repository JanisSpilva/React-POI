import { app, BrowserWindow, ipcMain, protocol, shell, dialog } from 'electron'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'
import extract from "extract-zip";

const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

const dataFolder = path.join(app.getPath("userData"), "poi-map-data");
const attachmentsFolder = path.join(dataFolder, "attachments");
const poiFile = path.join(dataFolder, "pois.json");
const extractedTilesFolder = path.join(dataFolder, "offline-tiles");
const extractedMarkerFolder = path.join(dataFolder, "marker-icons");

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

  fs.mkdirSync(backupFolder, { recursive: true });

  if (fs.existsSync(poiFile)) {
    fs.copyFileSync(poiFile, path.join(backupFolder, "pois.json"));
  }

  if (fs.existsSync(attachmentsFolder)) {
    copyFolderSync(
      attachmentsFolder,
      path.join(backupFolder, "attachments")
    );
  }

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
  const backupPoiFile = path.join(selectedFolder, "pois.json");
  const backupAttachmentsFolder = path.join(selectedFolder, "attachments");

  if (fs.existsSync(backupPoiFile)) {
    fs.copyFileSync(backupPoiFile, poiFile);
  }

  if (fs.existsSync(backupAttachmentsFolder)) {
    if (fs.existsSync(attachmentsFolder)) {
      fs.rmSync(attachmentsFolder, {
        recursive: true,
        force: true,
      });
    }

    copyFolderSync(backupAttachmentsFolder, attachmentsFolder);
  }

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

ipcMain.handle("open-file", async (_event, filePath: string) => {
  await shell.openPath(filePath);
  return true;
});

function getAvailableMaxZoom() {
  if (fs.existsSync(path.join(extractedTilesFolder, ".detail-ready"))) {
    return 15;
  }

  if (fs.existsSync(path.join(extractedTilesFolder, ".medium-ready"))) {
    return 12;
  }

  if (fs.existsSync(path.join(extractedTilesFolder, ".basic-ready"))) {
    return 10;
  }

  return 8;
}

ipcMain.handle("get-available-max-zoom", () => {
  return getAvailableMaxZoom();
});

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function getResourceZipPath(fileName: string) {
  return app.isPackaged
    ? path.join(process.resourcesPath, fileName)
    : path.join("C:\\Users\\sairo\\MAP", fileName);
}

async function extractZipIfNeeded(
  zipName: string,
  targetFolder: string,
  doneFileName: string
) {
  const doneFile = path.join(targetFolder, doneFileName);

  if (fs.existsSync(doneFile)) {
    return;
  }

  const zipPath = getResourceZipPath(zipName);

  if (!fs.existsSync(zipPath)) {
    console.error("Missing ZIP:", zipPath);
    return;
  }

  await extract(zipPath, {
    dir: targetFolder,
  });

  fs.writeFileSync(doneFile, "done", "utf-8");
}

async function ensureBasicOfflineResources() {
  ensureDataFolders();

  if (!fs.existsSync(extractedTilesFolder)) {
    fs.mkdirSync(extractedTilesFolder, { recursive: true });
  }

  if (!fs.existsSync(extractedMarkerFolder)) {
    fs.mkdirSync(extractedMarkerFolder, { recursive: true });
  }

  await extractZipIfNeeded(
    "latvia-tiles-basic.zip",
    extractedTilesFolder,
    ".basic-ready"
  );

  await extractZipIfNeeded(
    "latvia-marker-icons.zip",
    extractedMarkerFolder,
    ".markers-ready"
  );
}

async function extractDetailedTilesInBackground() {
  try {
    if (!fs.existsSync(path.join(extractedTilesFolder, ".medium-ready"))) {
      win?.webContents.send("map-extraction-status", {
        message: "Preparing medium map detail...",
        detail: "Zoom 11–12 unpacking",
      });

      await extractZipIfNeeded(
        "latvia-tiles-medium.zip",
        extractedTilesFolder,
        ".medium-ready"
      );

      win?.webContents.send("map-extraction-status", {
        message: "Medium map detail ready",
        detail: "Zoom 11–12 is now available",
      });
    }

    if (!fs.existsSync(path.join(extractedTilesFolder, ".detail-ready"))) {
      win?.webContents.send("map-extraction-status", {
        message: "Preparing detailed map layers...",
        detail: "Zoom 13–15 unpacking",
      });

      await extractZipIfNeeded(
        "latvia-tiles-detail.zip",
        extractedTilesFolder,
        ".detail-ready"
      );

      win?.webContents.send("map-extraction-status", {
        message: "Detailed map layers ready",
        detail: "Zoom 13–15 is now available",
      });
    }

    win?.webContents.send("map-extraction-status", {
      message: "Offline map ready",
      detail: "All zoom levels are available",
    });
  } catch (error) {
    console.error("Background extraction failed:", error);

    win?.webContents.send("map-extraction-status", {
      message: "Map extraction problem",
      detail: "Some zoom levels may not be available yet",
    });
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1600,
    height: 1000,
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),

    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  win.maximize();

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

app.whenReady().then(async () => {
  await ensureBasicOfflineResources();
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

    const markerIconsFolder = app.isPackaged
      ? extractedMarkerFolder
      : "C:\\Users\\sairo\\MAP\\latvia-marker-icons";

    const fullPath = path.join(markerIconsFolder, iconPath);

    callback({ path: fullPath });
  });

  protocol.registerFileProtocol("offlinetile", (request, callback) => {
    const tilePath = decodeURIComponent(
      request.url.replace("offlinetile://", "")
    );

  const tilesFolder = app.isPackaged
    ? extractedTilesFolder
    : "C:\\Users\\sairo\\MAP\\latvia-offline-tiles";

  const fullPath = path.join(tilesFolder, tilePath);

    callback({ path: fullPath });
  });

  createWindow();

  setTimeout(() => {
    extractDetailedTilesInBackground();
  }, 1000);
});
