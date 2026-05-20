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

type Attachment = {
  id: number;
  name: string;
  type: string;
  dataUrl: string;
};

type POI = {
  id: number;
  name: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  attachments: Attachment[];
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
  const [selectedMode, setSelectedMode] = useState<"view" | "edit" | null>(null);
  const editMode = selectedMode === "edit";
  const [pois, setPois] = useState<POI[]>(() => {
    const savedPois = localStorage.getItem("pois");

    if (savedPois) {
      return JSON.parse(savedPois).map((poi: POI) => ({
        ...poi,
        attachments: poi.attachments || [],
      }));
    }

    return [];
  });
  const [newPoint, setNewPoint] = useState<{ lat: number; lng: number } | null>(null);
  useEffect(() => {
    localStorage.setItem("pois", JSON.stringify(pois));
  }, [pois]);

  const categories = Array.from(
    new Set(pois.map((poi) => poi.category).filter(Boolean))
  );
  const [poiName, setPoiName] = useState("");
  const [poiCategory, setPoiCategory] = useState("");
  const [poiDescription, setPoiDescription] = useState("");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);

  const filteredPois = pois.filter((poi) => {
    const matchesSearch =
      poi.name.toLowerCase().includes(searchText.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      categoryFilter === "" || poi.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (!mapRef) return;
    if (selectedPoi) return;
    if (filteredPois.length === 0) return;

    const bounds = L.latLngBounds(
      filteredPois.map((poi) => [poi.lat, poi.lng])
    );

    mapRef.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 14,
    });
  }, [searchText, categoryFilter, mapRef, selectedPoi]);

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
      attachments: [],
    };

    setPois((prev) => [...prev, newPOI]);
    setNewPoint(null);
  }

  function deletePOI(id: number) {
    const confirmDelete = window.confirm("Delete this POI?");

    if (!confirmDelete) return;

    setPois((prev) => prev.filter((poi) => poi.id !== id));
  }


  function addFilesToPoi(files: FileList | null) {
    if (!files || !selectedPoi) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const newAttachment: Attachment = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          dataUrl: reader.result as string,
        };

        setPois((prev) =>
          prev.map((poi) =>
            poi.id === selectedPoi.id
              ? {
                  ...poi,
                  attachments: [...poi.attachments, newAttachment],
                }
              : poi
          )
        );

        setSelectedPoi((prev) =>
          prev
            ? {
                ...prev,
                attachments: [...prev.attachments, newAttachment],
              }
            : prev
        );
      };

      reader.readAsDataURL(file);
    });
  }

  function deleteFileFromPoi(fileId: number) {
    if (!selectedPoi) return;

    const confirmDelete = window.confirm("Delete this file?");

    if (!confirmDelete) return;

    setPois((prev) =>
      prev.map((poi) =>
        poi.id === selectedPoi.id
          ? {
              ...poi,
              attachments: poi.attachments.filter((file) => file.id !== fileId),
            }
          : poi
      )
    );

    setSelectedPoi((prev) =>
      prev
        ? {
            ...prev,
            attachments: prev.attachments.filter((file) => file.id !== fileId),
          }
        : prev
    );
  }

  if (!selectedMode) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f4f4",
        }}
      >
        <div
          style={{
            background: "white",
            padding: 30,
            borderRadius: 10,
            boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            textAlign: "center",
            width: 320,
          }}
        >
          <h1>POI Map</h1>
          <p>Select how you want to open the map.</p>

          <button
            onClick={() => setSelectedMode("view")}
            style={{
              padding: 12,
              width: "100%",
              marginBottom: 12,
              cursor: "pointer",
            }}
          >
            View Mode
          </button>

          <button
            onClick={() => setSelectedMode("edit")}
            style={{
              padding: 12,
              width: "100%",
              cursor: "pointer",
            }}
          >
            Edit Mode
          </button>
        </div>
      </div>
    );
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
        <h2>POI Map</h2>

        <button
          onClick={() => setSelectedMode(null)}
          style={{
            padding: 8,
            width: "100%",
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          Back to mode select
        </button>

        <p style={{ fontSize: 13 }}>
          {editMode
            ? "Edit mode: click on the map to add a new POI."
            : "View mode: search and view POIs."}
        </p>

        <hr />

        {selectedPoi ? (
          <>
            <button
              onClick={() => setSelectedPoi(null)}
              style={{ padding: 8, width: "100%", marginBottom: 10 }}
            >
              Back to map
            </button>

            <h3>{selectedPoi.name}</h3>

            <p>
              <b>Group:</b> {selectedPoi.category}
            </p>

            <p>
              <b>Description:</b> {selectedPoi.description}
            </p>

            {editMode && (
              <>
                <h3>Add file</h3>

                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => addFilesToPoi(e.target.files)}
                />
              </>
            )}
          </>
        ) : (
          <>
            <h3>POIs</h3>

            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search POIs..."
              style={{
                padding: 8,
                width: "100%",
                marginBottom: 8,
                boxSizing: "border-box",
              }}
            />

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                padding: 8,
                width: "100%",
                marginBottom: 12,
                boxSizing: "border-box",
              }}
            >
              <option value="">All groups</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {pois.length === 0 && <p>No POIs yet.</p>}

            {filteredPois.map((poi) => (
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
                <small>{poi.category || "No group"}</small>

                {editMode && (
                  <>
                    <br />
                    <br />

                    <button onClick={() => deletePOI(poi.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ flex: 1, position: "relative" }}>
        {selectedPoi ? (
          <div
            style={{
              padding: 20,
              height: "100%",
              overflowY: "auto",
              background: "white",
            }}
          >
            <hr />

            <h2>Files</h2>

            {selectedPoi.attachments.length === 0 && <p>No files added yet.</p>}

            {selectedPoi.attachments.map((file) => (
              <div
                key={file.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 20,
                }}
              >
                <h4>{file.name}</h4>
                
                {editMode && (
                  <button
                    onClick={() => deleteFileFromPoi(file.id)}
                    style={{
                      padding: "6px 10px",
                      marginBottom: 10,
                      background: "#ffdddd",
                      border: "1px solid #cc9999",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                  >
                    Delete file
                  </button>
                )}

                {file.type.startsWith("image/") ? (
                  <img
                    src={file.dataUrl}
                    style={{
                      maxWidth: 500,
                      width: "100%",
                    }}
                  />
                ) : (
                  <a href={file.dataUrl} target="_blank">
                    Open PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <>
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
          ref={setMapRef}
          center={[56.8796, 24.6032]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler editMode={editMode} onMapClick={handleMapClick} />
          
          {filteredPois.map((poi) => (
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

                  <button
                    onClick={() => setSelectedPoi(poi)}
                    style={{
                      padding: "6px 10px",
                      marginTop: 10,
                      cursor: "pointer",
                    }}
                  >
                    Select
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
          </>
        )}
      </div>
    </div>
  );
}

export default App;