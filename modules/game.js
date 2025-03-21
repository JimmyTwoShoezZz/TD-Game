import {
    Enemy
} from "./enemies.js"

import {
    Tower
} from "./towers.js"

import {
    generateEnemyPath
} from "./maps.js"

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