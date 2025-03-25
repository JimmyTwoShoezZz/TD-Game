import { applyBuff, removeBuff} from "./buffs.js"
import { isTileBlocked, tileSize } from './maps.js'

export class Tower {
    constructor({ id, x, y, name, type, damage, range, attackSpeed, canAttackGround, canAttackAir, health, armor, lastAttackTime, target }) {
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
        this.maxhealth = health
        this.armor = armor
        this.lastAttackTime = 0
        this.target = null
        this.activeBuffs = new Set()

        // Shield-related state
        this.invulnerable = false   // For UI only
        this.targetable = true      // Controls whether enemies can target this tower
    }

    isInRange(enemy) {
        const dx = enemy.x - this.x
        const dy = enemy.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance <= this.range
    }

    canTarget(enemy) {
        if (!enemy.targetable) return false
        if (enemy.moveType === "air" && !this.canAttackAir) return false
        if (enemy.moveType === "ground" && !this.canAttackGround) return false
        if (this.requiredSize && enemy.size !== this.requiredSize) return false
        return true
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

    }

    draw(ctx) {
        console.log("DRAWING:", {
          x: this.x,
          y: this.y,
          tileSize,
          pxX: this.x * tileSize,
          pxY: this.y * tileSize
        })
      
        ctx.fillStyle = "lime"
        ctx.fillRect(this.x * tileSize, this.y * tileSize, tileSize, tileSize)
    }

    getColorByType() {
        switch (this.type) {
            case "machineGun": return "gray"
            case "shotgun": return "brown"
            case "flamethrower": return "orange"
            case "artillery": return "green"
            case "railgun": return "purple"
            case "corrosion": return "lime"
            case "shield": return "blue"
            case "bulldozer": return "black"
            case "energyCrystal": return "cyan"
            case "slowing": return "aqua"
            case "missile": return "red"
            default: return "white"
        }
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
        canAttackAir: false,
        canAttackGround: true,
        health: 100,
        armor: 1,
        lastAttackTime: 0,
        target: null
      })
    }
}

export class ShotgunTower extends Tower {
    constructor(x, y) {
      super({
        id: crypto.randomUUID(),
        name: "Shotgun Tower",
        x,
        y,
        type: "shotgun",
        damage: 3,               // low damage per pellet
        range: 2.5,              // shorter range
        attackSpeed: 1.2,        // long delay between bursts
        canAttackAir: false,     // ground only
        canAttackGround: true,
        health: 100,
        armor: 1,
        lastAttackTime: 0,
        target: null
      })
        this.pellets = 5
    }

    update(currentTime, enemies) {
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return
        const targetsInRange = enemies.filter(enemy => this.canTarget(enemy))
        if (targetsInRange.length > 0) {
            this.attack(targetsInRange[0], targetsInRange) // spread shot
            this.lastAttackTime = currentTime
        }
    }      
  
    attack(primaryTarget, allEnemies = []) {
        const maxHits = 5
        const affectedEnemies = []
        for (const enemy of allEnemies) {
            if (affectedEnemies.length >= maxHits) break
            if (this.canTarget(enemy)) {
                const dx = enemy.x - this.x
                const dy = enemy.y - this.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                if (distance <= this.range) {
                    affectedEnemies.push(enemy)
                }
            }
        }
        for (const enemy of affectedEnemies) {
            enemy.takeDamage(this.damage)
        }
    }      
}
  
export class FlamethrowerTower extends Tower {
    constructor(x, y) {
      super({
        id: crypto.randomUUID(),
        name: "Flamethrower Tower",
        x,
        y,
        type: "flamethrower",
        damage: 4, // base flame damage per tick
        range: 2, // very short
        attackSpeed: 0.5, // fires often
        canAttackAir: false,
        canAttackGround: true,
        health: 100,
        armor: 1,
        lastAttackTime: 0,
        target: null
      })
        this.burnDuration = 3 // seconds
        this.burnDamage = 1 // per second
        this.coneAngle = Math.PI / 3 // 60 degrees
    }
  
