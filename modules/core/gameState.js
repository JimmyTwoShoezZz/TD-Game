import { updateUIBlockerState, updatePauseButtonIcon } from './ui.js'

export const PHASES = {
    PLANNING: 'planning',
    WAVE: 'wave',
    BOSS: 'boss',
    PAUSED: 'paused',
}
  
export const gameState = {
    // Game Phase Tracking
    phase: PHASES.PLANNING,
    currentWave: 0,
    totalWaves: 0,
    wavesRemaining: 0,
    isGamePaused: false,
    isGameOver: false,
    isVictory: false,
  
    // Timer
    totalTimeElapsed: 0,
    currentWaveTime: 0,
  
    // Player Resources
    minerals: 0,
    powerCrystals: 0,
    towerResearchPoints: 0,
  
    // Tower & Enemy Tracking
    towers: [],
    enemies: [],
    bosses: [],
    enemiesRemaining: [],
    enemiesKilled: [],
    selectedObject: null,
  
    // UI and Player Control
    isBuildMode: false,
    isRepairMode: false,
    previousSelectedObject: null,
    selectedTowerType: null,
    isDeleteMode: false,
    isDeleteModeFromTower: false,
    isAttackMode: false,
    isManualTargetAssigned: false,
}
  
// Resets all player interaction modes (build, delete, attack, selection)
export function resetInteractionModes() {
    gameState.isBuildMode = false;
    gameState.isDeleteMode = false;
    gameState.isAttackMode = false;
    gameState.selectedObject = null;
}
// Resets the entire gameState
export function resetGameState() {
    gameState.phase = PHASES.PLANNING
    gameState.currentWave = 0
    gameState.totalWaves = 0
    gameState.wavesRemaining = 0
    gameState.isGamePaused = false
    gameState.isGameOver = false
    gameState.isVictory = false
  
    gameState.totalTimeElapsed = 0
    gameState.currentWaveTime = 0
  
    gameState.minerals = 0
    gameState.powerCrystals = 0
    gameState.towerResearchPoints = 0
  
    gameState.towers = []
    gameState.enemies = []
    gameState.bosses = []
    gameState.enemiesRemaining = []
    gameState.enemiesKilled = []
    gameState.selectedObject = null
  
    gameState.isBuildMode = false
    gameState.selectedTowerType = null
    gameState.isDeleteMode = false
    gameState.isAttackMode = false
    gameState.isManualTargetAssigned = false
    gameState.commandPanelMode = 'default'
}

export function pauseGame(reason = 'user') {
    if (!gameState.paused) {
        gameState.paused = true
        gameState.pauseReason = reason
        updateUIBlockerState()
        updatePauseButtonIcon()
    }
}

export function resumeGame(force = false) {
    if (gameState.paused) {
        gameState.paused = false
        gameState.pauseReason = null
        updateUIBlockerState()
        updatePauseButtonIcon()
    }
}

window.gameState = gameState