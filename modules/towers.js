export class Tower {
    constructor({ id, x, y, name, type, damage, range, attackSpeed, canAttackGround, canAttackAir, health, armor, lastAttackTime, target }) {
        // Information properties
        this.id = id     // Unique ID
        this.x = x       // Grid x position
        this.y = y       // Grid y position
        this.name = name // Display name
        this.type = type // Keyword

        // Combat properties
        this.damage = damage
        this.range = range
        this.attackSpeed = attackSpeed
        this.canAttackGround = canAttackGround
        this.canAttackAir = canAttackAir

        // Tower state
        this.health = health
        this.armor = armor
        this.lastAttackTime = 0
        this.target = null
    }

    isInRange(enemy) {
        const dx = enemy.x - this.x
        const dy = enemy.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance <= this.range
    }

    canTarget(enemy) {
        if (enemy.isAir && !this.canAttackAir) return false
        if (!enemy.isAir && !this.canAttackGround) return false
        return this.isInRange(enemy)
    }

    update(currentTime, enemies) {
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return 
        let closestEnemy = null
        let shortestDistance = this.range
        for (const enemy of enemies) {
            if (this.canTarget(enemy)) {
                const dx = enemy.x - this.x
                const dy = enemy.y - this.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                if (distance < shortestDistance) {
                    closestEnemy = enemy
                    shortestDistance = distance
                }
            }
        }
        if (closestEnemy) {
            this.attack(closestEnemy)
            this.lastAttackTime = currentTime
        }
    }

    attack(enemy) {
        enemy.takeDamage(this.damage)
    }
    
    takeDamage(amount) {
        const effectiveDamage = Math.max(0, amount - this.armor)
        this.health -= effectiveDamage
        if (this.health <= 0) {
            this.destroy()
        }
    }
    
    destroy() {
        console.log("Tower destroyed")
    }
}

export class MachineGunTower extends Tower {
    constructor(x, y) {
        super({
            id: crypto.randomUUID(),
            name: "Machine Gun Tower",
            x,
            y,
            type: "machineGun",
            damage: 5,
            range: 3,
            attackSpeed: 0.2,
            canAttackAir: true,
            canAttackGround: true
      })
    }
  }




export function selectTower() {
    
}

export function enterRepairMode() {
    isRepairMode = true
    console.log("🔧 Entering Repair Mode - Click a tower to repair.");
    // Future: Set a flag that allows the player to select a tower for repair
}

export function repairTower() {
    console.log("🔧 Repairing all towers...");
    // Future: Loop through all towers and repair them
}

export function repairAllTowers() {
    console.log("🔧 Repairing all towers...");
    // Future: Loop through all towers and repair them
}

export function deleteTower(tower) {
    console.log(`🔥 Tower ${tower.name} has been removed!`);
    tower.remove(); // Remove from the DOM or game state
}