    update(currentTime, enemies) {
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return
        let primaryTarget = null
        let minDistance = this.range
        for (const enemy of enemies) {
            if (!this.canTarget(enemy)) continue
            const dx = enemy.x - this.x
            const dy = enemy.y - this.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < minDistance) {
                primaryTarget = enemy
                minDistance = dist
            }
        }
        if (!primaryTarget) return
        const angleToPrimary = Math.atan2(primaryTarget.y - this.y, primaryTarget.x - this.x)
        const targets = enemies.filter(e => this.canTarget(e) && this.isInCone(e, angleToPrimary))
        this.attack(targets)
        this.lastAttackTime = currentTime
    }
  
    isInCone(enemy, centerAngle) {
        const dx = enemy.x - this.x
        const dy = enemy.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > this.range) return false
        const angleToEnemy = Math.atan2(dy, dx)
        let angleDiff = Math.abs(angleToEnemy - centerAngle)
        if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff
        return angleDiff <= this.coneAngle / 2
    }
  
    attack(targets) {
        for (const enemy of targets) {
            let baseDamage = this.damage
            if (enemy.traits.includes("alien")) baseDamage *= 1.5
            enemy.takeDamage(baseDamage)
            if (enemy.traits.includes("biological")) {
                enemy.applyBurn(this.burnDuration, this.burnDamage)
            }
        }
    }
}

export class BulldozerTower extends Tower {
    constructor(x, y) {
      super({
        id: crypto.randomUUID(),
        name: "Bulldozer Tower",
        x,
        y,
        type: "bulldozer",
        damage: 4, // damage per push tick
        range: 4, // how far it can reach with the shovel
        attackSpeed: 6, // long cooldown (seconds)
        canAttackAir: false,
        canAttackGround: true,
        health: 150,
        armor: 2,
        lastAttackTime: 0,
        target: null
      })
        this.shovelSpeed = 1 // tiles per second
        this.impactDamage = 8 // bonus damage if enemy can't move
    }
  
    update(currentTime, enemies) {
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return
        const candidates = enemies.filter(e => this.canTarget(e) && this.isInLine(e))
        if (candidates.length === 0) return
        const target = candidates[0] // First in line
        this.shovelStrike(target, enemies)
        this.lastAttackTime = currentTime
    }
  
    isInLine(enemy) {
        return enemy.y === this.y && Math.abs(enemy.x - this.x) <= this.range
    }
  
    shovelStrike(target, allEnemies) {
        const direction = target.x > this.x ? 1 : -1
        const startX = this.x + direction
        const endX = this.x + direction * this.range
        for (let x = startX; direction > 0 ? x <= endX : x >= endX; x += direction) {
            const affected = allEnemies.filter(e => e.y === this.y && e.x === x && !e.isAir)
            for (const enemy of affected) {
                const pushX = enemy.x + direction
                const isBlocked = !this.canPushTo(pushX, enemy.y, allEnemies)
                if (isBlocked) {
                    enemy.takeDamage(this.damage + this.impactDamage)
                    console.log(`💥 ${enemy.name} slams into an obstacle!`)
                } else {
                enemy.takeDamage(this.damage)
                enemy.x = pushX
                console.log(`🚜 ${enemy.name} pushed to (${enemy.x}, ${enemy.y})`)
                }
            }
        }
    }
  
    canPushTo(x, y, allEnemies) {
        return !isTileBlocked(x, y, allEnemies)
    }
}

export class ArtilleryTower extends Tower {
    constructor(x, y) {
      super({
        id: crypto.randomUUID(),
        name: "Artillery Tower",
        x,
        y,
        type: "artillery",
        damage: 20, // direct hit damage
        range: 6, // long range
        attackSpeed: 4, // long cooldown
        canAttackAir: false,
        canAttackGround: true,
        health: 100,
        armor: 1,
        lastAttackTime: 0,
        target: null
      })
        this.splashRadius = 2 // tiles around the impact
        this.projectileDelay = 1000 // milliseconds
        this.pendingShots = [] // stores pending shell impacts
    }
  
