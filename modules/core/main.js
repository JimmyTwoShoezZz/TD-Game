// main.js
// Controls all aspects of the program

// IMPORTS

// CORE
import { } from './config.js'
import { gameState, PHASES, resetGameState, resetInteractionModes, pauseGame, resumeGame } from './gameState.js'
import { selectTower } from './handlers.js'
import { } from './playerData.js'

// DATA
import { } from '../data/abilities.js'
import { } from '../data/buffs.js'
import { } from '../data/research.js'

// ENEMIES
import { Enemy } from '../enemies/enemyBase.js'

// LOADERS
import { } from '../loaders/images.js'
import { } from '../loaders/sounds.js'

// MAPS
import { renderMap } from '../maps/maps.js'

// SYSTEMS
import { } from '../systems/collision.js'
import { } from '../systems/pathfinding.js'
import { } from '../systems/projectiles.js'
import { } from '../systems/statusEffects.js'

// TOWERS
import { } from '../towers/towerBase.js'
import { playTowerDestruction, removeTower } from '../towers/towerManager.js'
import { } from '../towers/uniqueTowers.js'

// UI
import { setCommandPanelMode, initializeDefaultMenu, updateCommandPanel, setCommandButton, clearCommandButton, showBuildTowerMenu, openRepairTowerMenu, enterRepairMode,
         promptRepairAllConfirmation, repairAllTowers, openDeleteTowerMenu, updateDeleteMenu
         } from '../ui/commandpanel.js'
import '../ui/menu.js' // MAIN MENU
import { } from '../ui/settingsUI.js'
import { } from '../ui/tooltips.js'
import { } from '../ui/towerConfigs.js'
import { } from '../ui/towerResearchUI.js'
import { showAlert, logMessage } from '../ui/ui.js'

const canvas = document.getElementById("game-canvas")
const ctx = canvas.getContext("2d")

document.addEventListener("DOMContentLoaded", () => {
    initializeGame()
})

export function startGame() {
    resetGameState()
    resetInteractionModes()
    initializeDefaultMenu()
}

export function initializeGame() {
    renderMap()
    requestAnimationFrame(gameLoop)
}

let lastTime = performance.now()

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000
    lastTime = currentTime

    // === PAUSE CHECK ===
    if (gameState.paused) {
        requestAnimationFrame(gameLoop)
        return
    }

    // === UPDATE ===
    for (const enemy of gameState.enemies) {
        if (enemy.alive) {
            enemy.updateBurn(deltaTime, currentTime)
            enemy.updateCorrosion(deltaTime, currentTime)
            enemy.aquireTarget(gameState)
            if (enemy.target && enemy.distanceTo(enemy.target) <= enemy.range) {
                enemy.attack(currentTime)
            } else {
                enemy.move(currentTime, deltaTime)
            }
        }
    }

    // === RENDER ===
    ctx.clearRect(0, 0, canvas.width, canvas.height)       // Clear the canvas
    renderMap()                                            // Render the map
    gameState.towers.forEach(tower => { tower.draw(ctx) }) // Draw each tower
    for (const enemy of gameState.enemies) {               // Draw each enemy
        if (!enemy.alive) continue
        ctx.beginPath()
        ctx.arc(
            enemy.x * 50 + 25,
            enemy.y * 50 + 25,
            15,
            0,
            2 * Math.PI
        )
        ctx.fillStyle = enemy.isAir ? '#00BFFF' : '#FF0000'
        ctx.fill()
        ctx.strokeStyle = '#000'
        ctx.stroke()
    }

    requestAnimationFrame(gameLoop)
}

export function startNextWave() {
    if (gameState.phase !== PHASES.PLANNING) return

    let countdown = 5
    showAlert(`Wave begins in ${countdown}...`, "warning", "large")

    const countdownInterval = setInterval(() => {
        countdown--

        if (countdown > 0) {
            showAlert(`Wave begins in ${countdown}...`, "warning", "large")
        } else {
            clearInterval(countdownInterval)
            showAlert(`Wave ${gameState.currentWave + 1} has started!`, "danger", "large", 3000)

            gameState.phase = PHASES.WAVE
            gameState.currentWave += 1
            gameState.wavesRemaining -= 1
            initializeDefaultMenu()
        }
    }, 1000)
}