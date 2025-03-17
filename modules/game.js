// js/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Track all enemies
const towers = []
const enemies = [];

// Initialization
function init() {
    canvas.width = 800;
    canvas.height = 600;

    // Spawn test enemy
    const enemy = new Enemy(testPath, .25, 100);
    enemy.nextWaypoint = 1; // start at the first waypoint
    enemies.push(enemy);

    // Place a test tower
    const tower = new Tower(200, 150, 100, 60, 25, 'gray');
    towers.push(tower);

    // Start game loop
    requestAnimationFrame(gameLoop);
}

// Enemy movement function
Enemy.prototype.move = function() {
    if (this.nextWaypoint < this.path.length) {
        const target = this.path[this.nextWaypoint];

        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            this.x = target.x;
            this.y = target.y;
            this.nextWaypoint++;
        } else {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }
};

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawMap(ctx);

    // Towers attack enemies
    towers.forEach(tower => {
        tower.attack(enemies);
        tower.draw(ctx);
    });

    // Move and draw enemies, remove if health <= 0
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.move();
        enemy.draw(ctx);
        
        if (enemy.health <= 0) {
            enemies.splice(i, 1); // Enemy defeated!
        }
    }

    requestAnimationFrame(gameLoop);
}

// Run the game initialization
window.onload = init;