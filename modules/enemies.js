export class Enemy {
    constructor({ id, x, y, name, type, moveType, bioType, species, size, path, currentPathIndex, damage, range, attackSpeed, health, armor, speed, lastAttackTime, target }) {

        // Information properties
        this.id = id       // Unique ID
        this.x = x         // Grid x position
        this.y = y         // Grid y position
        this.name = name   // Display name
        this.moveType = moveType.toLowerCase();   // e.g. "ground", "air"
this.bioType = bioType.toLowerCase();     // e.g. "biological", "mechanical"
this.species = species.toLowerCase();     // e.g. "human", "alien"
this.size = size.toLowerCase();           // e.g. "small", "medium", "large"

// Traits array for flexible filtering
this.traits = [
  this.species,
  this.bioType,
  this.moveType,
  this.size
];         // small, medium, large
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

        // Debuffs
        this.corrosionTimer = 0;
        this.corrosionValue = 0;
        this.lastCorrodeTick = 0;
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
    
    takeDamage(amount, options = {}) {
      const ignoreArmor = options.ignoreArmor || false;
      const effectiveArmor = ignoreArmor ? 0 : Math.max(0, this.armor - (this.corrosionValue || 0));
      const effectiveDamage = Math.max(0, amount - effectiveArmor);
      this.health -= effectiveDamage;
    
      if (this.health <= 0) {
        this.destroy();
      }
    }
    
    die() {
        this.alive = false
      }
    
    isGround() {
        return !this.isAir
    }

    applyBurn(duration, damage) {
        if (!this.burnTimer || duration > this.burnTimer) {
          this.burnTimer = duration;
          this.burnDamage = damage;
          this.lastBurnTick = 0;
        }
      }
      
      updateBurn(deltaTime, currentTime) {
        if (this.burnTimer > 0) {
          this.burnTimer -= deltaTime;
      
          if (currentTime - this.lastBurnTick >= 1000) {
            this.takeDamage(this.burnDamage);
            this.lastBurnTick = currentTime;
          }
      
          if (this.burnTimer <= 0) {
            this.burnTimer = 0;
            this.burnDamage = 0;
          }
        }
      }

      applyCorrosion(duration, armorReduction) {
        // Refresh duration and value if stronger or longer
        if (duration > this.corrosionTimer || armorReduction > this.corrosionValue) {
          this.corrosionTimer = duration;
          this.corrosionValue = armorReduction;
          this.lastCorrodeTick = 0;
        }
      }

      updateCorrosion(deltaTime, currentTime) {
        if (this.corrosionTimer > 0) {
          this.corrosionTimer -= deltaTime;
      
          if (this.corrosionTimer <= 0) {
            this.corrosionTimer = 0;
            this.corrosionValue = 0;
          }
        }
      }
}