export function showSettingsWindow() {
    document.getElementById("settings-window").classList.remove("hidden")
    document.getElementById("message-log-window").classList.add("pointer-blocked")
  }
  
  export function hideSettingsWindow() {
    document.getElementById("settings-window").classList.add("hidden")
    document.getElementById("message-log-window").classList.remove("pointer-blocked")
  }
  
  export function updateSettingsContent(tabName) {
    const content = document.getElementById("settings-content")
    content.innerHTML = `<h2>${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Settings</h2><p>Coming soon...</p>`
    if (tabName === "volume") {
        content.innerHTML = `
          <h2>Volume Settings</h2>
          <p>Adjust audio levels for the game.</p>
          <div style="margin-top: 20px;">
            <div style="margin-bottom: 20px;">
              <label for="global-volume">Global</label>
              <input type="range" id="global-volume" min="0" max="100" value="80" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="music-volume">Music</label>
              <input type="range" id="music-volume" min="0" max="100" value="70" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="sfx-volume">Sound Effects</label>
              <input type="range" id="sfx-volume" min="0" max="100" value="75" style="width: 100%;">
            </div>
            <div style="margin-bottom: 20px;">
              <label for="ui-volume">UI</label>
              <input type="range" id="ui-volume" min="0" max="100" value="60" style="width: 100%;">
            </div>
          </div>`
      } else {
        content.innerHTML = `<h2>${tabName.charAt(0).toUpperCase() + tabName.slice(1)} Settings</h2><p>Coming soon...</p>`
      }
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