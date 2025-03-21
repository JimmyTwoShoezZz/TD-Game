export class Enemy {
    constructor({ id, x, y, name, type, isAir, path, currentPathIndex, damage, range, attackSpeed, health, armor, speed, lastAttackTime, target }) {
        // Information properties
        this.id = id       // Unique ID
        this.x = x         // Grid x position
        this.y = y         // Grid y position
        this.name = name   // Display name
        this.type = type   // Keyword
        this.isAir = isAir
        this.alive = true
        this.path = path || []  // Array of waypoints to follow
        this.currentPathIndex = 0

        // Combat properties
        this.damage = damage
        this.range = range
        this.attackSpeed = attackSpeed

        // Enemy state
        this.health = health
        this.armor = armor
        this.speed = speed
        this.lastAttackTime = 0
        this.target = null
    }

    update(currentTime, deltaTime) {
        if (!this.path.length || this.currentPathIndex >= this.path.length) return
        const target = this.path[this.currentPathIndex]
        const dx = target.x - this.x
        const dy = target.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const step = this.speed * deltaTime
    
        if (distance < step) {
            // Arrived at this waypoint
            this.x = target.x
            this.y = target.y
            this.currentPathIndex++
        } else {
            // Move toward the target
            const angle = Math.atan2(dy, dx)
            this.x += Math.cos(angle) * step
            this.y += Math.sin(angle) * step
        }
    }
    
    takeDamage(amount) {
        const effectiveDamage = Math.max(0, amount - this.armor)
        this.health -= effectiveDamage
        if (this.health <= 0 && this.alive) {
            this.die()
        }
    }
    
    die() {
        this.alive = false
        console.log("Enemy killed")
      }
    
    isGround() {
        return !this.isAir
    }
}