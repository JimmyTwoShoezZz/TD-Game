// maps.js

// Define your grid
const grid = [
    ['open', 'open', 'open', 'open', 'open', 'open', 'open', 'open'],
    ['spawn', 'path', 'path', 'path', 'path', 'path', 'path', 'finish'],
    ['open', 'open', 'open', 'open', 'open', 'open', 'open', 'open'],
    ['open', 'liquid', 'liquid', 'open', 'open', 'terrain', 'open', 'open'],
    ['open', 'open', 'open', 'open', 'open', 'open', 'open', 'open'],
];

const tileSize = 50;

const testPath = [
    { x: 50, y: 75 }, 
    { x: 350, y: 75 },
    { x: 350, y: 275 },
    { x: 550, y: 275 }
];

// Global drawMap function
function drawMap(ctx) {
    grid.forEach((row, rowIndex) => {
        row.forEach((type, colIndex) => {
            switch (type) {
                case 'open':
                    ctx.fillStyle = 'green';
                    break;
                case 'path':
                    ctx.fillStyle = 'brown';
                    break;
                case 'spawn':
                case 'finish':
                    ctx.fillStyle = 'orange';
                    break;
                case 'liquid':
                    ctx.fillStyle = 'blue';
                    break;
                case 'terrain':
                    ctx.fillStyle = 'grey';
                    break;
            }
            ctx.fillRect(colIndex * tileSize, rowIndex * tileSize, tileSize, tileSize);
        });
    });
}