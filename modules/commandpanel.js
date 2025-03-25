import { gameState, resetInteractionModes } from './gameState.js'
import { playerData } from './playerData.js'
import { playTowerDestruction } from './towers.js'
import { selectTower } from './handlers.js'
import { startNextWave } from './main.js'
import { showResearchWindow } from './ui.js'
import { towerConfigs } from './towerConfigs.js'

export function setCommandPanelMode(mode) {
    resetInteractionModes()
    gameState.commandPanelMode = mode
    switch (mode) {
      case 'build':
        gameState.isBuildMode = true
        break
      case 'delete':
        gameState.isDeleteMode = true
        break
      default:
        break
    }
}

export function initializeDefaultMenu() {
    setCommandPanelMode('default')
    updateCommandPanel([
        { id: "btn-1", label: "Build Tower", action: showBuildTowerMenu },
        { id: "btn-2", label: "Repair Tower", action: openRepairTowerMenu },
        { id: "btn-3", label: "Delete Tower", action: openDeleteTowerMenu },
        { id: "btn-4", label: "Global Upgrades", action: openGlobalUpgradesMenu },
        { id: "btn-5", label: "Tower Research", action: showResearchWindow },
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
    while (panel.firstChild) {
        panel.removeChild(panel.firstChild)
    }
    options.forEach(option => {
        const button = document.createElement("button")
        button.classList.add("command-button")
        button.id = option.id
        button.textContent = option.label
        if (option.disabled) {
            button.disabled = true
            button.classList.add("command-button-disabled")
        } else if (option.action) {
            button.addEventListener("click", option.action)
        } else {
            button.classList.add("empty-button")
        }
        panel.appendChild(button)
    })
}

export function setCommandButton(id, label, onClick) {
    const button = document.getElementById(`btn-${id}`);
    if (!button) return;
  
    button.innerText = label || '';
    button.disabled = !label;
  
    // Clear previous click events
    button.onclick = null;
  
    // Assign new one if provided
    if (onClick && label) {
      button.onclick = onClick;
    }
}
  
export function clearCommandButton(id) {
    setCommandButton(id, '', null);
}

export function resetCommandPanel() {
    const panel = document.querySelector(".command-grid")
    while (panel.firstChild) {
        panel.removeChild(panel.firstChild)
    }
}

  let towerBuildPage = 0;
  const towersPerPage = 9;
  
  export function showBuildTowerMenu() {
    setCommandPanelMode('build');
    const towerNames = Object.keys(towerConfigs);
    const totalPages = Math.ceil(towerNames.length / towersPerPage);
    const pageTowers = towerNames.slice(
      towerBuildPage * towersPerPage,
      (towerBuildPage + 1) * towersPerPage
    );
  
    const options = [];
  
    for (let i = 0; i < towersPerPage; i++) {
      const towerName = pageTowers[i];
      options.push({
        id: `btn-${i + 1}`,
        label: towerName || "",
        action: towerName
          ? () => enterTowerPlacementMode(towerConfigs[towerName].class)
          : null
      });
    }
  
    // Pagination
    options.push({
      id: "btn-10",
      label: towerBuildPage > 0 ? "◀️ Prev" : "",
      action: towerBuildPage > 0 ? () => {
        towerBuildPage--;
        showBuildTowerMenu();
      } : null
    });
  
    options.push({
      id: "btn-11",
      label: towerBuildPage < totalPages - 1 ? "Next ▶️" : "",
      action: towerBuildPage < totalPages - 1 ? () => {
        towerBuildPage++;
        showBuildTowerMenu();
      } : null
    });
  
    options.push({
      id: "btn-12",
      label: "Cancel",
      action: () => {
        towerBuildPage = 0;
        initializeDefaultMenu();
      }
    });
  
    updateCommandPanel(options);
  }

export function openRepairTowerMenu() {
    setCommandPanelMode('default')
    updateCommandPanel([
        { id: "btn-1", label: "Repair Tower", action: enterRepairMode },
        { id: "btn-2", label: "Repair All Towers", action: promptRepairAllConfirmation },
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

export function enterRepairMode() {
    resetInteractionModes()
    gameState.isRepairMode = true
}

export function promptRepairAllConfirmation() {
    const infoPanel = document.getElementById("info-panel")
    infoPanel.innerHTML = ""

    let totalCost = 0

    gameState.towers.forEach(tower => {
        if (tower.health < tower.maxHealth) {
            const missingHealth = tower.maxHealth - tower.health
            const costToRepair = Math.ceil(missingHealth * 0.5)
            totalCost += costToRepair
        }
    })

    const message = document.createElement("p")
    message.textContent = `Repair all towers for ${totalCost} Minerals?`
    infoPanel.appendChild(message)

    const confirmBtn = document.createElement("button")
    confirmBtn.textContent = "Confirm Repair"
    confirmBtn.onclick = () => {
        repairAllTowers()
        resetCommandPanel()
        initializeDefaultMenu()
        infoPanel.innerHTML = ""
    }
    infoPanel.appendChild(confirmBtn)

    const cancelBtn = document.createElement("button")
    cancelBtn.textContent = "Cancel"
    cancelBtn.onclick = () => {
        resetCommandPanel()
        openRepairTowerMenu()
        infoPanel.innerHTML = ""
    }
    infoPanel.appendChild(cancelBtn)
}

export function repairAllTowers() {
    let totalCost = 0

    gameState.towers.forEach(tower => {
        if (tower.health < tower.maxHealth) {
            const missingHealth = tower.maxHealth - tower.health
            const costToRepair = Math.ceil(missingHealth * 0.5)
            totalCost += costToRepair
        }
    })

    if (gameState.minerals >= totalCost) {
        gameState.towers.forEach(tower => {
            if (tower.health < tower.maxHealth) {
                tower.health = tower.maxHealth
            }
        })
        gameState.minerals -= totalCost
    } else {
        // display message in info panel that the player doesnt have enough minerals
    }
}

export function openDeleteTowerMenu() {
    setCommandPanelMode('delete'); // sets isDeleteMode and resets others
    gameState.selectedObject = null;
    updateCommandPanel([
        { id: "btn-1", label: "Select A Tower", action: null, disabled: true },
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
        { id: "btn-12", label: "Cancel", action: cancelDeleteMode }
    ])
}

export function updateDeleteMenu() {
    const tower = gameState.selectedObject
    if (!tower) return

    const infoPanel = document.getElementById("info-panel")
    infoPanel.innerHTML = "" // Clear the panel

    const message = document.createElement("p")
    message.textContent = `Delete ${tower.name}?`
    infoPanel.appendChild(message)

    const confirmBtn = document.createElement("button")
    confirmBtn.textContent = "Confirm Delete"
    confirmBtn.onclick = () => {
        confirmDeleteTower()          // Removes the tower
        infoPanel.innerHTML = ""      // Clear panel
        resetCommandPanel()
        openDeleteTowerMenu()         // Reset menu for next delete
    };
    infoPanel.appendChild(confirmBtn)

    const cancelBtn = document.createElement("button")
    cancelBtn.textContent = "Cancel"
    cancelBtn.onclick = () => {
        gameState.selectedObject = null
        infoPanel.innerHTML = ""      // Clear confirmation
        resetCommandPanel()
        openDeleteTowerMenu()         // Stay in Delete Mode
    }
    infoPanel.appendChild(cancelBtn)
}

function confirmDeleteTower() {
    const tower = gameState.selectedObject
    if (!tower) return

    playTowerDestruction(tower, { isManual: true })
    gameState.selectedObject = null
    resetCommandPanel()
    openDeleteTowerMenu()
}

function cancelDeleteMode() {
    resetCommandPanel()
    setCommandPanelMode('default')
    initializeDefaultMenu()
    gameState.selectedObject = null
}

export function openGlobalUpgradesMenu() {
    setCommandPanelMode('default')
    updateCommandPanel([
        { id: "btn-1", label: "Armor Upgrade: Bullets & Explosives", action: upgradeArmorBullets },
        { id: "btn-2", label: "Armor Upgrade: Biological", action: upgradeArmorBiological },
        { id: "btn-3", label: "", action: null },
        { id: "btn-4", label: "", action: null },
        { id: "btn-5", label: "", action: null },
        { id: "btn-6", label: "", action: null },
        { id: "btn-7", label: "", action: null },
        { id: "btn-8", label: "", action: null },
        { id: "btn-9", label: "", action: null },
        { id: "btn-10", label: "", action: null },
        { id: "btn-11", label: "", action: null },
        { id: "btn-12", label: "Close Menu", action: initializeDefaultMenu }
    ])
}

function upgradeArmorBullets() {
    console.log("🔧 Upgrading armor vs bullets/explosives");
}

function upgradeArmorBiological() {
    console.log("🔧 Upgrading armor vs biological attacks");
}

export function coreTowerPanel(tower) {
    const buttons = []
  
    buttons.push({ id: "btn-1", label: tower.attack ? "Attack" : "", action: tower.attack ? () => enterAttackMode(tower) : null })
    buttons.push({ id: "btn-2", label: tower.attack ? "Stop Attack" : "", action: tower.attack ? () => stopAttackCommand(tower) : null })
    buttons.push({ id: "btn-3", label: tower.health < tower.maxHealth ? "Repair" : "", action: tower.health < tower.maxHealth ? () => repairTower(tower) : null })
    buttons.push({ id: "btn-4", label: tower.canMove ? "Move" : "", action: tower.canMove ? () => enterMoveMode(tower) : null })
    
    // Buttons 5–8: Reserved
    for (let i = 5; i <= 8; i++) {
        buttons.push({ id: `btn-${i}`, label: "", action: null })
    }

    buttons.push({ id: "btn-9", label: "Delete", action: () => openDeleteTowerMenu(tower) })
    
    // Buttons 10–11: Reserved
    for (let i = 10; i <= 11; i++) {
        buttons.push({ id: `btn-${i}`, label: "", action: null })
    }

    buttons.push({ id: "btn-12", label: "Deselect",
        action: () => {
            resetCommandPanel()
            initializeDefaultMenu()
            gameState.selectedObject = null
        }
    })
    updateCommandPanel(buttons)
}