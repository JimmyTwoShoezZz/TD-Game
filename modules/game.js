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
  
    const grunt = new Enemy({
        id: crypto.randomUUID(),
        name: 'Grunt',
        isAlive: true,
        x: path[0].x,
        y: path[0].y,
        health: 30,
        armor: 1,
        speed: 1,
        isAir: false,
        path
    })
    console.log("Spawning enemy:", grunt); // ✅ Check this log
    enemies.push(grunt)
}