    update(currentTime, enemies) {
        // Check for delayed explosions first
        this.resolvePendingShots(currentTime)
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return
        const targets = enemies.filter(e => this.canTarget(e))
        if (targets.length === 0) return
        const target = targets[0]
        this.fireProjectile(currentTime, target, enemies)
        this.lastAttackTime = currentTime
    }
  
    fireProjectile(currentTime, target, enemies) {
        console.log(`🚀 Artillery shell launched at (${target.x}, ${target.y})`)
        this.pendingShots.push({
            impactTime: currentTime + this.projectileDelay,
            targetX: target.x,
            targetY: target.y,
            snapshot: enemies.slice() // snapshot of current enemies
        })
    }
  
    resolvePendingShots(currentTime) {
        const toExplode = this.pendingShots.filter(p => currentTime >= p.impactTime)
        this.pendingShots = this.pendingShots.filter(p => currentTime < p.impactTime)
        for (const shot of toExplode) {
            console.log(`💥 Artillery shell explodes at (${shot.targetX}, ${shot.targetY})`)
            for (const enemy of shot.snapshot) {
                if (!enemy || !this.canTarget(enemy)) continue
                const dx = enemy.x - shot.targetX
                const dy = enemy.y - shot.targetY
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist === 0) {
                    enemy.takeDamage(this.damage)
                    console.log(`🔥 Direct hit on ${enemy.name}`)
                } else if (dist <= this.splashRadius) {
                    const falloffFactor = 1 - (dist / this.splashRadius)
                    const scaledSplash = Math.floor(this.damage * 0.9 * falloffFactor)
                    if (scaledSplash > 0) {
                        enemy.takeDamage(scaledSplash)
                        console.log(`💨 Splash hit on ${enemy.name} for ${scaledSplash}`)
                    }
                }
            }
        }
    }
}  

export class RailGunTower extends Tower {
    constructor(x, y) {
      super({
        id: crypto.randomUUID(),
        name: "Rail Gun Tower",
        x,
        y,
        type: "railgun",
        damage: 60, // massive damage
        range: 7,
        attackSpeed: 6, // cooldown after firing (seconds)
        canAttackAir: true,
        canAttackGround: true,
        health: 120,
        armor: 2,
        lastAttackTime: 0,
        target: null
      })
        this.ignoresArmor = true
        this.requiredSize = "large"
        this.chargeupTime = 2000 // 2 second delay before impact (ms)
        this.pendingShots = []
        this.size = 2 // occupies 2 tiles
        this.moveLimitPerRound = 1
    }
  
    update(currentTime, enemies) {
        this.resolvePendingShots(currentTime)
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return
        const validTargets = enemies.filter(e => this.canTarget(e))
        if (validTargets.length === 0) return
        const target = validTargets[0]
        this.fireProjectile(currentTime, target)
        this.lastAttackTime = currentTime
    }
  
    canTarget(enemy) {
        if (this.requiredSize && !enemy.traits.includes(this.requiredSize)) return false
        const dx = enemy.x - this.x
        const dy = enemy.y - this.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return distance <= this.range
    }
  
    fireProjectile(currentTime, target) {
        console.log(`⚡ Charging Rail Gun shot at ${target.name} (${target.x}, ${target.y})`)
        this.pendingShots.push({
            impactTime: currentTime + this.chargeupTime,
            target: target
        })
    }
  
    resolvePendingShots(currentTime) {
        const readyToFire = this.pendingShots.filter(p => currentTime >= p.impactTime)
        this.pendingShots = this.pendingShots.filter(p => currentTime < p.impactTime)
        for (const shot of readyToFire) {
            const { target } = shot
            if (!target || target.health <= 0) continue
            target.takeDamage(this.damage, { ignoreArmor: this.ignoresArmor })
            console.log(`💥 Rail Gun impacts ${target.name} for ${this.damage} damage!`)
        }
    }
}

