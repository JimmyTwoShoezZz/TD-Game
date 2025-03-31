export const PLANET1 = [
    {
        stageId: 'planet1_stage_a', // unique stage ID
        name: 'Planet 1',           // display name for the level
        biome: 'grass',             // tileset theme (grass, desert, volcano, etc.)
        environmentalEffects: {     // optional effects
            storms: false,
            fog: false,
            gravity: 1.0,
        },
        waves: 5,                  // number of enemy waves
        boss: 'Mech Titan',        // boss at the end of the stage

        tileset: {
            0: { id: 0, name: "Grass", buildable: true, color: "#4CAF50" },
            1: { id: 1, name: "Path", buildable: false, color: "#8B4513" },
            2: { id: 2, name: "Spawn", buildable: false, color: "#FF8C00" },
            3: { id: 3, name: "Finish", buildable: false, color: "#FF4500" },
            4: { id: 4, name: "Water", buildable: false, color: "#1E90FF" },
        },
        grid: [
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [2, 1, 1, 1, 1, 1, 1, 1, 1, 3],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 4, 0, 0, 0],
            [0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],

        blockerTypes: {
            1: {
                id: 1,
                name: "Rock",
                type: "rock",
                health: 50,
                destructible: true,
                shape: "irregular",
                color: "#222222",
                size: 0.9,
                },
            2: {
                id: 2,
                name: "Building",
                type: "building",
                health: 100,
                destructible: true,
                shape: "tallRect",
                color: "#444444",
                size: 0.9,
                },
            3: {
                id: 3,
                name: "Mineral Node",
                type: "mineralNode",
                destructible: false,
                buildable: false,
                interactable: true,
                activationCost: 75,
                activatedTower: "mineralHarvesterTower",
                shape: "irregular",
                color: "#B0B0B0",
                size: 0.9,
            },
            4: {
                id: 4,
                name: "Energy Crystal Formation",
                type: "energyCrystal",
                destructible: false,
                buildable: false,
                interactable: true,
                activationCost: 100,
                activatedTower: "buffTower",
                shape: "irregular",
                color: "#BB44FF",
                size: 0.9,
            },
        },
        terrainBlockerGrid: [
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 4, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ],

        specialRules: {
            shortcutEvents: [
                {
                    id: 'bridge1',
                    trigger: { type: 'wave', value: 3 },
                    affectedTiles: [
                        { x: 3, y: 2, newTileId: 1 },
                        { x: 3, y: 3, newTileId: 1 },
                    ],
                },
                {
                    id: 'doorSouth',
                    trigger: { type: 'wave', value: 5 },
                    affectedTiles: [
                        { x: 5, y: 6, newTileId: 1 },
                    ],
                },
                {
                    id: 'sidePassage',
                    trigger: { type: 'bossKilled', value: 'mechTitan' },
                    affectedTiles: [
                        { x: 2, y: 1, newTileId: 1 },
                        { x: 2, y: 2, newTileId: 1 },
                    ],
                },
            ],
        },
        
    },
]