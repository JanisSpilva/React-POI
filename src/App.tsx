import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type POI = {
  id: number;
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
};

function MapClickHandler({
  editMode,
  onMapClick,
}: {
  editMode: boolean;
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      if (editMode) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

function App() {
  const [editMode, setEditMode] = useState(false);
  const [pois, setPois] = useState<POI[]>(() => {
    const savedPois = localStorage.getItem("pois");

    if (savedPois) {
      return JSON.parse(savedPois);
    }

    return [];
  });
  const [newPoint, setNewPoint] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    localStorage.setItem("pois", JSON.stringify(pois));
  }, [pois]);
  const [poiName, setPoiName] = useState("");
  const [poiCategory, setPoiCategory] = useState("");
  const [poiDescription, setPoiDescription] = useState("");

  function handleMapClick(lat: number, lng: number) {
    setNewPoint({ lat, lng });
    setPoiName("");
    setPoiCategory("");
    setPoiDescription("");
  }

  function savePOI() {
    if (!newPoint || !poiName.trim()) return;

    const newPOI: POI = {
      id: Date.now(),
      name: poiName,
      category: poiCategory,
      description: poiDescription,
      lat: newPoint.lat,
      lng: newPoint.lng,
    };

    setPois((prev) => [...prev, newPOI]);
    setNewPoint(null);
  }

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
      <div
        style={{
          width: 300,
          padding: 16,
          background: "#f4f4f4",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
        }}
      >
        <h2>Latvia POI Map</h2>

        <button
          onClick={() => setEditMode(!editMode)}
          style={{
            padding: 10,
            width: "100%",
            background: editMode ? "#ffcc00" : "#ddd",
            border: "1px solid #999",
            cursor: "pointer",
          }}
        >
          {editMode ? "Edit mode ON" : "Edit mode OFF"}
        </button>

        <p style={{ fontSize: 13 }}>
          {editMode
            ? "Click on the map to add a new POI."
            : "Turn on edit mode to add POIs."}
        </p>

        <hr />

        <h3>POIs</h3>

        {pois.length === 0 && <p>No POIs yet.</p>}

        {pois.map((poi) => (
          <div
            key={poi.id}
            style={{
              background: "white",
              padding: 10,
              marginBottom: 8,
              borderRadius: 6,
              border: "1px solid #ddd",
            }}
          >
            <b>{poi.name}</b>
            <br />
            <small>{poi.category || "No category"}</small>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {newPoint && (
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              zIndex: 1000,
              background: "white",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              width: 280,
            }}
          >
            <h3 style={{ marginTop: 0 }}>Add new POI</h3>

            <input
              value={poiName}
              onChange={(e) => setPoiName(e.target.value)}
              placeholder="POI name"
              style={{
                padding: 8,
                width: "100%",
                marginBottom: 8,
                boxSizing: "border-box",
              }}
            />

            <input
              value={poiCategory}
              onChange={(e) => setPoiCategory(e.target.value)}
              placeholder="Category"
              style={{
                padding: 8,
                width: "100%",
                marginBottom: 8,
                boxSizing: "border-box",
              }}
            />

            <textarea
              value={poiDescription}
              onChange={(e) => setPoiDescription(e.target.value)}
              placeholder="Description"
              style={{
                padding: 8,
                width: "100%",
                height: 80,
                boxSizing: "border-box",
              }}
            />

            <div style={{ marginTop: 10 }}>
              <button onClick={savePOI}>Save</button>
              <button onClick={() => setNewPoint(null)} style={{ marginLeft: 8 }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <MapContainer
          center={[56.8796, 24.6032]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler editMode={editMode} onMapClick={handleMapClick} />

          {pois.map((poi) => (
            <Marker key={poi.id} position={[poi.lat, poi.lng]}>
              <Popup>
                <div
                  style={{
                    maxWidth: 250,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  <b>{poi.name}</b>

                  <br />
                  <br />

                  <b>Category:</b> {poi.category}

                  <br />
                  <br />

                  <b>Description:</b>

                  <div style={{ marginTop: 4 }}>
                    {poi.description}
                  </div>

                  <br />

                  Lat: {poi.lat.toFixed(4)}

                  <br />

                  Lng: {poi.lng.toFixed(4)}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default App;