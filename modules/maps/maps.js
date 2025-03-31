import { gameState } from '../core/gameState.js'
import { setupEnemyWaves } from '../enemies/enemyManager.js'

export const tileSize = 50

function drawIrregularPolygon(ctx, cx, cy, size, points, fill = "#44CCFF") {
    ctx.beginPath();
    const angleStep = (Math.PI * 2) / points.length;

    for (let i = 0; i < points.length; i++) {
        const [radiusFactor, angleOffset] = points[i];
        const angle = i * angleStep + (angleOffset || 0);
        const r = size * radiusFactor;

        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
}

export function loadStage(planet, stageIndex) {
    const stageData = planet[stageIndex];

    gameState.currentStage = stageData;
    renderMap();

    gameState.enemyPath = generateEnemyPath(stageData.grid, stageData.tileset);

    setupEnemyWaves(stageData.waves, stageData.boss);
}

export function checkShortcutTriggers(context = {}) {
    const stage = gameState.currentStage;
    const shortcuts = stage.specialRules.shortcutEvents || [];
    stage.appliedShortcuts = stage.appliedShortcuts || new Set();

    shortcuts.forEach(event => {
        if (stage.appliedShortcuts.has(event.id)) return;

        const { type, value } = event.trigger;

        let triggered = false;

        switch (type) {
            case 'wave':
                if (context.waveNumber === value) {
                    triggered = true;
                }
                break;

            case 'bossKilled':
                if (context.bossId === value) {
                    triggered = true;
                }
                break;

            case 'customFlag':
                if (gameState.flags && gameState.flags.includes(value)) {
                    triggered = true;
                }
                break;

            // Add more trigger types here if needed
        }

        if (triggered) {
            event.affectedTiles.forEach(tile => {
                stage.grid[tile.y][tile.x] = tile.newTileId;
            });

            stage.appliedShortcuts.add(event.id);

            renderMap();
            gameState.enemyPath = generateEnemyPath(stage.checkpoints);
        }
    });
}


export function renderMap() {
    const grid = gameState.currentStage.grid;
    const tileset = gameState.currentStage.tileset;
    const blockerGrid = gameState.currentStage.terrainBlockerGrid;
    const blockerTypes = gameState.currentStage.blockerTypes;

    if (!Array.isArray(grid) || !grid.length || !tileset) return;

    const canvas = document.getElementById("game-canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = grid[0].length * tileSize;
    canvas.height = grid.length * tileSize;

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            // === Draw tile ===
            const tileId = grid[row][col];
            const tile = tileset[tileId];
            const color = tile?.color || "#000000";

            ctx.fillStyle = color;
            ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            ctx.strokeStyle = "#222";
            ctx.lineWidth = 1;
            ctx.strokeRect(col * tileSize, row * tileSize, tileSize, tileSize);

            // === Draw blocker ===
            const blockerId = blockerGrid?.[row]?.[col] || 0;
            if (blockerId > 0) {
                const blocker = blockerTypes?.[blockerId];
                if (!blocker) continue;

                const shape = blocker.shape || "square";
                const fill = blocker.color || "#FF00FF";
                const size = blocker.size || 0.9;

                const x = col * tileSize + (tileSize * (1 - size)) / 2;
                const y = row * tileSize + (tileSize * (1 - size)) / 2;
                const s = tileSize * size;

                ctx.fillStyle = fill;

                if (shape === "circle") {
                    ctx.beginPath();
                    ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, s / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (shape === "diamond") {
                    ctx.beginPath();
                    ctx.moveTo(x + s / 2, y);
                    ctx.lineTo(x + s, y + s / 2);
                    ctx.lineTo(x + s / 2, y + s);
                    ctx.lineTo(x, y + s / 2);
                    ctx.closePath();
                    ctx.fill();
                } else if (shape === "tallRect") {
                    const width = s * 0.5;
                    const height = s;
                    const x = col * tileSize + (tileSize - width) / 2;
                    const y = row * tileSize + (tileSize - height) / 2;
                    ctx.fillRect(x, y, width, height);
                } else if (shape === "irregular") {
                    const cx = col * tileSize + tileSize / 2;
                    const cy = row * tileSize + tileSize / 2;
                    const size = tileSize * 0.45;
                
                    const jaggedPoints = [
                        [1, 0],
                        [0.7, 0.2],
                        [1.1, -0.1],
                        [0.8, 0.1],
                        [1, -0.3],
                        [0.9, 0.2],
                    ];
                
                    drawIrregularPolygon(ctx, cx, cy, size, jaggedPoints, fill);
                } else {
                    ctx.fillRect(x, y, s, s); // Default square
                }
            }
        }
    }
}

export function generateEnemyPath(grid, tileset) {
    const rows = grid.length;
    const cols = grid[0].length;

    const pathTileIds = Object.values(tileset)
        .filter(tile => ["Spawn", "Path", "Finish"].includes(tile.name))
        .map(tile => tile.id);

    let start = null;
    let finish = null;

    // Find Spawn and Finish
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const tileId = grid[y][x];
            const name = tileset[tileId]?.name;
            if (name === "Spawn") start = { x, y };
            if (name === "Finish") finish = { x, y };
        }
    }

    if (!start || !finish) {
        console.error("Missing Spawn or Finish tile");
        return [];
    }

    const directions = [
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 1 },  // down
        { dx: -1, dy: 0 }, // left
        { dx: 1, dy: 0 },  // right
    ];

    const visited = new Set();
    const queue = [{ pos: start, path: [start] }];
    visited.add(`${start.x},${start.y}`);

    while (queue.length > 0) {
        const { pos, path } = queue.shift();

        if (pos.x === finish.x && pos.y === finish.y) {
            return path; // ✅ Found path to Finish
        }

        for (const dir of directions) {
            const nx = pos.x + dir.dx;
            const ny = pos.y + dir.dy;

            if (
                nx >= 0 && ny >= 0 &&
                nx < cols && ny < rows &&
                !visited.has(`${nx},${ny}`) &&
                pathTileIds.includes(grid[ny][nx])
            ) {
                visited.add(`${nx},${ny}`);
                queue.push({
                    pos: { x: nx, y: ny },
                    path: [...path, { x: nx, y: ny }]
                });
            }
        }
    }

    console.warn("No path found from Spawn to Finish");
    return [];
}

