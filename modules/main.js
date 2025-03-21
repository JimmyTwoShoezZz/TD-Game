
// Game Logic
import {
    getTowerById
} from "./game.js";

// Tower, Enemy, and Global Abilities
import {

} from "./abilities.js"

// Towers and Mechanics
import {
    placeTower,
    enterRepairMode,
    repairTower,
    repairAllTowers,
    deleteTower
} from "./towers.js";

// Enemies and Mechanics
import {

} from "./enemies.js"

// Pathfinding
import {

} from "./pathfinding.js"

// Map Handling
import {
    renderMap
} from "./maps.js";

// UI and Menus
import {
    initializeDefaultMenu,
    updateCommandPanel,
    openBuildTowerMenu,
    openRepairTowerMenu,
    openDeleteTowerMenu,
    updateDeleteMenu
} from "./ui.js";

// Tooltips
import {

} from "./tooltips.js"

// Images
import {

} from "./images.js"

// Sounds
import {

} from "./sounds.js"

// Settings
import {

} from "./config.js"





document.addEventListener("DOMContentLoaded", () => {
    console.log("Game Initialized");

    // Load the Default Menu
    initializeDefaultMenu();
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Game Initialized");

    // Render the map on screen
    renderMap();
});

document.addEventListener("DOMContentLoaded", () => {
    console.log("Game Initialized");

    // Test placing a tower at (5,3) — adjust coordinates as needed
    placeTower(5, 3);
});