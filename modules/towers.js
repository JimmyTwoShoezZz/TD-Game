import { isTileBuildable } from "./maps.js";

// Function to place a tower at a specific location
export function placeTower(row, col) {
    if (!isTileBuildable(row, col)) {
        console.log(`❌ Cannot place tower at (${row}, ${col}) - Not a valid location.`);
        return false;
    }

    console.log(`✅ Tower placed at (${row}, ${col})`);
    return true;
}

export function enterRepairMode() {
    isRepairMode = true
    console.log("🔧 Entering Repair Mode - Click a tower to repair.");
    // Future: Set a flag that allows the player to select a tower for repair
}

export function repairAllTowers() {
    console.log("🔧 Repairing all towers...");
    // Future: Loop through all towers and repair them
}

export function deleteTower(tower) {
    console.log(`🔥 Tower ${tower.name} has been removed!`);
    tower.remove(); // Remove from the DOM or game state
}