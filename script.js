let player;
let hook = null;
let hooked = false;
let ropeLength = 200;
let grappleRange = 300;
let pullStrength = 3;
let boostStrength = 5;

let buildings = [];
let buildingSpacing = 300;
let maxBuildings = 8;

function setup() {
    createCanvas(800, 400);
    player = new Player(200, 300);
    for (let i = 0; i < maxBuildings; i++) {
        createBuilding(i * buildingSpacing + 300);
    }
}

function draw() {
    background(135, 206, 250); // Sky blue

    for (let i = 0; i < buildings.length; i++) {
        buildings[i].update();
        buildings[i].show();
    }

    player.update();
    player.show();

    // Grappling mechanics
    if (mouseIsPressed) {
        if (!hooked) {
            let closest = findClosestBuilding();
            if (closest) {
                hook = closest;
                hooked = true;
            }
        }
    } else {
        if (hooked) {
            hooked = false;
            hook = null;
        }
    }

    if (hooked && hook !== null) {
        let dx = hook.x - player.x;
        let dy = hook.y - player.y;
        let distToHook = Math.sqrt(dx * dx + dy * dy);
        let angle = Math.atan2(dy, dx);
        let force = pullStrength;
        if (keyIsDown(32)) { // Spacebar pressed for boost
            force = boostStrength;
        }

        if (distToHook > 10) {
            player.vx += Math.cos(angle) * force;
            player.vy += Math.sin(angle) * force;
        }

        // Draw rope
        stroke(0);
        line(player.x, player.y, hook.x, hook.y);
        noStroke();
    }

    // Player falls when not hooked
    if (!hooked) {
        player.vy += 0.5; // Gravity
    }

    // Prevent player from going off the screen
    if (player.y > height) {
        textSize(30);
        textAlign(CENTER);
        fill("red");
        text("Game Over", width / 2, height / 2);
        noLoop();
    }
}

// Helper function to find the closest building
function findClosestBuilding() {
    let closest = null;
    let minDist = grappleRange;
    for (let b of buildings) {
        let d = dist(player.x, player.y, b.x, b.y);
        if (d < minDist) {
            closest = b;
            minDist = d;
        }
    }
    return closest;
}

// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 20;
        this.vx = 0;
        this.vy = 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Apply some friction to slow down the movement
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    show() {
        fill(200);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}

// Building class
class Building {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = random(100, 200);
    }

    update() {
        // You can add any building movement or animations here if needed
    }

    show() {
        fill(139, 69, 19); // Brown color
        rect(this.x, this.y - this.height, this.width, this.height);
    }
}

// Function to create buildings
function createBuilding(x) {
    let building = new Building(x, random(100, 300));
    buildings.push(building);
}
