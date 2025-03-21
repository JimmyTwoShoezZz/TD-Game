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

} from "./enemies.js"

// Game logic
import {

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
    placeTower,
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





document.addEventListener("DOMContentLoaded", () => {
    console.log("Game initialized")

    // Load the default menu
    initializeDefaultMenu()
})

document.addEventListener("DOMContentLoaded", () => {
    console.log("Map rendered")

    // Render the map on screen
    renderMap()
})