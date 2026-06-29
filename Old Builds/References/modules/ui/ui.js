import { playerData } from '../core/playerData.js'
import { unlockTower } from '../data/research.js'
import { pauseGame, resumeGame, gameState } from '../core/gameState.js'
import { initializeTowerResearchUI, updateResearchContent } from './towerResearchUI.js'
import { updateSettingsContent } from './settingsUI.js'


export function showOverlayWindow(id, pauseReason = 'overlay') {
  const window = document.getElementById(id);
  if (window) {
    window.classList.remove("hidden");
    pauseGame(pauseReason);
    updateUIBlockerState()
  }
}

export function hideOverlayWindow(id) {
  const window = document.getElementById(id);
  if (window) {
    window.classList.add("hidden");
    resumeGame();
    updateUIBlockerState()
  }
}

export function showSettingsWindow() {
  showOverlayWindow("settings-window", "overlay");
  }
  
  export function hideSettingsWindow() {
    hideOverlayWindow("settings-window", "overlay");
  }

  export function showResearchWindow() {
    showOverlayWindow("research-window", "overlay");
    initializeTowerResearchUI(); // build the sidebar
    updateResearchContent("towers"); // optional placeholder message
  }
  
  export function hideResearchWindow() {
    hideOverlayWindow("research-window", "overlay");
  }

  export function updateUIBlockerState() {
    const overlay = document.getElementById("ui-blocker-overlay");
  
    if (gameState.paused) {
      overlay.classList.remove("hidden");
    } else {
      overlay.classList.add("hidden");
    }
  }

  export function updatePauseButtonIcon() {
    const pauseBtn = document.getElementById("pause-btn");
  
    if (!pauseBtn) return;
  
    if (gameState.paused) {
      pauseBtn.textContent = "Play";
    } else {
      pauseBtn.textContent = "Pause";
    }
  }
  
  let alertTimeout = null;

export function showAlert(message, type = 'info', size = 'medium', duration = 3000) {
    const alertEl = document.getElementById("alert");

    // Clear any existing timeout
    if (alertTimeout) {
        clearTimeout(alertTimeout);
        alertTimeout = null;
    }

    // Reset classes
    alertEl.className = '';
    alertEl.classList.add('alert-' + type);
    alertEl.classList.add('alert-' + size);

    // Set text & reset opacity
    alertEl.textContent = message;
    alertEl.style.opacity = '1';

    if (duration > 0) {
        alertTimeout = setTimeout(() => {
            alertEl.style.opacity = '0';
        }, duration);
    }
}