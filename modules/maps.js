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

const TILE_COLORS = {
    0: "#4CAF50", // Grass (Green)
    1: "#8B4513", // Enemy Path (Brown)
    2: "#FF8C00", // Spawn Point (Orange)
    3: "#FF4500", // Finish Point (Red)
    4: "#1E90FF", // Water (Blue)
    5: "#FFF555", // Mineral Node (Pink)
    6: "#808080"  // Rock (Grey)
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
            ctx.fillStyle = TILE_COLORS[tileType] || "#000"; // Default to black if undefined
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