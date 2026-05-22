# React + TypeScript + Vite Map Application

A desktop-focused mapping application built with **React**, **TypeScript**, and **Vite**, featuring offline maps, spatial tools, and local data storage.

Built using:
- React Leaflet
- Leaflet Color Markers
- QGIS

---

## ✨ Features

### ✅ Completed

- Export / import backups
- Map marker icons and category-based colors
- Offline map tile support *(Latvia tileset only)*
- Externalized map resources for faster startup performance
- Installer resource bundling support

### 🛠️ In Progress / Planned

- Packaging into installable `.exe`

---

## 🗺️ Offline Maps Setup

### QGIS Tile Source Configuration

1. Open **QGIS**
2. Navigate to:
   - `XYZ Tiles`
   - `New Connection`

3. Configure the connection:

| Setting | Value |
|---|---|
| Name | `CartoDB Positron` |
| URL | `https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png` |

---

## ⚡ Performance Notes

To improve startup speed and reduce application load times:

- Store tilesets and marker assets outside the main project directory
- Bundle large resources as installer extras instead of including them directly in the app bundle

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend framework |
| TypeScript | Type safety |
| Vite | Fast build tooling |
| Leaflet | Interactive maps |
| React Leaflet | React integration for Leaflet |
| QGIS | Tile generation & GIS workflow |
| SQLite *(planned)* | Local database storage |

---

## 🛣️ Roadmap

| Feature | Status |
|---|---|
| Offline maps | ✅ Completed |
| Backup system | ✅ Completed |
| Windows installer | 🚧 Planned |

---

## 📦 Getting Started

### Clone the repository

```bash
git clone https://github.com/JanisSpilva/React-POI.git
```

### Navigate to the project

```bash
cd React-POI
```

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## 📁 Project Goals

This project aims to provide:

- Fast offline-capable map rendering
- Lightweight desktop deployment
- GIS-friendly workflows
- Local-first data storage
- Expandable spatial tooling

---

## 🔗 Resources

- React Leaflet Documentation  
  https://react-leaflet.js.org/

- Leaflet Documentation  
  https://leafletjs.com/

- Leaflet Color Markers  
  https://github.com/pointhi/leaflet-color-markers

- QGIS Official Website  
  https://qgis.org/

- Vite Documentation  
  https://vitejs.dev/

---

## 📄 License

This project is currently private / unlicensed.
