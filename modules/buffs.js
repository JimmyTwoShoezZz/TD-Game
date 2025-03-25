export function applyBuff(tower, type) {
    if (!tower || tower.activeBuffs.has(type)) return
    switch (type) {
        case "energy":
            if (!tower.originalStats) {
                tower.originalStats = {
                    damage: tower.damage,
                    attackSpeed: tower.attackSpeed,
                    cooldownMultiplier: tower.cooldownMultiplier || 1
                }
            }
            tower.damage *= 1.2
            tower.attackSpeed *= 0.85
            tower.cooldownMultiplier = (tower.cooldownMultiplier || 1) * 0.85
            break
        case "shield":
            tower.invulnerable = true
            tower.targetable = false
            break
        default:
            console.warn(`Unknown buff type: ${type}`)
            return
    }
    tower.activeBuffs.add(type)
}

export function removeBuff(tower, type) {
    if (!tower || !tower.activeBuffs.has(type)) return
    switch (type) {
        case "energy":
            if (tower.originalStats) {
                tower.damage = tower.originalStats.damage
                tower.attackSpeed = tower.originalStats.attackSpeed
                tower.cooldownMultiplier = tower.originalStats.cooldownMultiplier
                delete tower.originalStats
            }
            break
        case "shield":
            tower.invulnerable = false
            tower.targetable = true
            break
        default:
            console.warn(`Unknown buff type: ${type}`)
            return
    }
    tower.activeBuffs.delete(type)
}