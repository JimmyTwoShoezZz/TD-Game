// main.js
// Controls all aspects of the program

// IMPORTS
// Tower, enemy, and global abilities
import {

} from "./abilities.js"

// Collision detection between enemies and projectiles
import {

} from "./collision.js"

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
    gameState,
    resumeGame,
    pauseGame
} from "./game.js"

//Handles player actions
import {

} from "./handlers.js"

// Images
import {

} from "./images.js"

// Maps and generation
import {
    renderMap
} from "./maps.js"

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
    enterRepairMode,
    repairTower,
    repairAllTowers,
    deleteTower
} from "./towers.js"

// UI and Menus
import {
    initializeDefaultMenu,
    updateCommandPanel,
    openBuildTowerMenu,
    openRepairTowerMenu,
    openDeleteTowerMenu,
    updateDeleteMenu
} from "./ui.js"

const canvas = document.getElementById("game-canvas")
const ctx = canvas.getContext("2d")

document.addEventListener("DOMContentLoaded", () => {
    initializeDefaultMenu()
    renderMap()
    spawnEnemy()
    requestAnimationFrame(gameLoop)
})

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
    console.log("Enemies array:", enemies)
    for (const enemy of enemies) {
        console.log(`Looping enemy: ${enemy.name}, alive: ${enemy.alive}`)
        if (enemy.alive) {
            enemy.update(currentTime, deltaTime)
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