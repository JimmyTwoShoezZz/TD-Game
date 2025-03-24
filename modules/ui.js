import { playerData } from './playerData.js'
import { unlockTower } from './research.js'
import { pauseGame, resumeGame } from './game.js'
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


  export function logMessage(text) {
    // 1. Permanently add to the Message Log Panel
    const logContent = document.getElementById("message-log-content");
    const logEntry = document.createElement("p");
    logEntry.textContent = text;
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
  
    // 2. Always show temporary on-screen popup
    const popupsContainer = document.getElementById("message-popups-container");
  
    const popup = document.createElement("div");
    popup.classList.add("message-popup");
    popup.textContent = text;
    popupsContainer.appendChild(popup);
  
    // Fade out and remove popup after 4 seconds
    setTimeout(() => {
      popup.style.opacity = "0";
      setTimeout(() => popup.remove(), 500);
    }, 4000);
  }

  import { gameState } from './game.js'

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