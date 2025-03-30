import { drawTriangle, getColorByType } from "./towerManager"

export class Tower {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.name = "Base Tower"
        this.attackSpeed = 1
        this.range = 3
        this.damage = 1
        this.target = null
        this.lastAttackTime = 0
        this.targetable = true
        this.maxHealth = 100
        this.health = this.maxHealth
        this.armor = 1
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

    destroy() {
        this.health = 0
        this.targetable = false
        // Play destruction visuals or sounds externally
    }

    draw(ctx) {
        drawTriangle(ctx, this.x, this.y, getColorByType(this.name))
    }
}