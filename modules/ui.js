import { deleteTower, repairTower, repairAllTowers, enterRepairMode, selectTower } from "./towers.js"

export function initializeDefaultMenu() {
    updateCommandPanel([
        { id: "btn-1", label: "Build Tower", action: () => openBuildTowerMenu(1) },
        { id: "btn-2", label: "Repair Tower", action: openRepairTowerMenu },
        { id: "btn-3", label: "Delete Tower", action: openDeleteTowerMenu },
        { id: "btn-4", label: "Global Upgrades", action: openGlobalUpgradesMenu },
        { id: "btn-5", label: "Tower Research", action: openTowerResearchMenu },
        { id: "btn-6", label: "", action: null },
        { id: "btn-7", label: "", action: null },
        { id: "btn-8", label: "", action: null },
        { id: "btn-9", label: "", action: null },
        { id: "btn-10", label: "", action: null },
        { id: "btn-11", label: "", action: null },
        { id: "btn-12", label: "Next Wave", action: startNextWave }
    ])
}

export function updateCommandPanel(options) {
    const panel = document.querySelector(".command-grid")
    panel.innerHTML = ""

    options.forEach(option => {
        const button = document.createElement("button")
        button.classList.add("command-button")
        button.id = option.id
        button.textContent = option.label
        if (option.action) {
            button.addEventListener("click", option.action)
        } else {
            button.classList.add("empty-button")
        }
        panel.appendChild(button)
    })
}

export function openBuildTowerMenu(page = 1) {
    const towerPages = {
        1: [
            { id: "btn-1", label: "Machine Gun Tower", action: () => selectTower("Machine Gun") },
            { id: "btn-2", label: "Shotgun Tower", action: () => selectTower("Shotgun") },
            { id: "btn-3", label: "Artillery Tower", action: () => selectTower("Artillery") },
            { id: "btn-4", label: "Rail Gun Tower", action: () => selectTower("Rail Gun") },
            { id: "btn-5", label: "EMP Tower", action: () => selectTower("EMP") },
            { id: "btn-6", label: "Shield Tower", action: () => selectTower("Shield") },
            { id: "btn-7", label: "Proximity Mine Tower", action: () => selectTower("Proximity Mine") },
            { id: "btn-8", label: "", action: null },
            { id: "btn-9", label: "", action: null }
        ],
        2: [
            { id: "btn-1", label: "Advanced Tower 1", action: () => selectTower("Advanced Tower 1") },
            { id: "btn-2", label: "Advanced Tower 2", action: () => selectTower("Advanced Tower 2") },
            { id: "btn-3", label: "Advanced Tower 3", action: () => selectTower("Advanced Tower 3") },
            { id: "btn-4", label: "Advanced Tower 4", action: () => selectTower("Advanced Tower 4") },
            { id: "btn-5", label: "", action: null },
            { id: "btn-6", label: "", action: null },
            { id: "btn-7", label: "", action: null },
            { id: "btn-8", label: "", action: null },
            { id: "btn-9", label: "", action: null }
        ]
    }
    const hasPreviousPage = page > 1
    const hasNextPage = page < Object.keys(towerPages).length
    updateCommandPanel([
        ...towerPages[page],
        { id: "btn-10", label: hasPreviousPage ? "←" : "", action: hasPreviousPage ? () => openBuildTowerMenu(page - 1) : null },
        { id: "btn-11", label: hasNextPage ? "→" : "", action: hasNextPage ? () => openBuildTowerMenu(page + 1) : null },
        { id: "btn-12", label: "Cancel", action: initializeDefaultMenu }
    ])
}

export function openRepairTowerMenu() {
    updateCommandPanel([
        { id: "btn-1", label: "Repair Tower", action: enterRepairMode },
        { id: "btn-2", label: "Repair All Towers", action: repairAllTowers },
        { id: "btn-3", label: "", action: null },
        { id: "btn-4", label: "", action: null },
        { id: "btn-5", label: "", action: null },
        { id: "btn-6", label: "", action: null },
        { id: "btn-7", label: "", action: null },
        { id: "btn-8", label: "", action: null },
        { id: "btn-9", label: "", action: null },
        { id: "btn-10", label: "", action: null },
        { id: "btn-11", label: "", action: null },
        { id: "btn-12", label: "Cancel", action: initializeDefaultMenu }
    ])
}

