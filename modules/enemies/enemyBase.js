import { StatusEffectManager } from "../systems/statusEffects.js"
import { gameState } from "../core/gameState.js"

export class Enemy {
    constructor({ id, x, y, name, moveType, bioType, species, size, path = [], damage, range, attackSpeed, health, armor, speed }) {
        this.id = id
        this.x = x
        this.y = y
        this.name = name
        this.moveType = (moveType || "unknown").toLowerCase()
        this.bioType = bioType.toLowerCase()
        this.species = species.toLowerCase()
        this.size = size.toLowerCase()

        this.traits = [
            this.species,
            this.bioType,
            this.moveType,
            this.size
        ]

        this.alive = true
        this.path = path
        this.currentPathIndex = 0

        this.damage = damage
        this.range = range
        this.attackSpeed = attackSpeed

        this.health = health
        this.armor = armor
        this.speed = speed
        this.lastAttackTime = 0
        this.target = null

        this.status = new StatusEffectManager(this)
    }

    move(currentTime, deltaTime) {
        if (this.status.isStunned(currentTime)) return
        this.status.updateSlow(deltaTime)

        if (!this.path.length || this.currentPathIndex >= this.path.length) return

        const target = this.path[this.currentPathIndex]
        const dx = target.x - this.x
        const dy = target.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const step = this.speed * deltaTime

        if (distance < step) {
            this.x = target.x
            this.y = target.y
            this.currentPathIndex++
        } else {
            const angle = Math.atan2(dy, dx)
            this.x += Math.cos(angle) * step
            this.y += Math.sin(angle) * step
        }
    }

    aquireTarget(gameState) {
        const possibleTargets = gameState.towers.filter(t => t.targetable)
        if (possibleTargets.length === 0) return null

        let closest = null
        let minDist = this.range
        for (const tower of possibleTargets) {
            const dx = tower.x - this.x
            const dy = tower.y - this.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < minDist) {
                closest = tower
                minDist = dist
            }
        }
        this.target = closest
    }

    attack(currentTime) {
        if (!this.target || !this.target.targetable) return

        const dx = this.target.x - this.x
        const dy = this.target.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= this.range) {
            if (currentTime - this.lastAttackTime >= this.attackSpeed * 1000) {
                this.target.takeDamage(this.damage)
                this.lastAttackTime = currentTime
            }
        }
    }

    takeDamage(amount, options = {}) {
        const ignoreArmor = options.ignoreArmor || false
        const corrosionPenalty = this.status.getCorrosionValue()
        const effectiveArmor = ignoreArmor ? 0 : Math.max(0, this.armor - corrosionPenalty)
        const effectiveDamage = Math.max(0, amount - effectiveArmor)
        this.health -= effectiveDamage

        if (this.health <= 0) {
            this.destroy()
        }
    }

    destroy() {
        if (!this.alive) return

        this.alive = false

        // 🚩 TODO: Add enemy death animation, drops, resources, scoring logic here
        console.log(`Enemy destroyed: ${this.name}`)

        const index = gameState.enemies.indexOf(this)
        if (index !== -1) {
            gameState.enemies.splice(index, 1)
        }
    }
}