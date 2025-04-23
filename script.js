let player;
let buildings = [];
let hook = null;
let hooked = false;
let ropeLength = 150;
let grappleRange = 200;
let gravity = 0.2;
let playerSpeed = 3;
let velocity = { x: 0, y: 0 };
let boost = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create player (ODM Gear character)
  player = new Player(width / 2, height - 100);

  // Create initial buildings (grapple targets)
  for (let i = 0; i < 5; i++) {
    buildings.push(new Building(random(width), random(100, height - 200)));
  }
}

function draw() {
  background(135, 206, 235);  // Sky blue background

  // Update and display player
  player.update();
  player.display();

  // Update and display buildings
  for (let building of buildings) {
    building.display();
  }

  // Handle grapple mechanics
  if (mouseIsPressed) {
    if (!hooked) {
      // Find closest building to grapple to
      let closestBuilding = null;
      let minDist = grappleRange;

      for (let building of buildings) {
        let d = dist(mouseX, mouseY, building.x, building.y);
        if (d < minDist) {
          minDist = d;
          closestBuilding = building;
        }
      }

      if (closestBuilding) {
        hook = closestBuilding;
        hooked = true;
      }
    }
  }

  // Rope mechanics when hooked
  if (hooked && hook) {
    let dx = hook.x - player.x;
    let dy = hook.y - player.y;
    let angle = atan2(dy, dx);
    let distance = dist(player.x, player.y, hook.x, hook.y);

    if (distance > ropeLength) {
      velocity.x += cos(angle) * 0.05;
      velocity.y += sin(angle) * 0.05;
    }

    // Draw the rope
    stroke(0);
    line(player.x, player.y, hook.x, hook.y);
  }

  // Apply gravity
  if (!hooked) {
    velocity.y += gravity;
  }

  // Update player position
  player.x += velocity.x;
  player.y += velocity.y;

  // Keep player within bounds
  player.x = constrain(player.x, 0, width);
  player.y = constrain(player.y, 0, height);

  // Boost mechanics (optional)
  if (boost) {
    velocity.x *= 1.5;
    velocity.y *= 1.5;
  }

  // Handle loss if player falls off screen
  if (player.y > height) {
    textSize(32);
    textAlign(CENTER, CENTER);
    fill(255, 0, 0);
    text("Game Over!", width / 2, height / 2);
    noLoop();
  }
}

// Player class
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
  }

  update() {
    if (!hooked) {
      if (keyIsDown(LEFT_ARROW)) this.x -= playerSpeed;
      if (keyIsDown(RIGHT_ARROW)) this.x += playerSpeed;
      if (keyIsDown(UP_ARROW)) this.y -= playerSpeed;
      if (keyIsDown(DOWN_ARROW)) this.y += playerSpeed;
    }
  }

  display() {
    fill(0);
    ellipse(this.x, this.y, this.size);
  }
}

// Building class (grapple targets)
class Building {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 100;
  }

  display() {
    fill(139, 69, 19);  // Brown color
    rect(this.x, this.y, this.width, this.height);
  }
}

// Double-tap space to boost
let lastSpacePress = 0;

function keyPressed() {
  if (keyCode === 32) { // Space key
    let currentTime = millis();
    if (currentTime - lastSpacePress < 300) {
      boost = true;
    }
    lastSpacePress = currentTime;
  }
}

function keyReleased() {
  if (keyCode === 32) {
    boost = false;
  }
}
