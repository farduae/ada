let img;

function preload() {
  img = loadImage("ada.png");
}
let x, y;
let vx = 0;
let vy = 0;
let sensitivity = 0.4;


function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 2;

  // iOS requires permission
  if (typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function") {
    createButton("Enable Motion Control")
      .position(20, 20)
      .mousePressed(requestAccess);
  }
}

function requestAccess() {
  DeviceOrientationEvent.requestPermission()
    .then(response => console.log(response))
    .catch(console.error);
}

function draw() {
  drawBackground();

  // rotationX = front/back tilt
  // rotationY = left/right tilt

let ax, ay;

// If device has sensors → use tilt
if (rotationX !== 0 || rotationY !== 0) {
  ax = constrain(rotationY, -45, 45) * sensitivity;
  ay = constrain(rotationX, -45, 45) * sensitivity;
} 
// Otherwise → use mouse
else {
  ax = map(mouseX, 0, width, -6, 6) * sensitivity;
  ay = map(mouseY, 0, height, -6, 6) * sensitivity;
}

  drawCenterText("tilt your phone/move your mouse")

  // physics motion
  vx += ax;
  vy += ay;

  vx *= 0.8; // friction
  vy *= 0.8;

  x += vx;
  y += vy;

  // bounce off walls
  if (x < 25 || x > width - 25) vx *= -0.7;
  if (y < 25 || y > height - 25) vy *= -0.7;

  x = constrain(x, 25, width - 25);
  y = constrain(y, 25, height - 25);

  drawBall(x, y);
}

function drawBackground() {
  // nice gradient background
  for (let i = 0; i < height; i++) {
    let c = lerpColor(color(0, 0, 40), color(0, 0, 300), i / height);
    stroke(c);
    line(0, i, width, i);
  }
}

 function drawBall(x, y) {
  imageMode(CENTER);
  image(img, x, y, 100, 80);
}



function drawCenterText(message) {
  push();

  textAlign(CENTER, CENTER);
  textSize(20);
  textFont("Courier");
  fill(255);
  noStroke();

  fill(500, 500, 100);
  text(message, width/2, height/2);

  pop();
}
