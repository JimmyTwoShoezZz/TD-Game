export const TILE_TYPES = {
    GRASS: { id: 0, name: "Grass", buildable: true, passable: true },
    PATH: { id: 1, name: "Path", buildable: false, passable: true },
    SPAWN: { id: 2, name: "Spawn Point", buildable: false, passable: true },
    FINISH: { id: 3, name: "Finish Point", buildable: false, passable: true },
    WATER: { id: 4, name: "Water", buildable: false, passable: false },
    MINERAL_NODE: { id: 5, name: "Mineral Node", buildable: true, passable: false, extractable: true },
    ROCK: { id: 6, name: "Rock", buildable: false, passable: false }
};

export function getTileType(tileId) {
    return Object.values(TILE_TYPES).find(tile => tile.id === tileId);
}

const tileColors = {
    [TILE_TYPES.GRASS.id]: "#4CAF50", // (Green)
    [TILE_TYPES.PATH.id]: "#8B4513", // (Brown)
    [TILE_TYPES.SPAWN.id]: "#FF8C00", // (Orange)
    [TILE_TYPES.FINISH.id]: "#FF4500", // (Red)
    [TILE_TYPES.WATER.id]: "#1E90FF", // (Blue)
    [TILE_TYPES.MINERAL_NODE.id]: "#FFAAAA", // (Pink)
    [TILE_TYPES.ROCK.id]: "#808080"  // (Grey)
};

// Tile size
const TILE_SIZE = 50;

// Game map (Grid layout)
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
];

// Function to render the map
export function renderMap() {
    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size based on map grid
    canvas.width = MAP_GRID[0].length * TILE_SIZE;
    canvas.height = MAP_GRID.length * TILE_SIZE;

    // Loop through the grid and draw each tile
    for (let row = 0; row < MAP_GRID.length; row++) {
        for (let col = 0; col < MAP_GRID[row].length; col++) {
            let tileType = MAP_GRID[row][col];
            ctx.fillStyle = tileColors[tileType] || "#000"; // Default to black if undefined
            ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = "#222"; // Grid lines
            ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

// Function to check if a tile is buildable
export function isTileBuildable(row, col) {
    const tile = getTileType(MAP_GRID[row][col]);
    return tile ? tile.buildable : false;
}