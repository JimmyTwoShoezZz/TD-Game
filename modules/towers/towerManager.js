import { gameState } from '../core/gameState.js'

export function playTowerDestruction(tower) {
    // Placeholder for animation, sound, or visual effects
}

export function removeTower(tower) {
    const index = gameState.towers.indexOf(tower)
    if (index !== -1) {
        gameState.towers.splice(index, 1)
        playTowerDestruction(tower)
    }
}

export function getColorByType(towerType) {
    switch (towerType) {
        case "machineGun": return "gray"
        case "shotgun": return "brown"
        case "flamethrower": return "orange"
        case "artillery": return "green"
        case "railgun": return "purple"
        case "corrosion": return "lime"
        case "shield": return "blue"
        case "bulldozer": return "black"
        case "energyCrystal": return "cyan"
        case "slowing": return "aqua"
        case "missile": return "red"
        default: return "white"
    }
}

export function drawTriangle(ctx, x, y, color) {
    ctx.beginPath()
    ctx.moveTo(x * 50 + 25, y * 50 + 10)
    ctx.lineTo(x * 50 + 10, y * 50 + 40)
    ctx.lineTo(x * 50 + 40, y * 50 + 40)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
    ctx.strokeStyle = '#000'
    ctx.stroke()
}