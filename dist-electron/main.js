import { app as c, ipcMain as l, dialog as S, shell as R, BrowserWindow as w, protocol as u } from "electron";
import { fileURLToPath as g } from "node:url";
import t from "node:fs";
import n from "node:path";
const j = n.dirname(g(import.meta.url));
process.env.APP_ROOT = n.join(j, "..");
const p = n.join(c.getPath("userData"), "poi-map-data"), f = n.join(p, "attachments"), h = n.join(p, "pois.json");
function d() {
  t.existsSync(p) || t.mkdirSync(p), t.existsSync(f) || t.mkdirSync(f);
}
function P(o, e) {
  t.existsSync(e) || t.mkdirSync(e, { recursive: !0 });
  for (const i of t.readdirSync(o)) {
    const r = n.join(o, i), a = n.join(e, i);
    t.statSync(r).isDirectory() ? P(r, a) : t.copyFileSync(r, a);
  }
}
l.handle("export-backup", async () => {
  d();
  const o = await S.showOpenDialog({
    title: "Choose folder to export backup into",
    properties: ["openDirectory"]
  });
  if (o.canceled || o.filePaths.length === 0)
    return !1;
  const e = n.join(
    o.filePaths[0],
    `poi-map-backup-${Date.now()}`
  );
  return P(p, e), !0;
});
l.handle("import-backup", async () => {
  const o = await S.showOpenDialog({
    title: "Choose backup folder",
    properties: ["openDirectory"]
  });
  if (o.canceled || o.filePaths.length === 0)
    return !1;
  d();
  const e = o.filePaths[0];
  return P(e, p), !0;
});
l.handle("load-pois", () => {
  if (d(), !t.existsSync(h))
    return [];
  const o = t.readFileSync(h, "utf-8");
  return JSON.parse(o);
});
l.handle("save-pois", (o, e) => (d(), t.writeFileSync(h, JSON.stringify(e, null, 2), "utf-8"), !0));
l.handle("save-attachment-file", (o, e) => {
  d();
  const i = `${Date.now()}-${n.basename(e)}`, r = n.join(f, i);
  return t.copyFileSync(e, r), {
    name: n.basename(e),
    path: r
  };
});
l.handle("cleanup-unused-files", (o, e) => {
  d();
  const i = new Set(e), r = t.readdirSync(f);
  for (const a of r) {
    const y = n.join(f, a);
    i.has(y) || t.unlinkSync(y);
  }
  return !0;
});
l.handle("open-file", async (o, e) => (await R.openPath(e), !0));
const m = process.env.VITE_DEV_SERVER_URL, I = n.join(process.env.APP_ROOT, "dist-electron"), _ = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = m ? n.join(process.env.APP_ROOT, "public") : _;
let s;
function v() {
  s = new w({
    width: 1600,
    height: 1e3,
    autoHideMenuBar: !0,
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: n.join(j, "preload.mjs")
    }
  }), s.maximize(), s.webContents.on("did-finish-load", () => {
    s == null || s.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), m ? s.loadURL(m) : s.loadFile(n.join(_, "index.html"));
}
c.on("window-all-closed", () => {
  process.platform !== "darwin" && (c.quit(), s = null);
});
c.on("activate", () => {
  w.getAllWindows().length === 0 && v();
});
c.whenReady().then(() => {
  u.registerFileProtocol("localfile", (o, e) => {
    const i = decodeURIComponent(
      o.url.replace("localfile://", "")
    );
    e({ path: i });
  }), u.registerFileProtocol("markericon", (o, e) => {
    const i = decodeURIComponent(
      o.url.replace("markericon://", "")
    ), r = c.isPackaged ? n.join(process.resourcesPath, "marker-icons") : "C:\\Users\\sairo\\MAP\\latvia-marker-icons", a = n.join(r, i);
    e({ path: a });
  }), u.registerFileProtocol("offlinetile", (o, e) => {
    const i = decodeURIComponent(
      o.url.replace("offlinetile://", "")
    ), r = c.isPackaged ? n.join(process.resourcesPath, "offline-tiles") : "C:\\Users\\sairo\\MAP\\latvia-offline-tiles", a = n.join(r, i);
    e({ path: a });
  }), v();
});
export {
  I as MAIN_DIST,
  _ as RENDERER_DIST,
  m as VITE_DEV_SERVER_URL
};
