// Function to initialize the Default Menu
export function initializeDefaultMenu() {
    const buttonLayout = [
        { id: "build-tower", label: "Build Tower", action: openBuildTowerMenu },
        { id: "repair-tower", label: "Repair Tower", action: openRepairTowerMenu },
        { id: "delete-tower", label: "Delete Tower", action: openDeleteTowerMenu },
        { id: "global-upgrades", label: "Global Upgrades", action: openGlobalUpgradesMenu },
        { id: "tower-research", label: "Tower Research", action: openTowerResearchMenu },
        { id: "", label: "", action: null }, // Empty slot
        { id: "", label: "", action: null }, // Empty slot
        { id: "", label: "", action: null }, // Empty slot
        { id: "", label: "", action: null }, // Empty slot
        { id: "next-wave", label: "Next Wave", action: startNextWave },
        { id: "", label: "", action: null }, // Empty slot
        { id: "settings", label: "Settings", action: openSettingsMenu }
    ];

    updateCommandPanel(buttonLayout);
}

function updateCommandPanel(options) {
    const panel = document.getElementById("command-panel");
    panel.innerHTML = ""; // Clear panel

    options.forEach(option => {
        const button = document.createElement("button");
        button.id = option.id;
        button.textContent = option.label;
        if (option.action) {
            button.addEventListener("click", option.action);
        } else {
            button.classList.add("empty-button"); // Mark empty buttons for styling
        }
        panel.appendChild(button);
    });
}

// Placeholder functions for menu actions
function openBuildTowerMenu() { console.log("Opening Build Tower Menu"); }
function openRepairTowerMenu() { console.log("Repairing Tower"); }
function openDeleteTowerMenu() { console.log("Opening Delete Tower Menu"); }
function openGlobalUpgradesMenu() { console.log("Opening Global Upgrades Menu"); }
function openTowerResearchMenu() { console.log("Opening Tower Research Menu"); }
function startNextWave() { console.log("Starting Next Wave"); }
function openSettingsMenu() { console.log("Opening Settings Menu"); }