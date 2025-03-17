// Tile colors based on type
const TILE_COLORS = {
    0: "#4CAF50", // Open Buildable Area (Green)
    1: "#8B4513", // Enemy Path (Brown)
    2: "#FF8C00", // Spawn Point (Orange)
    3: "#FF4500", // Finish Point (Red)
    4: "#808080", // Terrain Blocker (Gray)
    5: "#1E90FF"  // Water (Blue)
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

// Tiles where towers can be placed
const BUILDABLE_TILES = [0]; // Open areas only

// Function to check if a tile is buildable
export function isTileBuildable(row, col) {
    if (row < 0 || col < 0 || row >= MAP_GRID.length || col >= MAP_GRID[0].length) {
        return false; // Out of bounds
    }
    return BUILDABLE_TILES.includes(MAP_GRID[row][col]);
}