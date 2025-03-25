import {
    Enemy
} from "./enemies.js"

import {
    Tower
} from "./towers.js"

import {
    generateEnemyPath
} from "./maps.js"

export const gameState = {
    paused: false,
    pauseReason: null,
    // ... other game state like wave number, resources, etc.
}
  
import { updateUIBlockerState, updatePauseButtonIcon } from './ui.js';

export function pauseGame(reason = 'user') {
  if (!gameState.paused) {
    gameState.paused = true;
    gameState.pauseReason = reason;
    updateUIBlockerState();
    updatePauseButtonIcon();
  }
}

export function resumeGame(force = false) {
  if (gameState.paused) {
    // If the player is clicking ▶️, that's always a force resume
    gameState.paused = false;
    gameState.pauseReason = null;
    updateUIBlockerState();
    updatePauseButtonIcon();
  }
}

export const enemies = []
export const towers = []

export function spawnEnemy() {
    const path = generateEnemyPath()
  
    const enemy = new Enemy({
      id: crypto.randomUUID(),       // or however you're assigning IDs
      name: "Infantry",              // enemy name
      moveType: "ground",            // "ground" or "air"
      bioType: "biological",         // "biological" or "mechanical"
      species: "human",              // "human" or "alien"
      size: "small",                 // "small", "medium", "large"
      path: path,               // array of {x, y} waypoints
      damage: 5,
      range: 1.5,
      attackSpeed: 1.2,
      health: 50,
      armor: 0,
      speed: 2.5
    })
    enemies.push(enemy)
}