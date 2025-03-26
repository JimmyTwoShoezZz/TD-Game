import { showSettingsWindow, hideSettingsWindow, hideResearchWindow } from "./ui.js"
import { updateResearchContent } from "./towerResearchUI.js"
import { updateSettingsContent } from "./settingsUI.js"
import { initializeDefaultMenu } from './commandpanel.js'
import { gameState, pauseGame, resumeGame } from "./gameState.js"
import { tileSize } from './maps.js'

// Canvas click listener
const canvas = document.getElementById("game-canvas")
canvas.addEventListener("click", handleCanvasClick)

export function handleCanvasClick(event) {
    const canvas = event.target
    const rect = canvas.getBoundingClientRect()
    const scale = canvas.width / rect.width
    const mouseX = (event.clientX - rect.left) * scale
    const mouseY = (event.clientY - rect.top) * scale

    const tileX = Math.floor(mouseX / tileSize)
    const tileY = Math.floor(mouseY / tileSize)

    // Try to select a tower at that location
    const clickedTower = gameState.towers.find(t => t.x === tileX && t.y === tileY)

    if (clickedTower) {
        selectPlacedTower(clickedTower)
        return
    }

   // If clicked nothing relevant, return to default UI
    gameState.selectedObject = null
    initializeDefaultMenu()
}




document.getElementById("close-research").addEventListener("click", () => {
  hideResearchWindow()
})

document.getElementById("options-btn").addEventListener("click", () => {
  pauseGame('menu');
  showSettingsWindow();
});

document.getElementById("close-settings").addEventListener("click", () => {
    hideSettingsWindow()
    if (gameState.pauseReason === 'menu') {
      resumeGame();
    }
    // Hide the index submenu
  const indexSubmenu = document.getElementById("index-submenu")
  if (indexSubmenu) {
    indexSubmenu.classList.add("hidden")
  }
  const indexArrow = document.getElementById("index-arrow");
    if (indexArrow) {
    indexArrow.textContent = "▶";
     }
})

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const settingsWindow = document.getElementById("settings-window")
      if (!settingsWindow.classList.contains("hidden")) {
        hideSettingsWindow()
        resumeGame()
        const indexSubmenu = document.getElementById("index-submenu")
        if (indexSubmenu) {
        indexSubmenu.classList.add("hidden")
        }
        const indexArrow = document.getElementById("index-arrow");
        if (indexArrow) {
        indexArrow.textContent = "▶";
        }
      }
    }
  })

  function initializeOverlayTabListeners() {
      bindOverlayTabs("settings-window", updateSettingsContent);
      bindOverlayTabs("research-window", updateResearchContent);
  }

  function bindOverlayTabs(containerId, updateFn) {
    document.querySelectorAll(`#${containerId} .overlay-tab:not(.static-tab)`).forEach(button => {
      if (!button.dataset.bound) {
        button.addEventListener('click', () => {
          const tabName = button.dataset.tab;
          if (tabName) {
            updateFn(tabName);
          } else {
            console.warn("⚠️ No data-tab on button:", button);
          }
        });
        button.dataset.bound = "true";
      }
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    initializeOverlayTabListeners();

    // Index Submenu Toggle
    const indexButton = document.querySelector('#settings-window .overlay-tab[data-tab="index"]');
    const indexSubmenu = document.getElementById("index-submenu");
    const indexArrow = document.getElementById("index-arrow");

    if (indexButton && indexSubmenu) {
        indexButton.addEventListener("click", () => {
            indexSubmenu.classList.toggle("hidden");
            indexArrow.textContent = indexSubmenu.classList.contains("hidden") ? "▶" : "▼";
        });
    }

    // Pause Button Logic
    const pauseButton = document.getElementById("pause-btn");

    if (pauseButton) {
        pauseButton.addEventListener("click", () => {
            const settingsVisible = !document.getElementById("settings-window").classList.contains("hidden");

            if (settingsVisible) {
                return; // Don't toggle game pause if settings window is open
            }

            if (gameState.paused) {
                resumeGame(); // resumes and updates icon
            } else {
                pauseGame('user'); // pauses and updates icon
            }
        });
    }
});


  document.getElementById("messagelog-btn").addEventListener("click", () => {
    const logWindow = document.getElementById("message-log-window");
    const logContent = document.getElementById("message-log-content");
  
    const isVisible = logWindow.classList.contains("visible");
  
    if (isVisible) {
      logWindow.classList.remove("visible");
    } else {
      logWindow.classList.add("visible");
      logContent.scrollTop = logContent.scrollHeight; // scroll to bottom on open
    }
  });
  
  document.getElementById("close-message-log").addEventListener("click", () => {
    document.getElementById("message-log-window").classList.remove("visible");
  });



export function selectTower(towerType) {
    gameState.selectedTowerType = towerType
    gameState.selectedObject = null
}

import { coreTowerPanel } from './commandpanel.js'
export function selectPlacedTower(tower) {
    gameState.selectedTowerType = null
    gameState.selectedObject = tower
    coreTowerPanel(tower)
}