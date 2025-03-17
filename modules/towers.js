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