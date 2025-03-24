// main.js
// Controls all aspects of the program

// IMPORTS

// Main menu
import "./menu.js"

// Tower, enemy, and global abilities
import {

} from "./abilities.js"

// Collision detection between enemies and projectiles
import {

} from "./collision.js"

import {
    setCommandPanelMode,
    initializeDefaultMenu,
    updateCommandPanel,
    setCommandButton,
    clearCommandButton,
    showBuildTowerMenu,
    openRepairTowerMenu,
    enterRepairMode,
    promptRepairAllConfirmation,
    repairAllTowers,
    openDeleteTowerMenu,
    updateDeleteMenu,
} from "./commandpanel.js"

// Game settings
import {

} from "./config.js"

// Enemies and their mechanics
import {
    Enemy
} from "./enemies.js"

// Game logic
import {
    enemies,
    spawnEnemy,
    resumeGame,
    pauseGame,
} from "./game.js"

import {
    gameState,
    PHASES,
    resetGameState,
    resetInteractionModes
} from "./gameState.js"

//Handles player actions
import {
    selectTower
} from "./handlers.js"

// Images
import {

} from "./images.js"

// Maps and generation
import {
    renderMap
} from "./maps.js"

// Game menu
import {
    
} from "./menu.js"

// Enemy pathfinding logic
import {
    
} from "./pathfinding.js"

// Projectiles
import {

} from "./projectiles.js"

// Sounds
import {

} from "./sounds.js"

// Tooltips
import {

} from "./tooltips.js"

// Towers and their mechanics
import {
    playTowerDestruction,
    removeTower
} from "./towers.js"

// UI and Menus
import {
    showAlert,
    logMessage
} from "./ui.js"

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
    for (const enemy of enemies) {
        if (enemy.alive) {
            enemy.update(currentTime, deltaTime)
            enemy.updateBurn(deltaTime, currentTime)
            enemy.updateCorrosion(deltaTime, currentTime)
        }
    }
  
    // === RENDER ===
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    renderMap()

    for (const enemy of enemies) {
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

    // Loop again
    requestAnimationFrame(gameLoop)
}

export function startNextWave() {
    if (gameState.phase !== PHASES.PLANNING) return;

    let countdown = 5;
    showAlert(`Wave begins in ${countdown}...`, "warning", "large");

    const countdownInterval = setInterval(() => {
        countdown--;

        if (countdown > 0) {
            showAlert(`Wave begins in ${countdown}...`, "warning", "large");
        } else {
            clearInterval(countdownInterval);
            showAlert(`Wave ${gameState.currentWave + 1} has started!`, "danger", "large", 3000);

            gameState.phase = PHASES.WAVE;
            gameState.currentWave += 1;
            gameState.wavesRemaining -= 1;

            spawnEnemy();
            initializeDefaultMenu();
        }
    }, 1000);
}