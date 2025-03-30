import { gameState } from './gameState.js';
import { playerData } from '../playerData.js';

export function unlockTower(towerName) {
    if (playerData.isTowerUnlocked(towerName)) {
        console.log(`${towerName} is already unlocked.`);
        return;
    }

    const cost = 3; // 🔧 You can later use a towerCosts config object

    if (gameState.towerResearchPoints < cost) {
        console.log(`❌ Not enough Tower Research Points to unlock ${towerName}.`);
        return;
    }

    gameState.towerResearchPoints -= cost;
    playerData.unlockTower(towerName);

    console.log(`🔓 Unlocked ${towerName} for ${cost} Tower Research Points.`);
}