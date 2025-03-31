import { updateUIBlockerState, updatePauseButtonIcon } from '../ui/ui.js'

export const PHASES = {
    PLANNING: 'planning',
    WAVE: 'wave',
    BOSS: 'boss',
    PAUSED: 'paused',
}
  
export const gameState = {
    // ========== Map & Stage Info ==========
    currentStage: {
        grid: [],
        tileset: {},
        checkpoints: [],
        terrainBlockerGrid: [],
        blockerTypes: {},
        shortcutTriggers: [],
    },

    enemyPath: [], // Auto-generated each wave

    // ========== Units ==========
    towers: [],
    enemies: [],
    bosses: [],

    // ========== Resources ==========
    minerals: 0,
    powerCrystals: 0,
    towerResearchPoints: 0,

    // ========== State & UI ==========
    selectedObject: null,
    selectedTowerType: null,

    isBuildMode: false,
    isRepairMode: false,
    isDeleteMode: false,
    isAttacking: false,

    // ========== Combat & Waves ==========
    phase: "build", // or "wave"
    currentWave: 0,
    isWaveActive: false,

    // ========== Flags & Other ==========
    manualTarget: null, // used for manually assigned attack targets
    customFlags: {}, // used for custom shortcut triggers
}

export function resetGameState() {
    gameState.towers = []
    gameState.enemies = []
    gameState.bosses = []
    gameState.selectedObject = null
    gameState.selectedTowerType = null

    gameState.minerals = 0
    gameState.powerCrystals = 0
    gameState.towerResearchPoints = 0

    gameState.phase = "build"
    gameState.currentWave = 0
    gameState.isWaveActive = false

    gameState.enemyPath = []
    gameState.manualTarget = null
    gameState.customFlags = {}

    gameState.currentStage = {
        grid: [],
        tileset: {},
        checkpoints: [],
        terrainBlockerGrid: [],
        blockerTypes: {},
        shortcutTriggers: [],
    }
}

export function resetInteractionModes() {
    gameState.isBuildMode = false
    gameState.isRepairMode = false
    gameState.isDeleteMode = false
    gameState.isAttacking = false
}

export default gameState

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