export class CorrosionTower extends Tower {
    constructor(x, y) {
      super({
        id: crypto.randomUUID(),
        name: "Corrosion Tower",
        x,
        y,
        type: "corrosion",
        damage: 5, // low direct damage
        range: 4,
        attackSpeed: 2.5, // moderate cooldown
        canAttackAir: false,
        canAttackGround: true,
        health: 100,
        armor: 1,
        lastAttackTime: 0,
        target: null
      })
        this.splashRadius = 1.5
        this.armorReduction = 2 // reduces mechanical armor by 2
        this.debuffDuration = 4000 // milliseconds
    }
  
    update(currentTime, enemies) {
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return
        const targets = enemies.filter(e => this.canTarget(e))
        if (targets.length === 0) return
        const target = this.selectHighArmorTarget(targets)
        this.attack(target, enemies)
        this.lastAttackTime = currentTime
    }
  
    selectHighArmorTarget(enemies) {
        return enemies.reduce((prev, curr) => (curr.armor > prev.armor ? curr : prev), enemies[0])
    }
  
    attack(primary, allEnemies) {
        console.log(`🧪 Corrosion blast at (${primary.x}, ${primary.y})`)
        for (const enemy of allEnemies) {
            if (!enemy || !this.canTarget(enemy)) continue
            const dx = enemy.x - primary.x
            const dy = enemy.y - primary.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist <= this.splashRadius) {
                enemy.takeDamage(this.damage)
                if (enemy.traits.includes("mechanical")) {
                    enemy.applyCorrosion(this.debuffDuration, this.armorReduction)
                }
            }
        }
    }
}

export class ShieldTower extends Tower {
    constructor(x, y) {
        super({
            id: crypto.randomUUID(),
            name: "Shield Tower",
            x,
            y,
            type: "shield",
            damage: 0, // no attack
            range: 3,  // shield radius in tiles
            attackSpeed: 0, // unused
            canAttackAir: false,
            canAttackGround: false,
            health: 150,
            armor: 2,
            lastAttackTime: 0,
            target: null
        })
        this.protectedTowers = [] // towers currently under shield
        this.invulnerable = false  // purely visual
        this.targetable = true     // controls AI logic
    }

    update(currentTime, enemies) {
        const allTowers = gameState.towers

        // Reset all towers to vulnerable and not buffed
        allTowers.forEach(t => {
            removeBuff(t, "shield")
        })

        // Find towers in range and apply shield effects
        this.protectedTowers = allTowers.filter(tower => {
            if (tower.id === this.id) return false // don't shield self
            const dx = tower.x - this.x
            const dy = tower.y - this.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            return distance <= this.range
        })

        // Apply shield effects
        this.protectedTowers.forEach(t => {
            applyBuff(t, "shield")
        })
    }

    isProvidingShieldTo(tower) {
        return this.protectedTowers.includes(tower)
    }

    takeDamage(amount) {
        const effectiveDamage = Math.max(0, amount - this.armor)
        this.health -= effectiveDamage
        if (this.health <= 0) {
            this.destroy()
        }
    }

    destroy() {
        // When destroyed, remove itself from game
        console.log("🛑 Shield Tower destroyed, shield dropped!")
        playTowerDestruction(this)
    }
}

export class EnergyCrystalTower extends Tower {
    constructor(x, y) {
        super({
            id: crypto.randomUUID(),
            name: "Energy Crystal Tower",
            x,
            y,
            type: "energyCrystal",
            damage: 0, // no attack
            range: 3,  // buff radius
            attackSpeed: 0,
            canAttackAir: false,
            canAttackGround: false,
            health: 120,
            armor: 1,
            lastAttackTime: 0,
            target: null
        })

        this.buffRadius = 3
        this.damageBoost = 1.2              // +20% damage
        this.attackSpeedBoost = 0.85        // 15% faster attacks
        this.cooldownBoost = 0.85           // 15% faster ability cooldowns
        this.affectedTowers = new Set()
    }

