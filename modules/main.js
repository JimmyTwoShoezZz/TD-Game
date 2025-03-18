import { renderMap } from "./maps.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Game Initialized");

    // Render the map on screen
    renderMap();
});

import { placeTower } from "./towers.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Game Initialized");

    // Test placing a tower at (5,3) — adjust coordinates as needed
    placeTower(5, 3);
});

import { initializeDefaultMenu, updateCommandPanel, openBuildTowerMenu } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Game Initialized");

    // Load the Default Menu
    initializeDefaultMenu();
});