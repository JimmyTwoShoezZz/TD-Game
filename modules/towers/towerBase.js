import { drawTriangle, getColorByType, removeTower } from "./towerManager.js"

export class Tower {
    constructor(config = {}) {
        this.id = config.id || crypto.randomUUID()
        this.name = config.name || "Base Tower"
        this.type = config.type || "base"
        this.x = config.x
        this.y = config.y
        this.health = config.health ?? 100
        this.armor = config.armor ?? 1
        this.damage = config.damage ?? 1
        this.range = config.range ?? 3
        this.attackSpeed = config.attackSpeed ?? 1
        this.canAttackAir = config.canAttackAir ?? true
        this.canAttackGround = config.canAttackGround ?? true
        this.target = null
        this.lastAttackTime = 0
        this.targetable = true
        this.maxHealth = this.health
    }

    isInRange(enemy) {
        const dx = enemy.x - this.x
        const dy = enemy.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance <= this.range
    }

    acquireTarget(enemies) {
        this.target = null
        for (const enemy of enemies) {
            if (enemy.alive && this.isInRange(enemy)) {
                this.target = enemy
                break
            }
        }
    }

    attack(currentTime) {
        if (
            this.target &&
            this.target.alive &&
            this.isInRange(this.target) &&
            currentTime - this.lastAttackTime >= this.attackSpeed * 1000
        ) {
            this.target.takeDamage(this.damage)
            this.lastAttackTime = currentTime
        }
    }

    update(enemies, currentTime) {
        if (!this.target || !this.target.alive || !this.isInRange(this.target)) {
            this.acquireTarget(enemies)
        }
        if (this.target) {
            this.attack(currentTime)
        }
    }

    takeDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

    destroy({ isManual = false } = {}) {
        removeTower(this, { isManual })
    }
}