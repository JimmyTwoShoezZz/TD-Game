// enemies.js

// enemies.js (updated)

// Enemy Constructor with health
function Enemy(path, speed, health = 100, color = 'red') {
    this.path = path;
    this.speed = speed;
    this.color = color;

    this.x = path[0].x;
    this.y = path[0].y;
    this.nextWaypoint = 1;

    this.health = health; // enemy health
}

// Update enemy position
Enemy.prototype.update = function() {
    const target = this.path[this.nextWaypoint];

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance < this.speed) {
        this.x = target.x;
        this.y = target.y;
        this.nextWaypoint++;

        // Check if at finish
        if (this.nextWaypoint >= this.path.length) {
            // Enemy reached goal logic (handle later)
        }
    } else {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
    }
}

// draw enemy
Enemy.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
    ctx.fill();
};