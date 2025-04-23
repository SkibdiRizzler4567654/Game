// Player
var player = createSprite(200, 300, 20, 20);
player.shapeColor = "gray";
player.setAnimation("captin-levi");
// Movement variables
var vx = 0;
var vy = 0;
var gravity = 0.5;
var boost = false;

// Grapple variables
var hook = null;
var hooked = false;
var ropeLength = 200;
var grappleRange = 300;
var pullStrength = 3; // Increased for faster grapple pull
var boostStrength = 5; // Increased for faster boost

// Buildings
var buildings = [];
var buildingSpacing = 300;
var maxBuildings = 8;

// Setup
function setup() {
  for (var i = 0; i < maxBuildings; i++) {
    createBuilding(i * buildingSpacing + 300);
  }
}

function draw() {
  background("skyblue");

  // Gravity
  if (!hooked) vy += gravity;

  // Grapple logic
  if (mouseDown("left")) {
    var closest = null;
    var minDist = grappleRange;
    for (var i = 0; i < buildings.length; i++) {
      var b = buildings[i];
      var d = dist(player.x, player.y, b.x, b.y);
      if (d < minDist) {
        minDist = d;
        closest = b;
      }
    }

    if (closest !== null && !hooked) {
      hook = closest;
      hooked = true;
    }
  }

  // If mouse is not pressed, unhook the player
  if (!mouseIsPressed) {
    hook = null;
    hooked = false;
  }

  if (hooked && hook !== null) {
    var dx = hook.x - player.x;
    var dy = hook.y - player.y;
    var distToHook = Math.sqrt(dx * dx + dy * dy);
    var angle = Math.atan2(dy, dx);
    var force = pullStrength;
    if (boost) force = boostStrength;

    if (distToHook > 10) {
      vx += Math.cos(angle) * force;
      vy += Math.sin(angle) * force;
    }

    // Draw rope
    stroke("black");
    line(player.x, player.y, hook.x, hook.y);
    noStroke();
  }

  // Apply velocity
  player.x += vx;
  player.y += vy;

  // Friction
  vx *= 0.98;
  vy *= 0.98;

  // Fall off screen = lose
  if (player.y > 400) {
    textSize(30);
    textAlign(CENTER);
    fill("red");
    text("Game Over", player.x, 200);
    noLoop();
  }

  // Move camera with player
  camera.x = player.x;

  // Move buildings with camera and recycle them
  for (var i = 0; i < buildings.length; i++) {
    if (buildings[i].x < player.x - 400) {
      buildings[i].x += buildingSpacing * maxBuildings;
      buildings[i].y = randomNumber(100, 300);
    }
  }

  drawSprites();
}

// Double-tap space to boost
var lastTap = 0;
function keyPressed() {
  if (keyCode === 32) {
    var now = millis();
    if (now - lastTap < 300) {
      boost = true;
    }
    lastTap = now;
  }
}

function keyReleased() {
  if (keyCode === 32) {
    boost = false;
  }
}

// Create a single building
function createBuilding(x) {
  var b = createSprite(x, randomNumber(100, 300), 20, 100);
  b.shapeColor = "brown";
  buildings.push(b);
}
