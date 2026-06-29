export class StatusEffectManager {
    constructor(enemy) {
        this.enemy = enemy
        this.reset()
    }

    reset() {
        this.burnTimer = 0
        this.burnDamage = 0
        this.lastBurnTick = 0

        this.corrosionTimer = 0
        this.corrosionValue = 0
        this.lastCorrodeTick = 0

        this.slowTimer = 0
        this.originalSpeed = null
        this.lastSlowTick = 0

        this.stunnedUntil = 0
    }

    applyBurn(duration, damage) {
        if (!this.burnTimer || duration > this.burnTimer) {
            this.burnTimer = duration
            this.burnDamage = damage
            this.lastBurnTick = 0
        }
    }

    updateBurn(deltaTime, currentTime) {
        if (this.burnTimer > 0) {
            this.burnTimer -= deltaTime
            if (currentTime - this.lastBurnTick >= 1000) {
                this.enemy.takeDamage(this.burnDamage)
                this.lastBurnTick = currentTime
            }
            if (this.burnTimer <= 0) {
                this.burnTimer = 0
                this.burnDamage = 0
            }
        }
    }

    applyCorrosion(duration, armorReduction) {
        if (duration > this.corrosionTimer || armorReduction > this.corrosionValue) {
            this.corrosionTimer = duration
            this.corrosionValue = armorReduction
            this.lastCorrodeTick = 0
        }
    }

    updateCorrosion(deltaTime) {
        if (this.corrosionTimer > 0) {
            this.corrosionTimer -= deltaTime
            if (this.corrosionTimer <= 0) {
                this.corrosionTimer = 0
                this.corrosionValue = 0
            }
        }
    }

    getCorrosionValue() {
        return this.corrosionValue || 0
    }

    applySlow(percent, duration) {
        const newSpeed = Math.max(0.1, this.enemy.speed * (1 - percent))
        this.enemy.speed = newSpeed
        this.slowTimer = duration
        this.originalSpeed = this.originalSpeed || this.enemy.speed
        this.lastSlowTick = Date.now()
    }

    updateSlow(deltaTime) {
        if (this.slowTimer > 0) {
            this.slowTimer -= deltaTime
            if (this.slowTimer <= 0) {
                this.enemy.speed = this.originalSpeed
                this.originalSpeed = null
            }
        }
    }

    applyStun(duration) {
        this.stunnedUntil = Date.now() + duration
    }

    isStunned(currentTime) {
        return this.stunnedUntil && currentTime < this.stunnedUntil
    }
}