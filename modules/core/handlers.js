import { showSettingsWindow, hideSettingsWindow, hideResearchWindow } from '../ui/ui.js'
import { updateResearchContent } from '../ui/towerResearchUI.js'
import { updateSettingsContent } from '../ui/settingsUI.js'
import { initializeDefaultMenu, updateDeleteMenu, coreTowerPanel, updateRepairMenu } from '../ui/commandpanel.js'
import { gameState, pauseGame, resumeGame } from './gameState.js'
import { tileSize, activateNodeAt, canBuildHere } from '../maps/maps.js'

// ===================== Canvas Click =====================
const canvas = document.getElementById("game-canvas")
canvas.addEventListener("click", handleCanvasClick)

export function handleCanvasClick(event) {
    const rect = canvas.getBoundingClientRect()
    const scale = canvas.width / rect.width
    const mouseX = (event.clientX - rect.left) * scale
    const mouseY = (event.clientY - rect.top) * scale

    const tileX = Math.floor(mouseX / tileSize)
    const tileY = Math.floor(mouseY / tileSize)

    const blockerId = gameState.currentStage.terrainBlockerGrid[tileY]?.[tileX] || 0
    const blocker = gameState.currentStage.blockerTypes?.[blockerId]

    // === BUILD MODE ===
    if (gameState.isBuildMode && gameState.selectedTowerType) {
        const isOccupied = gameState.towers.some(t => t.x === tileX && t.y === tileY)
        const isValidBuild = canBuildHere(tileX, tileY, gameState.selectedTowerType) && !isOccupied

        if (isValidBuild) {
            const TowerClass = gameState.selectedTowerType
            const newTower = new TowerClass(tileX, tileY)
            gameState.towers.push(newTower)
        } else if (blocker?.interactable) {
            // 👇 Activate blocker node instead of placing a tower
            activateNodeAt(tileX, tileY)
        } else {
            // display alert message
        }
        return
    }

    // === DELETE MODE, REPAIR MODE, or TOWER SELECT ===
    const clickedTower = gameState.towers.find(t => t.x === tileX && t.y === tileY)
    if (clickedTower) {
        if (gameState.isDeleteMode) {
            gameState.selectedObject = clickedTower
            updateDeleteMenu()
        } else if (gameState.isRepairMode) {
            const missingHealth = clickedTower.maxHealth - clickedTower.health
            const costToRepair = Math.ceil(missingHealth * 0.5)

            if (missingHealth > 0 && gameState.minerals >= costToRepair) {
                clickedTower.health = clickedTower.maxHealth
                gameState.minerals -= costToRepair
            } else {
                // display alert message
            }
            return
        } else {
            selectPlacedTower(clickedTower)
        }
        return
    }

    // Optional: handle terrain blocker selection for future menus
}

// ===================== UI Event Listeners =====================
document.getElementById("close-research").addEventListener("click", hideResearchWindow)

document.getElementById("options-btn").addEventListener("click", () => {
    pauseGame('menu')
    showSettingsWindow()
})

document.getElementById("close-settings").addEventListener("click", () => {
    hideSettingsWindow()
    if (gameState.pauseReason === 'menu') {
        resumeGame()
    }
    hideIndexSubmenu()
})

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        const settingsWindow = document.getElementById("settings-window")
        if (!settingsWindow.classList.contains("hidden")) {
            hideSettingsWindow()
            resumeGame()
            hideIndexSubmenu()
        }
    }
})

// ===================== Message Log =====================
document.getElementById("messagelog-btn").addEventListener("click", () => {
    const logWindow = document.getElementById("message-log-window")
    const logContent = document.getElementById("message-log-content")
    logWindow.classList.toggle("visible")
    if (logWindow.classList.contains("visible")) {
        logContent.scrollTop = logContent.scrollHeight
    }
})

document.getElementById("close-message-log").addEventListener("click", () => {
    document.getElementById("message-log-window").classList.remove("visible")
})

// ===================== DOM Ready =====================
window.addEventListener("DOMContentLoaded", () => {
    initializeOverlayTabListeners()

    const indexButton = document.querySelector('#settings-window .overlay-tab[data-tab="index"]')
    const indexSubmenu = document.getElementById("index-submenu")
    const indexArrow = document.getElementById("index-arrow")

    if (indexButton && indexSubmenu) {
        indexButton.addEventListener("click", () => {
            indexSubmenu.classList.toggle("hidden")
            indexArrow.textContent = indexSubmenu.classList.contains("hidden") ? "▶" : "▼"
        })
    }

    const pauseButton = document.getElementById("pause-btn")
    if (pauseButton) {
        pauseButton.addEventListener("click", () => {
            const settingsVisible = !document.getElementById("settings-window").classList.contains("hidden")
            if (!settingsVisible) {
                gameState.paused ? resumeGame() : pauseGame('user')
            }
        })
    }
})

// ===================== Utility Functions =====================
function initializeOverlayTabListeners() {
    bindOverlayTabs("settings-window", updateSettingsContent)
    bindOverlayTabs("research-window", updateResearchContent)
}

function bindOverlayTabs(containerId, updateFn) {
    document.querySelectorAll(`#${containerId} .overlay-tab:not(.static-tab)`).forEach(button => {
        if (!button.dataset.bound) {
            button.addEventListener("click", () => {
                const tabName = button.dataset.tab
                tabName ? updateFn(tabName) : console.warn("⚠️ No data-tab on button:", button)
            })
            button.dataset.bound = "true"
        }
    })
}

function hideIndexSubmenu() {
    const indexSubmenu = document.getElementById("index-submenu")
    const indexArrow = document.getElementById("index-arrow")
    if (indexSubmenu) indexSubmenu.classList.add("hidden")
    if (indexArrow) indexArrow.textContent = "▶"
}

// ===================== Exports =====================
export function selectTower(towerType) {
    gameState.selectedTowerType = towerType
    gameState.selectedObject = null
}

export function selectPlacedTower(tower) {
    gameState.selectedTowerType = null
    gameState.selectedObject = tower
    coreTowerPanel(tower)
    const infoPanel = document.getElementById("info-panel")
    if (infoPanel) {
        infoPanel.innerHTML = `
            <h3 style="margin: 0 0 5px;">${tower.name || "Unnamed Tower"}</h3>
            <p>This is a placeholder. Tower stats and abilities coming soon!</p>
        `
    }
}