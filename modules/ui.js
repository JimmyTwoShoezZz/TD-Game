// Function to initialize the Default Menu
export function initializeDefaultMenu() {
    console.log("✅ Default Menu Loaded");

    updateCommandPanel([
        { id: "btn-1", label: "Build Tower", action: openBuildTowerMenu }, // Ensure it's properly assigned!
        { id: "btn-2", label: "Repair Tower", action: openRepairTowerMenu },
        { id: "btn-3", label: "Delete Tower", action: openDeleteTowerMenu },
        { id: "btn-4", label: "Global Upgrades", action: openGlobalUpgradesMenu },
        { id: "btn-5", label: "Tower Research", action: openTowerResearchMenu },
        { id: "btn-10", label: "Next Wave", action: startNextWave },
        { id: "btn-12", label: "Settings", action: openSettingsMenu }
    ]);

    // Assign buttons dynamically
    buttonConfig.forEach(config => {
        const button = document.getElementById(config.id);
        if (button) {
            button.textContent = config.label;
            if (config.action) {
                button.onclick = config.action;
            } else {
                button.classList.add("empty-button"); // Style empty buttons
            }
        }
    });
}

// Function to update the command panel dynamically
export function updateCommandPanel(options) {
    const panel = document.querySelector(".command-grid");
    if (!panel) {
        console.error("Command panel not found!");
        return;
    }
    
    panel.innerHTML = ""; // Clear the command panel

    options.forEach(option => {
        const button = document.createElement("button");
        button.classList.add("command-button");
        button.id = option.id;
        button.textContent = option.label;
        
        if (option.action) {
            button.addEventListener("click", option.action);
        } else {
            button.classList.add("empty-button"); // Styling for empty slots
        }

        panel.appendChild(button);
    });
}

export function openBuildTowerMenu(page = 1) {
    console.log(`Opening Build Tower Menu - Page ${page}...`);

    // Define available towers (we'll expand this for multiple pages)
    const towerPages = {
        1: [
            { id: "btn-1", label: "Machine Gun Tower", action: () => selectTower("Machine Gun") },
            { id: "btn-2", label: "Shotgun Tower", action: () => selectTower("Shotgun") },
            { id: "btn-3", label: "Artillery Tower", action: () => selectTower("Artillery") },
            { id: "btn-4", label: "Rail Gun Tower", action: () => selectTower("Rail Gun") },
            { id: "btn-5", label: "EMP Tower", action: () => selectTower("EMP") },
            { id: "btn-6", label: "Shield Tower", action: () => selectTower("Shield") },
            { id: "btn-7", label: "Proximity Mine Tower", action: () => selectTower("Proximity Mine") },
            { id: "btn-8", label: "", action: null }, // Empty slot (reserved for future towers)
            { id: "btn-9", label: "", action: null }, // Empty slot
        ],
        2: [
            { id: "btn-1", label: "Advanced Tower 1", action: () => selectTower("Advanced Tower 1") },
            { id: "btn-2", label: "Advanced Tower 2", action: () => selectTower("Advanced Tower 2") },
            { id: "btn-3", label: "Advanced Tower 3", action: () => selectTower("Advanced Tower 3") },
            { id: "btn-4", label: "Advanced Tower 4", action: () => selectTower("Advanced Tower 4") },
            { id: "btn-5", label: "", action: null }, // Empty slot
            { id: "btn-6", label: "", action: null }, // Empty slot
            { id: "btn-7", label: "", action: null }, // Empty slot
            { id: "btn-8", label: "", action: null }, // Empty slot
            { id: "btn-9", label: "", action: null }, // Empty slot
        ]
    };

    // Determine if pagination is needed
    const hasPreviousPage = page > 1;
    const hasNextPage = page < Object.keys(towerPages).length;

    updateCommandPanel([
        ...towerPages[page], // Load towers for this page
        { id: "btn-10", label: hasPreviousPage ? "←" : "", action: hasPreviousPage ? () => openBuildTowerMenu(page - 1) : null },
        { id: "btn-11", label: hasNextPage ? "→" : "", action: hasNextPage ? () => openBuildTowerMenu(page + 1) : null },
        { id: "btn-12", label: "Cancel", action: initializeDefaultMenu } // Always present
    ]);
}

// Placeholder functions for menu actions
function openRepairTowerMenu() { console.log("Opening Repair Tower Menu"); }
function openDeleteTowerMenu() { console.log("Opening Delete Tower Menu"); }
function openGlobalUpgradesMenu() { console.log("Opening Global Upgrades Menu"); }
function openTowerResearchMenu() { console.log("Opening Tower Research Menu"); }
function startNextWave() { console.log("Starting Next Wave"); }
function openSettingsMenu() { console.log("Opening Settings Menu"); }