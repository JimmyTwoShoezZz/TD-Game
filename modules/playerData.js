export const playerData = {
    // Persistent unlocks (shared across levels)
    unlockedTowers: ["Machine Gun", "Shotgun"], // Starting unlocks

    // Unlock a tower
    unlockTower(towerName) {
        if (!this.unlockedTowers.includes(towerName)) {
            this.unlockedTowers.push(towerName)
        }
    },

    // Check if a tower is unlocked
    isTowerUnlocked(towerName) {
        return this.unlockedTowers.includes(towerName)
    },

    // Optional: Reset unlocks (e.g., for new campaign or testing)
    resetUnlockedTowers() {
        this.unlockedTowers = ["Machine Gun", "Shotgun"]
    }
}