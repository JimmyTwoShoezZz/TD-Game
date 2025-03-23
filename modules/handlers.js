import { showSettingsWindow, hideSettingsWindow, updateSettingsContent } from "./ui.js"

document.getElementById("options-btn").addEventListener("click", showSettingsWindow)
document.getElementById("close-settings").addEventListener("click", hideSettingsWindow)

import { pauseGame, resumeGame, gameState } from "./game.js"

document.getElementById("options-btn").addEventListener("click", () => {
  pauseGame()
  showSettingsWindow()
})

document.getElementById("close-settings").addEventListener("click", () => {
    hideSettingsWindow()
    resumeGame()
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

  function initializeSettingsTabListeners() {
    console.log("Running initializeSettingsTabListeners");
  
    document.querySelectorAll('.settings-tab').forEach(button => {
      if (!button.dataset.bound) {
        console.log("Adding listener to:", button.dataset.tab);
        button.addEventListener('click', () => {
          console.log("Tab clicked:", button.dataset.tab);
          updateSettingsContent(button.dataset.tab);
        });
        button.dataset.bound = "true";
      } else {
        console.log("Already bound:", button.dataset.tab);
      }
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    initializeSettingsTabListeners();
  
    // Other setup like:
    const indexButton = document.querySelector('.settings-tab[data-tab="index"]');
    const indexSubmenu = document.getElementById("index-submenu");
    const indexArrow = document.getElementById("index-arrow")
  
    if (indexButton && indexSubmenu) {
      indexButton.addEventListener("click", () => {
        console.log("Index button clicked!");
        indexSubmenu.classList.toggle("hidden");
        indexArrow.textContent = indexSubmenu.classList.contains("hidden") ? "▶" : "▼"
      });
    }

    const pauseButton = document.getElementById("pause-btn");

    if (pauseButton) {
    pauseButton.addEventListener("click", () => {
        if (gameState.paused) {
      resumeGame();
      pauseButton.textContent = "Pause"; // Switch back to pause icon
    } else {
      pauseGame();
      pauseButton.textContent = "Play"; // Play icon
    }
  });
}
  });

  document.getElementById("messagelog-btn").addEventListener("click", () => {
    const logWindow = document.getElementById("message-log-window");
    const logContent = document.getElementById("message-log-content");
  
    logWindow.classList.add("visible");
    
    // Reset scroll position to bottom
    logContent.scrollTop = logContent.scrollHeight;
  });
  
  document.getElementById("close-message-log").addEventListener("click", () => {
    document.getElementById("message-log-window").classList.remove("visible");
  });