    update(currentTime, enemies) {
        const allTowers = gameState.towers

        // Step 1: Revert previous buffs
        for (const tower of this.affectedTowers) {
            if (tower && !this.isInBuffRange(tower)) {
                removeBuff(tower, "energy")
                this.affectedTowers.delete(tower)
            }
        }

        // Step 2: Apply buffs to towers in range
        for (const tower of allTowers) {
            if (tower.id === this.id) continue
            if (!this.isInBuffRange(tower)) continue
            if (!this.affectedTowers.has(tower)) {
                applyBuff(tower, "energy")
                this.affectedTowers.add(tower)
            }
        }
    }

    isInBuffRange(tower) {
        const dx = tower.x - this.x
        const dy = tower.y - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        return dist <= this.buffRadius
    }

    destroy() {
        for (const tower of this.affectedTowers) {
            this.removeBuff(tower)
        }
        this.affectedTowers.clear()
        console.log("✨ Energy Crystal Tower destroyed, buffs removed.")
        playTowerDestruction(this)
    }
}

export class MissileTower extends Tower {
    constructor(x, y) {
        super({
            id: crypto.randomUUID(),
            name: "Missile Tower",
            x,
            y,
            type: "missile",
            damage: 15,
            range: 6,
            attackSpeed: 2, // seconds
            canAttackAir: true,
            canAttackGround: false,
            health: 100,
            armor: 1,
            lastAttackTime: 0,
            target: null
        })
    }

    update(currentTime, enemies) {
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return

        const validTargets = enemies.filter(e => this.canTarget(e))
        if (validTargets.length === 0) return

        const target = validTargets[0]
        this.attack(target)
        this.lastAttackTime = currentTime

        console.log(`🎯 Missile launched at ${target.name}!`)
    }

    attack(enemy) {
        // Later we can add animation, delay, etc.
        enemy.takeDamage(this.damage)
    }
}

export class SlowingTower extends Tower {
    constructor(x, y) {
        super({
            id: crypto.randomUUID(),
            name: "Slowing Tower",
            x,
            y,
            type: "slowing",
            damage: 4,
            range: 4,
            attackSpeed: 2.5, // medium delay between shots
            canAttackAir: false,
            canAttackGround: true,
            health: 100,
            armor: 1,
            lastAttackTime: 0,
            target: null
        })
            this.slowAmount = 0.4 // 40% speed reduction
            this.slowDuration = 3000 // in milliseconds (3 seconds)
            this.stunDuration = 1000 // 1 second stun
            this.splashRadius = 1.5 // slow nearby enemies
    }
    update(currentTime, enemies) {
        if (currentTime - this.lastAttackTime < this.attackSpeed * 1000) return
        const validTargets = enemies.filter(e => this.canTarget(e))
        if (validTargets.length === 0) return
        const target = validTargets[0]
        this.shatterImpact(currentTime, target, enemies)
        this.lastAttackTime = currentTime
        console.log(`💥 Slowing Tower hits ${target.name} with ice ball!`)
    }
    
    shatterImpact(currentTime, mainTarget, allEnemies) {
        // Deal small damage
        mainTarget.takeDamage(this.damage)
        // Apply stun and slow to main target
        mainTarget.applyStun(this.stunDuration)
        mainTarget.applySlow(this.slowAmount, this.slowDuration)
        // Splash slow to nearby enemies (excluding main target)
        for (const enemy of allEnemies) {
            if (enemy === mainTarget || !this.canTarget(enemy)) continue
            const dx = enemy.x - mainTarget.x
            const dy = enemy.y - mainTarget.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist <= this.splashRadius) {
                enemy.applySlow(this.slowAmount, this.slowDuration)
                console.log(`💦 Splash slow applied to ${enemy.name}`)
            }
        }
    }    
}






  
import { gameState } from './gameState.js'
// Handles visual + logical destruction
export function playTowerDestruction(tower, options = {}) {
    // TODO: Trigger animation or visual effects here
    // Example placeholder: tower.playAnimation("explode")
    removeTower(tower)
}

// Removes the tower from the game state
export function removeTower(tower) {
    const index = gameState.towers.indexOf(tower)
    if (index !== -1) {
        gameState.towers.splice(index, 1)
    }
    // TODO: Remove from canvas/DOM/etc. if visually represented
}