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
import lv from "./translations/lv";
import en from "./translations/en";

declare global {
  interface Window {
    electronAPI: {
      cleanupUnusedFiles: (usedPaths: string[]) => Promise<void>;
      loadPOIs: () => Promise<POI[]>;
      savePOIs: (pois: POI[]) => Promise<void>;

      saveAttachmentFile: (
        filePath: string
      ) => Promise<{
        name: string;
        path: string;
      }>;

      exportBackup: () => Promise<boolean>;
      importBackup: () => Promise<boolean>;
      openFile: (filePath: string) => Promise<boolean>;

      getAvailableMaxZoom: () => Promise<number>;

      onMapExtractionStatus: (
        callback: (status: { message: string; detail: string }) => void
      ) => void;

    };
  }
}

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
  path: string;
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
  onMapClick: (lat: number, lng: number, event: MouseEvent) => void;
}) {
  useMapEvents({
    click(e) {
      if (editMode) {
        onMapClick(e.latlng.lat, e.latlng.lng, e.originalEvent);
      }
    },
  });

  return null;
}

function TutorialOverlay({
  step,
  t,
  onStart,
  onFinish,
}: {
  step: TutorialStep;
  t: any;
  onStart: () => void;
  onFinish: () => void;
}) {
  const steps: Record<
    TutorialStep,
    {
      title: string;
      text: string;
      circle?: { left: string; top: string; size: number };
      targetId?: string;
    }
  > = {
    mapIntro: {
      title: t.tutorial.mapTitle,
      text: t.tutorial.mapText,
      circle: { left: "62%", top: "50%", size: 320 },
    },
    clickMap: {
      title: t.tutorial.addPoiTitle,
      text: t.tutorial.addPoiText,
      circle: { left: "62%", top: "45%", size: 220 },
    },
    poiName: {
      title: t.tutorial.formTitle,
      text: t.tutorial.enterPoiName,
      targetId: "tutorial-poi-name",
    },
    poiGroup: {
      title: t.tutorial.formTitle,
      text: t.tutorial.selectPoiGroup,
      targetId: "tutorial-poi-group",
    },
    poiDescription: {
      title: t.tutorial.formTitle,
      text: t.tutorial.enterPoiDescription,
      targetId: "tutorial-poi-description",
    },
    savePoi: {
      title: t.tutorial.formTitle,
      text: t.tutorial.savePoi,
      targetId: "tutorial-save-poi",
    },
    clickMarker: {
      title: t.tutorial.markerTitle,
      text: t.tutorial.markerText,
      targetId: "tutorial-created-marker",
    },
    selectPoi: {
      title: t.tutorial.markerTitle,
      text: t.tutorial.selectPoiText,
      targetId: "tutorial-select-poi",
    },
    addFiles: {
      title: t.tutorial.filesTitle,
      text: t.tutorial.filesText,
      targetId: "tutorial-add-files",
    },
    openViewer: {
      title: t.tutorial.filesTitle,
      text: t.tutorial.openViewerText,
      circle: { left: "55%", top: "35%", size: 240 },
    },
    backup: {
      title: t.tutorial.backupTitle,
      text: t.tutorial.backupText,
      circle: { left: "150px", top: "155px", size: 190 },
    },
    done: {
      title: t.tutorial.finish,
      text: t.tutorial.doneText,
      circle: { left: "50%", top: "50%", size: 260 },
    },
  };

  const currentStep = steps[step];
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const targetId = currentStep.targetId;

    if (!targetId) {
      setTargetRect(null);
      return;
    }

    const updateTargetRect = () => {
      const element = document.getElementById(targetId);
      setTargetRect(element ? element.getBoundingClientRect() : null);
    };

    updateTargetRect();

    const retry1 = setTimeout(updateTargetRect, 100);
    const retry2 = setTimeout(updateTargetRect, 300);
    const retry3 = setTimeout(updateTargetRect, 600);
    const retry4 = setTimeout(updateTargetRect, 1000);

    return () => {
      clearTimeout(retry1);
      clearTimeout(retry2);
      clearTimeout(retry3);
      clearTimeout(retry4);
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };

    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, true);

    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect, true);
    };
  }, [currentStep.targetId]);

  const highlightRect = targetRect
    ? {
        left: targetRect.left - 8,
        top: targetRect.top - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
      }
    : null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        pointerEvents: "none",
      }}
    >
      {step === "mapIntro" ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 332,
            background: "rgba(0,0,0,0.72)",
            pointerEvents: "auto",
          }}
        />
      ) : step === "clickMap" ? (
        <>
          {/* Left menu dark and disabled */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 332,
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />

          {/* Dark top area above circle */}
          <div
            style={{
              position: "absolute",
              left: 332,
              top: 0,
              right: 0,
              height: "calc(45% - 110px)",
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />

          {/* Dark bottom area below circle */}
          <div
            style={{
              position: "absolute",
              left: 332,
              top: "calc(45% + 110px)",
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />

          {/* Dark left area beside circle */}
          <div
            style={{
              position: "absolute",
              left: 332,
              top: "calc(45% - 110px)",
              width: "calc(62% - 110px - 332px)",
              height: 220,
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />

          {/* Dark right area beside circle */}
          <div
            style={{
              position: "absolute",
              left: "calc(62% + 110px)",
              top: "calc(45% - 110px)",
              right: 0,
              height: 220,
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />
        </>
      ) : highlightRect ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              height: highlightRect.top,
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 0,
              top: highlightRect.top + highlightRect.height,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: 0,
              top: highlightRect.top,
              width: highlightRect.left,
              height: highlightRect.height,
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: highlightRect.left + highlightRect.width,
              top: highlightRect.top,
              right: 0,
              height: highlightRect.height,
              background: "rgba(0,0,0,0.72)",
              pointerEvents: "auto",
            }}
          />
        </>
      )
        : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.72)",
          }}
        />
      )}

      {step !== "mapIntro" && (
        <div
          style={{
            position: "absolute",
            left: targetRect
              ? targetRect.left - 8
              : currentStep.circle
              ? currentStep.circle.left
              : 0,
            top: targetRect
              ? targetRect.top - 8
              : currentStep.circle
              ? currentStep.circle.top
              : 0,
            width: targetRect
              ? targetRect.width + 16
              : currentStep.circle
              ? currentStep.circle.size
              : 0,
            height: targetRect
              ? targetRect.height + 16
              : currentStep.circle
              ? currentStep.circle.size
              : 0,
            transform: targetRect ? "none" : "translate(-50%, -50%)",
            borderRadius: targetRect || step === "clickMap" ? 12 : "50%",
            border: "4px solid white",
            background: "none",
            pointerEvents: "none",
            boxSizing: "border-box",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          right: 30,
          bottom: 30,
          width: 380,
          background: "white",
          borderRadius: 12,
          padding: 18,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          pointerEvents: "auto",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{currentStep.title}</h3>
        <p>{currentStep.text}</p>

        {step === "mapIntro" && (
          <button onClick={onStart}>{t.tutorial.start}</button>
        )}

        {step === "done" && (
          <button onClick={onFinish}>{t.tutorial.finish}</button>
        )}
      </div>
    </div>
  );
}

type TutorialStep =
  | "mapIntro"
  | "clickMap"
  | "poiName"
  | "poiGroup"
  | "poiDescription"
  | "savePoi"
  | "clickMarker"
  | "selectPoi"
  | "addFiles"
  | "openViewer"
  | "backup"
  | "done";

function App() {
  const [language, setLanguage] = useState<"lv" | "en">("lv");
  const t = language === "lv" ? lv : en;
  const [selectedMode, setSelectedMode] = useState<"view" | "edit" | null>(null);
  const [tutorialMode, setTutorialMode] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<TutorialStep>("mapIntro");
  const editMode = selectedMode === "edit";
  const categoryOptions = [
    {
      value: "military",
      label: t.categories.military,
    },
    {
      value: "history",
      label: t.categories.history,
    },
    {
      value: "nature",
      label: t.categories.nature,
    },
    {
      value: "city",
      label: t.categories.city,
    },
    {
      value: "other",
      label: t.categories.other,
    },
  ];
  const [pois, setPois] = useState<POI[]>([]);
  const [newPoint, setNewPoint] = useState<{ lat: number; lng: number } | null>(null);
  const categories = categoryOptions.map((category) => category.value);
  const [poiName, setPoiName] = useState("");
  const [poiCategory, setPoiCategory] = useState("");
  const [poiDescription, setPoiDescription] = useState("");
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [fileViewerIndex, setFileViewerIndex] = useState<number | null>(null);
  const [editingPoiId, setEditingPoiId] = useState<number | null>(null);
  const [poisLoaded, setPoisLoaded] = useState(false);
  const viewableFiles = selectedPoi ? selectedPoi.attachments : [];
  const [availableMaxZoom, setAvailableMaxZoom] = useState(10);
  const [tutorialPoiId, setTutorialPoiId] = useState<number | null>(null);
  const [mapExtractionStatus, setMapExtractionStatus] = useState<{
    message: string;
    detail: string;
  } | null>(null);

  const normalizeCategory = (category: string) => {
    return category.trim().toLowerCase();
  };

  const getCategoryLabel = (category: string) => {
    const normalized = normalizeCategory(category);

    return (
      t.categories[
        normalized as keyof typeof t.categories
      ] || category
    );
  };

  const filteredPois = pois.filter((poi) => {

    const matchesSearch =
      poi.name.toLowerCase().includes(searchText.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchText.toLowerCase());

    const matchesCategory =
      categoryFilter === "" ||
      normalizeCategory(poi.category) === categoryFilter;

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
      maxZoom: availableMaxZoom,
    });
  }, [
    searchText, 
    categoryFilter, 
    pois, 
    mapRef, 
    selectedPoi, 
    availableMaxZoom
  ]);

  useEffect(() => {
    window.electronAPI.loadPOIs().then((loadedPois) => {
      setPois(loadedPois || []);
      setPoisLoaded(true);
    });
  }, []);

  useEffect(() => {
    window.electronAPI.getAvailableMaxZoom().then((zoom) => {
      setAvailableMaxZoom(zoom);
    });
  }, []);

  useEffect(() => {
    window.electronAPI.onMapExtractionStatus(async (status) => {
      setMapExtractionStatus(status);

      if (status.message === "Medium map detail ready") {
        setAvailableMaxZoom(12);
      }

      if (status.message === "Detailed map layers ready") {
        setAvailableMaxZoom(15);
      }

      if (status.message === "Offline map ready") {
        const zoom = await window.electronAPI.getAvailableMaxZoom();
        setAvailableMaxZoom(zoom);

        setTimeout(() => {
          setMapExtractionStatus(null);
        }, 5000);
      }
    });
  }, []);

  useEffect(() => {
    if (!poisLoaded) return;

    window.electronAPI.savePOIs(pois);
  }, [pois, poisLoaded]);

  useEffect(() => {
    if (!mapRef) return;

    setTimeout(() => {
      mapRef.invalidateSize();
    }, 100);
  }, [pois, mapRef]);

  function advanceTutorial(nextStep: TutorialStep) {
    if (!tutorialMode) return;

    setTutorialStep(nextStep);
  }

  function cleanupFilesAfterChange(nextPois: POI[]) {
    const usedPaths = nextPois.flatMap((poi) =>
      poi.attachments.map((file) => file.path)
    );

    window.electronAPI.cleanupUnusedFiles(usedPaths);
  }

  function fileUrl(path: string) {
    return `localfile://${encodeURIComponent(path)}`;
  }

  function getMarkerColor(category: string) {
    const normalized = category.toLowerCase();

    if (normalized.includes("military")) return "red";
    if (normalized.includes("history")) return "blue";
    if (normalized.includes("nature")) return "green";
    if (normalized.includes("city")) return "orange";

    return "violet";
  }

  function createColoredIcon(color: string) {
    return new L.Icon({
      iconUrl: `markericon://marker-icon-${color}.png`,
      shadowUrl: "markericon://marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }

  function handleMapClick(lat: number, lng: number, event: MouseEvent) {
    if (tutorialMode && tutorialStep === "clickMap") {
      const circleCenterX = window.innerWidth * 0.62;
      const circleCenterY = window.innerHeight * 0.45;
      const circleRadius = 110;

      const distance = Math.sqrt(
        Math.pow(event.clientX - circleCenterX, 2) +
        Math.pow(event.clientY - circleCenterY, 2)
      );

      if (distance > circleRadius) {
        return;
      }
    }
    setEditingPoiId(null);
    setNewPoint({ lat, lng });
    setPoiName("");
    setPoiCategory("");
    setPoiDescription("");

    if (tutorialMode && tutorialStep === "clickMap") {
      advanceTutorial("poiName");
    }
  }

  function savePOI() {
    if (!newPoint || !poiName.trim() || !poiCategory) return;

    if (editingPoiId !== null) {
      setPois((prev) =>
        prev.map((poi) =>
          poi.id === editingPoiId
            ? {
                ...poi,
                name: poiName,
                category: poiCategory,
                description: poiDescription,
                lat: newPoint.lat,
                lng: newPoint.lng,
              }
            : poi
        )
      );

      setEditingPoiId(null);
      setNewPoint(null);
      if (tutorialMode && tutorialStep === "savePoi") {
        advanceTutorial("clickMarker");
      }
      return;
    }

    const newPoiId = Date.now();

    const newPOI: POI = {
      id: newPoiId,
      name: poiName,
      category: poiCategory,
      description: poiDescription,
      lat: newPoint.lat,
      lng: newPoint.lng,
      attachments: [],
    };

    setPois((prev) => [...prev, newPOI]);
    if (tutorialMode) {
      setTutorialPoiId(newPoiId);
    }
    setNewPoint(null);
    setPoiName("");
    setPoiCategory("");
    setPoiDescription("");
    setEditingPoiId(null);

    if (tutorialMode && tutorialStep === "savePoi") {
      setTutorialPoiId(newPoiId);

      setTimeout(() => {
        advanceTutorial("clickMarker");
      }, 300);
    }
  }

  function deletePOI(id: number) {
    const confirmDelete = window.confirm(t.messages.deletePoiConfirm);

    if (!confirmDelete) return;

    const nextPois = pois.filter((poi) => poi.id !== id);

    setPois(nextPois);
    cleanupFilesAfterChange(nextPois);
  }


  async function addFilesToPoi(files: FileList | null) {
    if (!files || !selectedPoi) return;

    for (const file of Array.from(files)) {
      const savedFile = await window.electronAPI.saveAttachmentFile(
        (file as any).path
      );

      const newAttachment: Attachment = {
        id: Date.now() + Math.random(),
        name: savedFile.name,
        type: file.type,
        path: savedFile.path,
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
    }
    if (tutorialMode && tutorialStep === "addFiles") {
      advanceTutorial("openViewer");
    }
  }

  function deleteFileFromPoi(fileId: number) {
    if (!selectedPoi) return;

    const confirmDelete = window.confirm(t.messages.deleteFileConfirm);

    if (!confirmDelete) return;

    const nextPois = pois.map((poi) =>
      poi.id === selectedPoi.id
        ? {
            ...poi,
            attachments: poi.attachments.filter(
              (file) => file.id !== fileId
            ),
          }
        : poi
    );

    setPois(nextPois);

    const updatedSelectedPoi =
      nextPois.find((poi) => poi.id === selectedPoi.id) || null;

    setSelectedPoi(updatedSelectedPoi);

    cleanupFilesAfterChange(nextPois);
  }

  async function exportBackup() {
    const success = await window.electronAPI.exportBackup();

    if (success) {
      alert(t.messages.backupExported);
    }
  }

  async function importBackup() {
    const confirmImport = window.confirm(
      t.messages.importBackupConfirm
    );

    if (!confirmImport) return;

    const success = await window.electronAPI.importBackup();

    if (success) {
      const loadedPois = await window.electronAPI.loadPOIs();
      setPois(loadedPois || []);
      setSelectedPoi(null);
      alert(t.messages.backupImported);
    }
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
          <h1>{t.labels.appTitle}</h1>
          <p>{t.labels.modeSelectText}</p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "lv" | "en")}
            style={{
              padding: 10,
              width: "100%",
              marginBottom: 16,
              boxSizing: "border-box",
            }}
          >
            <option value="lv">Latviešu</option>
            <option value="en">English</option>
          </select>

          <button
            onClick={() => setSelectedMode("view")}
            style={{
              padding: 12,
              width: "100%",
              marginBottom: 12,
              cursor: "pointer",
            }}
          >
            {t.modes.view}
          </button>

          <button
            onClick={() => setSelectedMode("edit")}
            style={{
              padding: 12,
              width: "100%",
              cursor: "pointer",
            }}
          >
            {t.modes.edit}
          </button>
          <button
            onClick={() => {
              setSelectedMode("edit");
              setTutorialMode(true);
              setTutorialStep("mapIntro");
            }}
            style={{
              padding: 12,
              width: "100%",
              marginTop: 12,
              cursor: "pointer",
            }}
          >
            {t.modes.tutorial}
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
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2>{t.labels.appTitle}</h2>

        <button
          onClick={() => setSelectedMode(null)}
          style={{
            padding: 8,
            width: "100%",
            marginBottom: 10,
            cursor: "pointer",
          }}
        >
          {t.labels.backToModeSelect}
        </button>

        {editMode && (
          <>
            <button
              onClick={exportBackup}
              style={{
                padding: 8,
                width: "100%",
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              {t.buttons.exportBackup}
            </button>

            <button
              onClick={importBackup}
              style={{
                padding: 8,
                width: "100%",
                marginBottom: 10,
                cursor: "pointer",
              }}
            >
              {t.buttons.importBackup}
            </button>
          </>
        )}

        <p style={{ fontSize: 13 }}>
          {editMode
            ? t.labels.editModeHelp
            : t.labels.viewModeHelp}
        </p>

        <hr />

        {selectedPoi ? (
          <>
            <button
              onClick={() => setSelectedPoi(null)}
              style={{ padding: 8, width: "100%", marginBottom: 10 }}
            >
              {t.labels.backToMap}
            </button>

            <h3>{selectedPoi.name}</h3>

            <p>
              <b>{t.labels.group}:</b> {getCategoryLabel(selectedPoi.category)}
            </p>

            <p>
              <b>{t.labels.description}:</b> {selectedPoi.description}
            </p>

            {editMode && (
              <>
                <h3>{t.labels.addFile}</h3>

                <input
                  id="tutorial-add-files"
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,video/*"
                  onChange={(e) => addFilesToPoi(e.target.files)}
                />
              </>
            )}
          </>
        ) : (
          <>
            <h3>{t.labels.pointsOfInterest}</h3>

            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={t.placeholders.search}
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
              <option value="">{t.labels.allGroups}</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </select>

            {pois.length === 0 && <p>{t.labels.noPois}</p>}

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
                <small>
                  {poi.category ? getCategoryLabel(poi.category) : t.labels.noGroup}
                </small>

                {editMode && (
                  <>
                    <br />
                    <br />

                    <button
                      onClick={() => {
                        setEditingPoiId(poi.id);
                        setNewPoint({ lat: poi.lat, lng: poi.lng });
                        setPoiName(poi.name);
                        setPoiCategory(poi.category);
                        setPoiDescription(poi.description);
                      }}
                    >
                      {t.buttons.edit}
                    </button>

                    <button
                      onClick={() => deletePOI(poi.id)}
                      style={{ marginLeft: 8 }}
                    >
                      {t.buttons.delete}
                    </button>
                  </>
                )}
              </div>
            ))}
          </>
        )}
        {mapExtractionStatus && (
          <div
            style={{
              marginTop: "auto",
              background: "white",
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 14,
              width: "100%",
              boxSizing: "border-box",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <b>{mapExtractionStatus.message}</b>

            <p style={{ marginBottom: 8 }}>
              {mapExtractionStatus.detail}
            </p>

            <div
              style={{
                height: 8,
                width: "100%",
                background: "#ddd",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width:
                    mapExtractionStatus.detail.includes("13")
                      ? "66%"
                      : mapExtractionStatus.message === "Offline map ready"
                      ? "100%"
                      : "33%",
                  background: "#4caf50",
                }}
              />
            </div>
          </div>
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

            <h2>{t.labels.pois}</h2>

            {selectedPoi.attachments.length === 0 && <p>{t.labels.noFiles}</p>}

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

                <button
                  onClick={() => {
                    const fileIndex = viewableFiles.findIndex((item) => item.id === file.id);
                    setFileViewerIndex(fileIndex);
                  }}
                  style={{ padding: "6px 10px", marginBottom: 10 }}
                >
                  {t.buttons.openViewer}
                </button>
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
                    {t.buttons.deleteFile}
                  </button>
                )}

                {file.type.startsWith("image/") ? (
                  <img
                    src={fileUrl(file.path)}
                    onClick={() => {
                      const fileIndex = viewableFiles.findIndex(
                        (item) => item.id === file.id
                      );
                      setFileViewerIndex(fileIndex);
                    }}
                    style={{
                      maxWidth: 500,
                      width: "100%",
                      cursor: "pointer",
                    }}
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={fileUrl(file.path)}
                    controls
                    style={{
                      maxWidth: 500,
                      width: "100%",
                    }}
                  />
                ) : file.type === "application/pdf" ? (
                  <iframe
                    src={fileUrl(file.path)}
                    style={{
                      width: "100%",
                      height: 400,
                      border: "1px solid #ccc",
                    }}
                  />
                ) : (
                  <button
                    onClick={() => window.electronAPI.openFile(file.path)}
                  >
                    {t.buttons.openDocument}
                  </button>
                )}
              </div>
            ))}

            {fileViewerIndex !== null && viewableFiles[fileViewerIndex] && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.9)",
                  zIndex: 5000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  padding: "20px 20px 100px 20px",
                }}
              >
                <button
                  onClick={() => setFileViewerIndex(null)}
                  style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    padding: 10,
                    cursor: "pointer",
                  }}
                >
                  {t.buttons.close}
                </button>

                <h3 style={{ color: "white" }}>
                  {viewableFiles[fileViewerIndex].name}
                </h3>

                {viewableFiles[fileViewerIndex].type.startsWith("image/") ? (
                  <img
                    src={fileUrl(viewableFiles[fileViewerIndex].path)}
                    style={{
                      maxWidth: "90vw",
                      maxHeight: "80vh",
                    }}
                  />
                ) : viewableFiles[fileViewerIndex].type.startsWith("video/") ? (
                  <video
                    src={fileUrl(viewableFiles[fileViewerIndex].path)}
                    controls
                    style={{
                      maxWidth: "90vw",
                      maxHeight: "80vh",
                    }}
                  />
                ) : viewableFiles[fileViewerIndex].type === "application/pdf" ? (
                  <iframe
                    src={fileUrl(viewableFiles[fileViewerIndex].path)}
                    style={{
                      width: "90vw",
                      height: "80vh",
                      background: "white",
                      border: "none",
                    }}
                  />
                ) : (
                  <div style={{ color: "white", textAlign: "center" }}>
                    <p>{t.messages.fileCannotPreview}</p>

                    <p style={{ color: "white" }}>
                      {t.messages.documentCannotPreview}
                    </p>

                    <button
                      onClick={() =>
                        window.electronAPI.openFile(viewableFiles[fileViewerIndex].path)
                      }
                      style={{
                        padding: "10px 14px",
                        cursor: "pointer",
                      }}
                    >
                      {t.buttons.openFile}
                    </button>
                  </div>
                )}

                <div
                  style={{
                    position: "fixed",
                    bottom: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: 10,
                    zIndex: 6000,
                  }}
                >
                  <button
                    onClick={() =>
                      setFileViewerIndex((prev) =>
                        prev === null || prev === 0 ? viewableFiles.length - 1 : prev - 1
                      )
                    }
                    style={{ padding: 10, marginRight: 10 }}
                  >
                    {t.buttons.previous}
                  </button>

                  <button
                    onClick={() =>
                      setFileViewerIndex((prev) =>
                        prev === null || prev === viewableFiles.length - 1 ? 0 : prev + 1
                      )
                    }
                    style={{ padding: 10 }}
                  >
                    {t.buttons.next}
                  </button>
                </div>
              </div>
            )}

          </div>
        ) : (
          <>
        {newPoint && (
          <div
            style={{
              position: "absolute",
              top: 20,
              left: 70,
              zIndex: 1000,
              background: "white",
              padding: 12,
              borderRadius: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              width: 280,
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              {editingPoiId !== null ? t.messages.editPoi : t.messages.addNewPoi}
            </h3>

            <input
              id="tutorial-poi-name"
              value={poiName}
              onChange={(e) => {
                setPoiName(e.target.value);

                if (
                  tutorialMode &&
                  tutorialStep === "poiName" &&
                  e.target.value.trim().length > 0
                ) {
                  advanceTutorial("poiGroup");
                }
              }}
              placeholder={t.placeholders.poiName}
              style={{
                padding: 8,
                width: "100%",
                marginBottom: 8,
                boxSizing: "border-box",
              }}
            />

            <select
              id="tutorial-poi-group"
              value={poiCategory}
              onChange={(e) => {
                setPoiCategory(e.target.value);

                if (tutorialMode && tutorialStep === "poiGroup") {
                  advanceTutorial("poiDescription");
                }
              }}
              style={{
                padding: 8,
                width: "100%",
                marginBottom: 8,
                boxSizing: "border-box",
              }}
            >
              <option value="">{t.labels.selectGroup}</option>

              {categoryOptions.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.label}
                </option>
              ))}
            </select>

            <textarea
              id="tutorial-poi-description"
              value={poiDescription}
              onChange={(e) => {
                setPoiDescription(e.target.value);

                if (
                  tutorialMode &&
                  tutorialStep === "poiDescription" &&
                  e.target.value.trim().length > 0
                ) {
                  advanceTutorial("savePoi");
                }
              }}
              placeholder={t.placeholders.description}
              style={{
                padding: 8,
                width: "100%",
                height: 80,
                boxSizing: "border-box",
              }}
            />

            <div style={{ marginTop: 10 }}>
              <button id="tutorial-save-poi" onClick={savePOI}>{t.buttons.save}</button>
              <button
                onClick={() => {
                  setNewPoint(null);
                  setEditingPoiId(null);
                }}
                style={{ marginLeft: 8 }}
              >
                {t.buttons.cancel}
              </button>
            </div>
          </div>
        )}

        <MapContainer
          ref={setMapRef}
          center={[56.8796, 24.6032]}
          zoom={8}
          minZoom={8}
          maxZoom={availableMaxZoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="Offline Latvia map"
            url="offlinetile://{z}/{x}/{y}.png"
          />

          <MapClickHandler editMode={editMode} onMapClick={handleMapClick} />
          
          {filteredPois.map((poi) => (
            <Marker
              ref={(marker) => {
                if (poi.id === tutorialPoiId && marker) {
                  const element = marker.getElement();

                  if (element) {
                    element.id = "tutorial-created-marker";
                  }
                }
              }}
              eventHandlers={{
                click: () => {
                  if (tutorialMode && tutorialStep === "clickMarker") {
                    if (poi.id !== tutorialPoiId) return;

                    advanceTutorial("selectPoi");
                  }
                },
              }}
              key={poi.id}
              position={[poi.lat, poi.lng]}
              icon={createColoredIcon(getMarkerColor(poi.category))}
            >
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

                  <b>{t.labels.category}:</b> {getCategoryLabel(poi.category)}

                  <br />
                  <br />

                  <b>{t.labels.description}:</b>

                  <div style={{ marginTop: 4 }}>
                    {poi.description}
                  </div>

                  <br />

                  <button
                    id={poi.id === tutorialPoiId ? "tutorial-select-poi" : undefined}
                    onClick={() => {
                      setSelectedPoi(poi);

                      if (tutorialMode && tutorialStep === "selectPoi") {
                        advanceTutorial("addFiles");
                      }
                    }}
                    style={{
                      padding: "6px 10px",
                      marginTop: 10,
                      cursor: "pointer",
                    }}
                  >
                    {t.buttons.select}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
          </>
        )}
      </div>
      {tutorialMode && (
        <TutorialOverlay
          step={tutorialStep}
          t={t}
          onStart={() => setTutorialStep("clickMap")}
          onFinish={() => {
            setTutorialMode(false);
            setTutorialStep("mapIntro");
          }}
        />
      )}
    </div>
  );
}

export default App;