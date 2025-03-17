// towers.js (updated)

function Tower(x, y, range, fireRate, damage, color = 'gray') {
    this.x = x;
    this.y = y;
    this.range = range;
    this.fireRate = fireRate; // frames between shots
    this.damage = damage;
    this.color = color;
    this.cooldown = 0; // initial cooldown timer
}

Tower.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y - 15);
    ctx.lineTo(this.x - 10, this.y + 10);
    ctx.lineTo(this.x + 10, this.y + 10);
    ctx.closePath();
    ctx.fill();
    
    // Optional: visualize tower range
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.range, 0, Math.PI * 2);
    ctx.stroke();
};

Tower.prototype.isInRange = function(enemy) {
    const dx = enemy.x - this.x;
    const dy = enemy.y - this.y;
    const distance = Math.hypot(dx, dy);
    return distance <= this.range;
};

// Attack method
Tower.prototype.attack = function(enemies) {
    if (this.cooldown > 0) {
        this.cooldown--;
        return;
    }

    // Find the first enemy in range
    const target = enemies.find(enemy => this.isInRange(enemy));

    if (target) {
        // Deal damage
        target.health -= this.damage;
        
        // Reset cooldown
        this.cooldown = this.fireRate;
    }
};