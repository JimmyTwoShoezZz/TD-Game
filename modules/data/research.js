import { gameState } from '../core/gameState.js'
import { playerData } from '../core/playerData.js'

export function unlockTower(towerName) {
    if (playerData.isTowerUnlocked(towerName)) {
        return
    }

    const cost = 3

    if (gameState.towerResearchPoints < cost) {
        // alert message
        return
    }

    gameState.towerResearchPoints -= cost
    playerData.unlockTower(towerName)
}