import { deleteTower } from "./towers.js"; // ✅ Needed for confirming tower deletion
import { getTowerById } from "./game.js"; // ✅ Needed for selecting towers

export function initializeDefaultMenu() {
    updateCommandPanel([
        { id: "btn-1", label: "Build Tower", action: () => openBuildTowerMenu(1) },
        { id: "btn-2", label: "Repair Tower", action: () => openRepairTowerMenu(1) },
        { id: "btn-3", label: "Delete Tower", action: openDeleteTowerMenu },
        { id: "btn-4", label: "Global Upgrades", action: openGlobalUpgradesMenu },
        { id: "btn-5", label: "Tower Research", action: openTowerResearchMenu },
        { id: "btn-6", label: "", action: null },
        { id: "btn-7", label: "", action: null },
        { id: "btn-8", label: "", action: null },
        { id: "btn-9", label: "", action: null },
        { id: "btn-10", label: "Next Wave", action: startNextWave },
        { id: "btn-11", label: "", action: null },
        { id: "btn-12", label: "Settings", action: openSettingsMenu }
    ]);
}

export function updateCommandPanel(options) {
    const panel = document.querySelector(".command-grid");
    panel.innerHTML = "";

    options.forEach(option => {
        const button = document.createElement("button");
        button.classList.add("command-button");
        button.id = option.id;
        button.textContent = option.label;
        if (option.action) {
            button.addEventListener("click", option.action);
        } else {
            button.classList.add("empty-button");
        }
        panel.appendChild(button);
    });
}

export function openBuildTowerMenu(page = 1) {
    const towerPages = {
        1: [
            { id: "btn-1", label: "Machine Gun Tower", action: () => selectTower("Machine Gun") },
            { id: "btn-2", label: "Shotgun Tower", action: () => selectTower("Shotgun") },
            { id: "btn-3", label: "Artillery Tower", action: () => selectTower("Artillery") },
            { id: "btn-4", label: "Rail Gun Tower", action: () => selectTower("Rail Gun") },
            { id: "btn-5", label: "EMP Tower", action: () => selectTower("EMP") },
            { id: "btn-6", label: "Shield Tower", action: () => selectTower("Shield") },
            { id: "btn-7", label: "Proximity Mine Tower", action: () => selectTower("Proximity Mine") },
            { id: "btn-8", label: "", action: null },
            { id: "btn-9", label: "", action: null }
        ],
        2: [
            { id: "btn-1", label: "Advanced Tower 1", action: () => selectTower("Advanced Tower 1") },
            { id: "btn-2", label: "Advanced Tower 2", action: () => selectTower("Advanced Tower 2") },
            { id: "btn-3", label: "Advanced Tower 3", action: () => selectTower("Advanced Tower 3") },
            { id: "btn-4", label: "Advanced Tower 4", action: () => selectTower("Advanced Tower 4") },
            { id: "btn-5", label: "", action: null },
            { id: "btn-6", label: "", action: null },
            { id: "btn-7", label: "", action: null },
            { id: "btn-8", label: "", action: null },
            { id: "btn-9", label: "", action: null }
        ]
    };

    const hasPreviousPage = page > 1;
    const hasNextPage = page < Object.keys(towerPages).length;
    updateCommandPanel([
        ...towerPages[page],
        { id: "btn-10", label: hasPreviousPage ? "←" : "", action: hasPreviousPage ? () => openBuildTowerMenu(page - 1) : null },
        { id: "btn-11", label: hasNextPage ? "→" : "", action: hasNextPage ? () => openBuildTowerMenu(page + 1) : null },
        { id: "btn-12", label: "Cancel", action: initializeDefaultMenu }
    ]);
}

export function openRepairTowerMenu(page = 1) {
    const repairPages = {
        1: [
            { id: "btn-1", label: "Repair Tower", action: enterRepairMode },
            { id: "btn-2", label: "Repair All Towers", action: repairAllTowers },
            { id: "btn-3", label: "", action: null },
            { id: "btn-4", label: "", action: null },
            { id: "btn-5", label: "", action: null },
            { id: "btn-6", label: "", action: null },
            { id: "btn-7", label: "", action: null },
            { id: "btn-8", label: "", action: null },
            { id: "btn-9", label: "", action: null },
        ]
    };

    const hasPreviousPage = page > 1;
    const hasNextPage = page < Object.keys(repairPages).length;
    updateCommandPanel([
        ...repairPages[page],
        { id: "btn-10", label: hasPreviousPage ? "←" : "", action: hasPreviousPage ? () => openRepairTowerMenu(page - 1) : null },
        { id: "btn-11", label: hasNextPage ? "→" : "", action: hasNextPage ? () => openRepairTowerMenu(page + 1) : null },
        { id: "btn-12", label: "Cancel", action: initializeDefaultMenu }
    ]);
}

export function openDeleteTowerMenu() {
    console.log("🗑️ Entering Delete Mode - Select a tower to delete.");

    isDeleteMode = true;
    selectedTower = null; // Reset selection

    updateCommandPanel([
        { id: "btn-1", label: "Confirm Deletion", action: confirmDeleteTower, disabled: true }, // Starts disabled
        { id: "btn-12", label: "Cancel", action: cancelDeleteMode } // Always cancels delete mode
    ]);
}

export function updateDeleteMenu() {
    updateCommandPanel([
        { id: "btn-1", label: `Confirm Delete: ${selectedTower.name}`, action: confirmDeleteTower }, // ✅ Enable confirm
        { id: "btn-12", label: "Cancel", action: cancelDeleteMode }
    ]);
}

function cancelDeleteMode() {
    console.log("❌ Canceling Delete Mode.");
    isDeleteMode = false;
    selectedTower = null;

    initializeDefaultMenu(); // ✅ Return to default command menu
}

function confirmDeleteTower() {
    if (!selectedTower) return;

    console.log(`❌ Deleting Tower: ${selectedTower.name}`);
    deleteTower(selectedTower); // ✅ Removes the tower
    selectedTower = null; // Reset selection
    isDeleteMode = true; // Stay in Delete Mode for additional deletions

    openDeleteTowerMenu(); // ✅ Reset the menu for the next selection
}

function openGlobalUpgradesMenu() { console.log("Opening Global Upgrades Menu"); }
function openTowerResearchMenu() { console.log("Opening Tower Research Menu"); }
function startNextWave() { console.log("Starting Next Wave"); }
function openSettingsMenu() { console.log("Opening Settings Menu"); }