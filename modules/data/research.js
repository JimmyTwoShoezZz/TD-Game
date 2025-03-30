import { gameState } from '../core/gameState.js'
import { playerData } from '../core/playerData.js'

export function unlockTower(towerName) {
    if (playerData.isTowerUnlocked(towerName)) {
        console.log(`${towerName} is already unlocked.`)
        return
    }

    const cost = 3

    if (gameState.towerResearchPoints < cost) {
        console.log(`❌ Not enough Tower Research Points to unlock ${towerName}.`)
        return
    }

    gameState.towerResearchPoints -= cost
    playerData.unlockTower(towerName)

    console.log(`🔓 Unlocked ${towerName} for ${cost} Tower Research Points.`)
}