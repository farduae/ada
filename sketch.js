let img;
let x, y;
let vx = 0;
let vy = 0;
let sensitivity = 0.7;
let scrollY;

let storyText =
"tilt or rotate your phone/move your mouse\n\n" +
"the computer as a capitalist machine: invented for fast math, abstraction and control.\n" +
"the computer as a machine for abstraction: bodies, time, work and matter are reduced to numbers.\n" +
"Who loses when human experience becomes abstract? Usually minorities, handwork and bodies.\n" +
"Computers and programming were invented from capitalist logic and values. \n\n" +
"How can we re-use and reshape these systems to make place for slow craft, care, body and community?";

function preload() {
  img = loadImage("ada.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  x = width / 2;
  y = height / 2;

  scrollY = height; // ← moved here (important!)

  // iOS permission
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

  let ax, ay;

  if (rotationX !== 0 || rotationY !== 0) {
    ax = constrain(rotationY, -35, 35) * sensitivity;
    ay = constrain(rotationX, -35, 35) * sensitivity;
  } else {
    ax = map(mouseX, 0, width, -6, 6) * sensitivity;
    ay = map(mouseY, 0, height, -6, 6) * sensitivity;
  }

  // physics
  vx += ax;
  vy += ay;
  vx *= 0.9;
  vy *= 0.8;

  x += vx;
  y += vy;

  if (x < 25 || x > width - 25) vx *= -0.7;
  if (y < 25 || y > height - 25) vy *= -0.7;

  x = constrain(x, 25, width - 25);
  y = constrain(y, 25, height - 25);

  // DRAW ORDER (background → text → object → UI)
  drawScrollingText();       // ← added
  drawBall(x, y);
  drawTitleText("");
}

function drawBackground() {
  for (let i = 0; i < height; i++) {
    let c = lerpColor(color(0, 0, 255), color(0, 0, 255), i / height);
    stroke(c);
    line(0, i, width, i);
  }
}

function drawBall(x, y) {
  imageMode(CENTER);
  image(img, x, y, 100, 80);
}

function drawTitleText(message) {
  push();
  textAlign(CENTER, TOP);
  textSize(14);
  textFont("Courier");
  fill(255);
  noStroke();
  text(message, width/2, height * 0.12);
  pop();
}

function drawScrollingText() {
  push();

  textAlign(CENTER, TOP);
  textSize(min(width, height) * 0.045);
  textFont("Courier");
  textLeading(34);
  fill(255);
  noStroke();

  let boxWidth = width * 0.7;

  text(storyText, width/6, scrollY, boxWidth);

  pop();

  // move upward
  scrollY -= 0.6;

  // reset when it goes off the top
  // estimate text height using number of lines
  let lines = storyText.split("\n").length;
  let textHeight = lines * 34; // match textLeading

  if (scrollY < -textHeight) {
    scrollY = height; // start again from bottom
  }
}

