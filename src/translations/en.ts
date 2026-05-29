const en = {
  modes: {
    view: "View Mode",
    edit: "Edit Mode",
    tutorial: "Tutorial Mode",
  },

  buttons: {
    exportBackup: "Export backup",
    importBackup: "Import backup",
    openDocument: "Open document",
    close: "Close",
    deleteFile: "Delete file",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    select: "Open",
    previous: "Previous",
    next: "Next",
    openViewer: "Open viewer",
    openFile: "Open file on PC",
  },

  labels: {
    languageMenu: "Language menu",
    category: "Category",
    description: "Description",
    files: "Files",
    noFiles: "No files added yet",
    noPois: "No POIs yet",
    allGroups: "All groups",
    selectGroup: "Select group",
    appTitle: "Latvia POI Map",
    modeSelectText: "Select how you want to open the map.",
    backToModeSelect: "Back to mode select",
    backToMap: "Back to map",
    group: "Group",
    pois: "POIs",
    noGroup: "No group",
    addFile: "Add file",
    deleteFile: "Delete file",
    editModeHelp: "Edit mode: click on the map to add a new POI.",
    viewModeHelp: "View mode: search and view POIs.",
    pointsOfInterest: "Points Of Interest",
  },

  placeholders: {
    search: "Search POIs...",
    poiName: "POI name",
    description: "Description",
  },

  categories: {
    military: "Military",
    history: "History",
    nature: "Nature",
    city: "City",
    other: "Other",
  },

  status: {
    preparingMedium: "Preparing medium map detail...",
    preparingDetailed: "Preparing detailed map layers...",
    offlineReady: "Offline map ready",
  },

  messages: {
    deletePoiConfirm: "Delete this POI?",
    deleteFileConfirm: "Delete this file?",
    backupExported: "Backup exported successfully.",
    importBackupConfirm: "Importing a backup will replace current POIs and files. Continue?",
    backupImported: "Backup imported successfully.",
    fileCannotPreview: "This file cannot be previewed directly.",
    documentCannotPreview: "This document type cannot be previewed.",
    editPoi: "Edit POI",
    addNewPoi: "Add new POI",
    chooseBackupFolder: "Choose folder to export backup into",
    chooseBackupFile: "Choose backup file",
  },

  tutorial: {
    start: "Start",
    enterPoiName: "Enter the POI name.",
    selectPoiGroup: "Choose a group for this POI.",
    enterPoiDescription: "Enter a description for this POI.",
    savePoi: "Press Save to create the POI.",
    selectPoiText: "Press Open in the marker popup to open the POI details.",
    openViewerText: "Use Open viewer to preview attached files.",
    doneText: "Tutorial completed. You can now use the application.",
    next: "Next",
    back: "Back",
    finish: "Finish",
    step: "Step",

    welcomeTitle: "Tutorial Mode",
    welcomeText:
      "This tutorial will show how to use the map, add POIs, edit them, attach files, and create backups.",

    mapTitle: "Map",
    mapText:
      "This is the main map. Press Start to begin basic training.",

    addPoiTitle: "Add POI",
    addPoiText:
      "Click inside the highlighted map area to add a new point of interest.",

    formTitle: "Fill POI information",
    formText:
      "Enter a name, choose a group, add a description, and press Save.",

    markerTitle: "Open POI",
    markerText:
      "After saving, click the marker and choose Open to view the POI details.",

    filesTitle: "Add files",
    filesText:
      "Here you can attach images, PDFs, videos, and documents to the selected POI.",

    backupTitle: "Backups",
    backupText:
      "In edit mode you can export and import backups to save POIs and attachments.",
  }
};

export default en;