export function activateNodeAt(x, y) {
    const blockerGrid = gameState.currentStage.terrainBlockerGrid;
    const blockerId = blockerGrid?.[y]?.[x] || 0;
    const blocker = gameState.currentStage.blockerTypes?.[blockerId];

    if (blockerId === 0) return;
    if (!blocker || !blocker.interactable) return;

    const cost = blocker.activationCost || 0;
    if (gameState.minerals < cost) return;

    gameState.minerals -= cost;
    blockerGrid[y][x] = 0;

    placeTowerAt(x, y, blocker.activatedTower); // Custom logic for special tower unlock

    renderMap();
    gameState.enemyPath = generateEnemyPath(
        gameState.currentStage.grid,
        gameState.currentStage.tileset
    );
}

export function damageBlocker(x, y, damage) {
    const blockerId = gameState.currentStage.terrainBlockerGrid[y]?.[x] || 0;
    const blocker = gameState.currentStage.blockerTypes?.[blockerId];
    if (blockerId === 0 || !blocker?.destructible) return;

    blocker.health -= damage;
    if (blocker.health <= 0) {
        destroyBlocker(x, y);
    }
}

export function destroyBlocker(x, y) {
    const blockerId = gameState.currentStage.terrainBlockerGrid[y]?.[x] || 0;
    const blocker = gameState.currentStage.blockerTypes?.[blockerId];

    if (blockerId === 0 || !blocker?.destructible) return;
    if (!blocker.destructible) return;

    gameState.currentStage.terrainBlockerGrid[y][x] = 0;

    renderMap(); // Show the cleared tile
    gameState.enemyPath = generateEnemyPath(
        gameState.currentStage.grid,
        gameState.currentStage.tileset
    );
}

export function canBuildHere(x, y, towerType) {
    const grid = gameState.currentStage.grid;
    const blockerGrid = gameState.currentStage.terrainBlockerGrid;
    const tileset = gameState.currentStage.tileset;
    const blockerTypes = gameState.currentStage.blockerTypes;

    const tileId = grid[y]?.[x];
    const tile = tileset?.[tileId];
    if (!tile || !tile.buildable) return false;

    const blockerId = blockerGrid?.[y]?.[x] || 0;
    const blocker = blockerTypes?.[blockerId];

    if (blocker) {
        if (!blocker.buildable) return false;

        // Support for special tower types per blocker
        if (blocker.buildable === "mineralOnly" && towerType?.name !== "MineralHarvesterTower") {
            return false;
        }

        if (blocker.buildable === "crystalOnly" && towerType?.name !== "BuffTower") {
            return false;
        }
    }

    return true;
}