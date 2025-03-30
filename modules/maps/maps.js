import { gameState } from '../core/gameState.js'

export const TILE_TYPES = {
    GRASS: { id: 0, name: "Grass", buildable: true, passable: true },
    PATH: { id: 1, name: "Path", buildable: false, passable: true },
    SPAWN: { id: 2, name: "Spawn Point", buildable: false, passable: true },
    FINISH: { id: 3, name: "Finish Point", buildable: false, passable: true },
    WATER: { id: 4, name: "Water", buildable: false, passable: false },
    MINERAL_NODE: { id: 5, name: "Mineral Node", buildable: true, passable: false, extractable: true },
    ROCK: { id: 6, name: "Rock", buildable: false, passable: false }
}

export function getTileType(tileId) {
    return Object.values(TILE_TYPES).find(tile => tile.id === tileId)
}

const tileColors = {
    [TILE_TYPES.GRASS.id]: "#4CAF50",
    [TILE_TYPES.PATH.id]: "#8B4513",
    [TILE_TYPES.SPAWN.id]: "#FF8C00",
    [TILE_TYPES.FINISH.id]: "#FF4500",
    [TILE_TYPES.WATER.id]: "#1E90FF",
    [TILE_TYPES.MINERAL_NODE.id]: "#FFAAAA",
    [TILE_TYPES.ROCK.id]: "#808080"
}

export let tileSize = 50

export const MAP_GRID = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
    [0, 0, 0, 5, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

export function renderMap() {
    const canvas = document.getElementById("game-canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = MAP_GRID[0].length * tileSize
    canvas.height = MAP_GRID.length * tileSize

    for (let row = 0; row < MAP_GRID.length; row++) {
        for (let col = 0; col < MAP_GRID[row].length; col++) {
            const tileType = MAP_GRID[row][col]
            ctx.fillStyle = tileColors[tileType] || "#000"
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize)
            ctx.strokeStyle = "#222"
            ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize)
        }
    }
}

export function generateEnemyPath() {
    const path = []
    for (let row = 0; row < MAP_GRID.length; row++) {
        for (let col = 0; col < MAP_GRID[row].length; col++) {
            const tileId = MAP_GRID[row][col]
            if (
                tileId === TILE_TYPES.SPAWN.id ||
                tileId === TILE_TYPES.PATH.id ||
                tileId === TILE_TYPES.FINISH.id
            ) {
                path.push({ x: col, y: row })
            }
        }
    }
    path.sort((a, b) => a.x - b.x)
    return path
}

export function isTileBuildable(row, col) {
    const tile = getTileType(MAP_GRID[row][col])
    return tile ? tile.buildable : false
}

export function isTileBlocked(x, y, allEnemies) {
    if (x < 0 || y < 0 || y >= gameState.map.length || x >= gameState.map[0].length) {
        return true
    }

    const tile = gameState.map[y][x]
    const terrainIsBlocked = tile.type === 'terrainBlocker' || tile.type === 'liquid'
    const enemyInTile = allEnemies.some(e => e.x === x && e.y === y && !e.isAir)

    return terrainIsBlocked || enemyInTile
}