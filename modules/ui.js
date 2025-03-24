import { playerData } from './playerData.js'
import { unlockTower } from './research.js'
import { pauseGame, resumeGame } from './game.js'

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

  export function showResearchWindow() {
    showOverlayWindow("research-window", "overlay");
  }
  
  export function hideResearchWindow() {
    hideOverlayWindow("research-window", "overlay");
  }

  export function updateResearchContent(tabName) {
    const content = document.getElementById("research-content");

    // ✅ First, make sure research-points-display exists
    let pointsDisplay = document.getElementById("research-points-display");
    if (!pointsDisplay) {
        pointsDisplay = document.createElement("div");
        pointsDisplay.id = "research-points-display";
        pointsDisplay.classList.add("points-display");
        content.prepend(pointsDisplay);
    }

    // ✅ Now that we're sure it exists, safely update it
    pointsDisplay.textContent = `Tower Research Points: ${gameState.towerResearchPoints}`;

    if (tabName === "towers") {
      content.innerHTML = "<h2>Tower Unlocks</h2>";
  
      const towers = [
          {
              name: "Artillery",
              description: "Long-range splash damage tower. Slow fire rate.",
              stats: { damage: "High", range: "Very Long", speed: "Slow" },
              image: "images/artillery.png"
          },
          {
              name: "Rail Gun",
              description: "High damage to large enemies. Ignores armor.",
              stats: { damage: "Massive", range: "Long", speed: "Very Slow" },
              image: "images/railgun.png"
          },
          {
              name: "EMP",
              description: "Disables enemy abilities temporarily.",
              stats: { damage: "None", range: "Medium", speed: "Moderate" },
              image: "images/emp.png"
          },
          {
              name: "Shield",
              description: "Generates a protective shield over nearby towers.",
              stats: { health: "Moderate", radius: "Large", duration: "Until destroyed" },
              image: "images/shield.png"
          },
          {
              name: "Proximity Mine",
              description: "Deploys air mines to damage or disable flying enemies.",
              stats: { damage: "Moderate", range: "Auto-deploy", speed: "Passive" },
              image: "images/proximity.png"
          },
      ];
  
      towers.forEach(tower => {
          const towerCard = document.createElement("div");
          towerCard.classList.add("tower-card");
  
          // Image
          const image = document.createElement("img");
          image.src = tower.image;
          image.alt = tower.name;
          image.classList.add("tower-image");
  
          // Info container (name, desc, stats, unlock)
          const infoContainer = document.createElement("div");
          infoContainer.classList.add("tower-info");
  
          // Name
          const title = document.createElement("h3");
          title.classList.add("tower-name");
          title.textContent = tower.name;
  
          // Description
          const desc = document.createElement("p");
          desc.classList.add("tower-description");
          desc.textContent = tower.description;
  
          // Stats
          const statsList = document.createElement("ul");
          statsList.classList.add("tower-stats");
          for (let stat in tower.stats) {
              const li = document.createElement("li");
              li.textContent = `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${tower.stats[stat]}`;
              statsList.appendChild(li);
          }
  
          // Unlock button
          const button = document.createElement("button");
          button.classList.add("unlock-button");
          const unlocked = playerData.isTowerUnlocked(tower.name);
          button.textContent = unlocked ? "Unlocked" : "Unlock";
          button.disabled = unlocked;
  
          button.onclick = () => {
              unlockTower(tower.name);
              updateResearchContent("towers");
          };
  
          // Assemble info
          infoContainer.appendChild(title);
          infoContainer.appendChild(desc);
          infoContainer.appendChild(statsList);
          infoContainer.appendChild(button);
  
          // Assemble card
          towerCard.appendChild(image);
          towerCard.appendChild(infoContainer);
  
          content.appendChild(towerCard);
      });
    } else {
        content.innerHTML = `<h2>${tabName}</h2><p>Coming soon...</p>`;
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