import { gameState, resetInteractionModes } from './gameState.js'
import { playerData } from './playerData.js'
import { playTowerDestruction } from './towers.js'
import { selectTower } from './handlers.js'
import { startNextWave } from './main.js'

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

export function openBuildTowerMenu(page = 1) {
    const towerPages = {
        1: [
            { id: "btn-1", label: "Machine Gun Tower", action: () => selectTower("Machine Gun"), disabled: !playerData.isTowerUnlocked("Machine Gun") },
            { id: "btn-2", label: "Shotgun Tower", action: () => selectTower("Shotgun"), disabled: !playerData.isTowerUnlocked("Shotgun") },
            { id: "btn-3", label: "Artillery Tower", action: () => selectTower("Artillery"), disabled: !playerData.isTowerUnlocked("Artillery") },
            { id: "btn-4", label: "Rail Gun Tower", action: () => selectTower("Rail Gun"), disabled: !playerData.isTowerUnlocked("Rail Gun") },
            { id: "btn-5", label: "EMP Tower", action: () => selectTower("EMP"), disabled: !playerData.isTowerUnlocked("EMP") },
            { id: "btn-6", label: "Shield Tower", action: () => selectTower("Shield"), disabled: !playerData.isTowerUnlocked("Shield") },
            { id: "btn-7", label: "Proximity Mine Tower", action: () => selectTower("Proximity Mine"), disabled: !playerData.isTowerUnlocked("Proximity Mine") },
            { id: "btn-8", label: "", action: null },
            { id: "btn-9", label: "", action: null }
        ],
        2: [
            { id: "btn-1", label: "", action: null },
            { id: "btn-2", label: "", action: null },
            { id: "btn-3", label: "", action: null },
            { id: "btn-4", label: "", action: null },
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
        initializeDefaultMenu()
        infoPanel.innerHTML = ""
    }
    infoPanel.appendChild(confirmBtn)

    const cancelBtn = document.createElement("button")
    cancelBtn.textContent = "Cancel"
    cancelBtn.onclick = () => {
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
        openDeleteTowerMenu()         // Reset menu for next delete
    };
    infoPanel.appendChild(confirmBtn)

    const cancelBtn = document.createElement("button")
    cancelBtn.textContent = "Cancel"
    cancelBtn.onclick = () => {
        gameState.selectedObject = null
        infoPanel.innerHTML = ""      // Clear confirmation
        openDeleteTowerMenu()         // Stay in Delete Mode
    }
    infoPanel.appendChild(cancelBtn)
}

function confirmDeleteTower() {
    const tower = gameState.selectedObject
    if (!tower) return

    playTowerDestruction(tower, { isManual: true })
    gameState.selectedObject = null

    openDeleteTowerMenu() // Stay in delete mode
}

function cancelDeleteMode() {
    setCommandPanelMode('default')
    gameState.selectedObject = null
    initializeDefaultMenu()
}





function openGlobalUpgradesMenu() {}
function openTowerResearchMenu() {}