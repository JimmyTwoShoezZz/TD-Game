import { playerData } from './playerData.js'
import { unlockTower } from './research.js'
import { gameState } from './game.js'
import { towerConfigs } from './towerConfigs.js';

export function initializeTowerResearchUI() {
  const sidebar = document.getElementById("tower-sidebar-buttons");
  sidebar.innerHTML = "";

  Object.keys(towerConfigs).forEach(towerName => {
    const button = document.createElement("button");
    button.classList.add("overlay-tab");
    button.textContent = towerName;

    button.onclick = () => showTowerResearchDetail(towerName);
    sidebar.appendChild(button);
  });
}

export function updateResearchContent(tabName) {
  const content = document.getElementById("research-content");

  // Update the research points display
  let pointsDisplay = document.getElementById("research-points-display");
  if (!pointsDisplay) {
    pointsDisplay = document.createElement("div");
    pointsDisplay.id = "research-points-display";
    pointsDisplay.classList.add("points-display");
    content.prepend(pointsDisplay);
  }
  pointsDisplay.textContent = `Tower Research Points: ${gameState.towerResearchPoints}`;

  if (tabName === "towers") {
    content.innerHTML = "<div class='overlay-placeholder'>Select a tower from the sidebar to view its details.</div>";
  } else {
    content.innerHTML = `<h2>${tabName}</h2><p>Coming soon...</p>`;
  }
}


export function showTowerResearchDetail(towerName) {
  const content = document.getElementById("research-content");
  content.innerHTML = "";

  const config = towerConfigs[towerName];
  if (!config) {
    content.innerHTML = `<p>Error: Tower data not found for "${towerName}".</p>`;
    return;
  }

  const instance = new config.class(0, 0); // dummy position for reading stats
  const stats = config.getStats();

  const title = document.createElement("h2");
  title.textContent = towerName;

  const image = document.createElement("img");
  image.src = config.image;
  image.alt = towerName;
  image.classList.add("tower-image");

  const desc = document.createElement("p");
  desc.textContent = config.description;

  const statList = document.createElement("ul");
  for (let key in stats) {
    const li = document.createElement("li");
    li.textContent = `${key}: ${stats[key]}`;
    statList.appendChild(li);
  }

  const unlockBtn = document.createElement("button");
  unlockBtn.textContent = playerData.isTowerUnlocked(towerName) ? "Unlocked" : "Unlock";
  unlockBtn.disabled = playerData.isTowerUnlocked(towerName);
  unlockBtn.onclick = () => {
    unlockTower(towerName);
    showTowerResearchDetail(towerName); // refresh state
  };

  content.appendChild(title);
  content.appendChild(image);
  content.appendChild(desc);
  content.appendChild(statList);
  content.appendChild(unlockBtn);
}