let selectedTower = null;

export function openDeleteTowerMenu() {
    isDeleteMode = true
    selectedTower = null // Reset selection

    updateCommandPanel([
        { id: "btn-1", label: "Confirm", action: confirmDeleteTower, disabled: true }, // Starts disabled
        { id: "btn-2", label: "", action: null },
        { id: "btn-3", label: "", action: null },
        { id: "btn-4", label: "", action: null },
        { id: "btn-5", label: "", action: null },
        { id: "btn-6", label: "", action: null },
        { id: "btn-7", label: "", action: null },
        { id: "btn-8", label: "", action: null },
        { id: "btn-9", label: "", action: null },
        { id: "btn-10", label: "", action: null },
        { id: "btn-11", label: "", action: null },
        { id: "btn-12", label: "Cancel", action: cancelDeleteMode } // Always cancels delete mode
    ])
}

export function updateDeleteMenu() {
    updateCommandPanel([
        { id: "btn-1", label: `Confirm Delete: ${selectedTower.name}`, action: confirmDeleteTower }, // ✅ Enable confirm
        { id: "btn-12", label: "Cancel", action: cancelDeleteMode }
    ]);
}

function cancelDeleteMode() {
    isDeleteMode = false
    selectedTower = null
    initializeDefaultMenu()
}

function confirmDeleteTower() {
    if (!selectedTower) return

    console.log(`❌ Deleting Tower: ${selectedTower.name}`)
    deleteTower(selectedTower) // ✅ Removes the tower
    selectedTower = null // Reset selection
    isDeleteMode = true // Stay in Delete Mode for additional deletions

    openDeleteTowerMenu(); // ✅ Reset the menu for the next selection
}

function openGlobalUpgradesMenu() { console.log("Opening Global Upgrades Menu") }
function openTowerResearchMenu() { console.log("Opening Tower Research Menu") }
function startNextWave() { console.log("Starting Next Wave") }
function openSettingsMenu() { console.log("Opening Settings Menu") }

export function showSettingsWindow() {
    document.getElementById("settings-window").classList.remove("hidden")
    document.getElementById("message-log-window").classList.add("pointer-blocked")
  }
  
  export function hideSettingsWindow() {
    document.getElementById("settings-window").classList.add("hidden")
    document.getElementById("message-log-window").classList.remove("pointer-blocked")
  }
  
  export function updateSettingsContent(tabName) {
    const content = document.getElementById("settings-content")
    content.innerHTML = `<h2>${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Settings</h2><p>Coming soon...</p>`
    if (tabName === "volume") {
        content.innerHTML = `
          <h2>Volume Settings</h2>
          <p>Adjust audio levels for the game.</p>
          <div style="margin-top: 20px;">
            <div style="margin-bottom: 20px;">
              <label for="global-volume">Global</label>
              <input type="range" id="global-volume" min="0" max="100" value="80" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="music-volume">Music</label>
              <input type="range" id="music-volume" min="0" max="100" value="70" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="sfx-volume">Sound Effects</label>
              <input type="range" id="sfx-volume" min="0" max="100" value="75" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="ui-volume">UI</label>
              <input type="range" id="ui-volume" min="0" max="100" value="60" style="width: 100%;">
            </div>
          </div>`
      } else {
        content.innerHTML = `<h2>${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Settings</h2><p>Coming soon...</p>`
      }
  }

  export function logMessage(text) {
    // 1. Permanently add to the Message Log Panel
    const logContent = document.getElementById("message-log-content");
    const logEntry = document.createElement("p");
    logEntry.textContent = text;
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
  
    // 2. Always show temporary on-screen popup
    const popupsContainer = document.getElementById("message-popups-container");
  
    const popup = document.createElement("div");
    popup.classList.add("message-popup");
    popup.textContent = text;
    popupsContainer.appendChild(popup);
  
    // Fade out and remove popup after 4 seconds
    setTimeout(() => {
      popup.style.opacity = "0";
      setTimeout(() => popup.remove(), 500);
    }, 4000);
  }

  export function updateUIBlockerState() {
    const overlay = document.getElementById("ui-blocker-overlay");
  
    if (gameState.paused) {
      overlay.classList.remove("hidden");
    } else {
      overlay.classList.add("hidden");
    }
  }