// arrays to store colors, deviations, and coordinates, and set the base values of Size and radius
let colors = [];
let deviations = [];
let coordinates = [];
// canvas size
let size = 1000;
let radius = size * 0.27;

let song;

function preload() {
  // Fill in the url for your audio asset
  song = loadSound("Noel.mp3");
}

function setup() {
  // Create a canvas with a specified size of 1000x1000
  createCanvas(size, size);
  // Generate random color array of size 500
  for (let i = 0; i < 500; i++) {
    let r = random(0, 255);
    let g = random(0, 255);
    let b = random(0, 255);
    //Enter random rgb values into the color array
    colors.push([r,g,b]);
    //Enter random rgb values into the deviations array
    deviations.push(random(-6, 6))
  }
  //Generates a set of coordinates for the circle
  for (let i = 0; i < 6; i++) {
    //When even numbers are 0, odd numbers are radius / 2. Make a staggered effect.
    let diff = i % 2 === 0 ? 0 : radius / 2;
    for (let j = 0; j < 6; j++) {
      //Enter the coordinates of the circle for the loop effect in the coordinate array
      coordinates.push([radius * j + j * 20 + diff, radius * i - i * 10])
    }
  }
}

function draw() {
    // Give the user a hint on how to interact with the sketch
    if (getAudioContext().state !== 'running') {
      background(220);
      text('tap here to play some sound!', 10, 20, width - 20);
      // Early exit of the draw loop
      return;
    }
  // rotate and translate canvas
  rotate(-PI / 11);
  translate(-350, -100);
  // Set the background color to a dark blue
  background(3, 79, 120)
  // Draw all circle based on coordinates
  for (let i = 0; i < coordinates.length; i++) {
    drawCircle(coordinates[i][0], coordinates[i][1], i);
  }

  // Request fresh data from the FFT analysis
  let spectrum = fft.analyze();

  var bass = fft.getEnergy(100, 150);
  var treble = fft.getEnergy(150, 250);
  var mid = fft.getEnergy("mid");

  var mapMid = map(mid, 0, 255, -100, 200);
  var scaleMid = map(mid, 0, 255, 1, 1.5);

  var mapTreble = map(treble, 0, 255, 200, 350);
  var scaleTreble = map(treble, 0, 255, 0, 1);

  var mapbass = map(bass, 0, 255, 50, 200);
  var scalebass = map(bass, 0, 255, 0.05, 1.2);

  mapMouseX = map(mouseX, 0, width, 1, 50);
  mapMouseXbass = map(mouseX, 0, width, 1, 5);
  mapMouseY = map(mouseY, 0, height, 2, 6);

  for (let i = 0; i < coordinates.length; i++) {
    drawCircle(coordinates[i][0], coordinates[i][1], i, mapbass, scaleTreble, mapMid);
  }
}

/*
* Draw circle
* x: the position of the horizontal coordinate axis
* y: the position of the vertical coordinate axis
* index: index of the current circle in the array
*/
function drawCircle(x, y, index, mapMid, scaleTreble, mapMid) {
  push()
  // background circle
  stroke(0, 0, 0, 0)
  fill(colors[index * 10]);
  circle(x, y, radius);
  // center circle
  fill(colors[index * 10 + 1]);
  circle(x, y, 20);
  // outer rings
  for (let i = 0; i < 8; i++) {
    fill(0, 0, 0, 0);
    stroke(colors[index * 10 + i + 1]);
    strokeWeight(10);
    ellipse(x, y, (i + 1) * (15 + mapMid / 20) + deviations[i], (i + 1) * (15 + mapMid / 20) + + deviations[i + 1])
  }
  translate(x, y);
  // Draw the serration line in the middle of every four circles
  if (index % 4 === 0) {
    circleLine(colors[index * 10 + 10])
  } else {
    // Draw dashed circle
    for (let i = 0; i < 4; i++) {
      stroke(colors[index * 10 + 10]);
      dashedCircle(75 + i * (radius - 180) / 5 + scaleTreble * 50, 2, 4);
    }
  }
  // Draw the stamen in the middle of every two circles
  if (index % 2 === 0) {
    rotate(Math.PI * 2 / 30 * index);
    drawPetal(150)
  }
  pop()
}

/*
* Draw dashed circle
* radius: radius size of a circle
* dashWidth: dash width size
* dashSpacing: spacing between dashed line segments
*/
function dashedCircle(radius, dashWidth, dashSpacing) {
  // 200 dashed line segments
  let steps = 200;
  let dashPeriod = dashWidth + dashSpacing;
  let lastDashed = false;
  // Draw all segments
  for(let i = 0; i < steps; i++) {
    // Decide whether to beginShape or endShape
    let curDashed = (i % dashPeriod) < dashWidth;
    if(curDashed && !lastDashed) {
      beginShape();
    }
    if(!curDashed && lastDashed) {
      endShape();
    }
    // Draw vertex by calculate result
    if(curDashed) {
      let theta = map(i, 0, steps, 0, TWO_PI);
      vertex(cos(theta) * radius, sin(theta) * radius);
    }
    lastDashed = curDashed;
  }
  if(lastDashed) {
    endShape();
  }
}

/*
* Draw serration line circle
* color: color of line
*/
function circleLine(color) {
  stroke(color)
  strokeWeight(3);
  // initialize small/large circle points array
  let smallCirclePoints = [[65, 0]];
  let largeCirclePoints = [[132, 0]];
  let angle = Math.PI * 2 / 30;
  // add 30 new point to small circle points array
  for (let i = 0; i <= 30; i++) {
    smallCirclePoints.push([65 * cos(angle * i), 65 * sin(angle * i)])
  }
  // add 30 new point to large circle points array
  for (let i = 0; i <= 30; i++) {
    largeCirclePoints.push([132 * cos(angle * i), 132 * sin(angle * i)])
  }
  // Form a jagged shape based on the interaction and connection of points in two arrays
  for (let i = 0; i < 31; i++) {
    line(smallCirclePoints[i][0], smallCirclePoints[i][1], largeCirclePoints[i][0], largeCirclePoints[i][1]);
    line(largeCirclePoints[i][0], largeCirclePoints[i][1], smallCirclePoints[i + 1][0], smallCirclePoints[i + 1][1]);
  }
}

/*
* Draw stamen line of circle
* currentRadius: radius size of a circle
*/
function drawPetal(currentRadius) {
  const ratio = 3
  // draw bezier line by calc result
  stroke(234, 85, 126);
  strokeWeight(10);
  noFill();
  bezier(0, 0, -currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius);
  // rotate and draw another bezier line by calc result
  rotate(Math.PI * 2 /90);
  stroke(236, 65, 87);
  bezier(0, 0, -currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius);
}

// Toggle playback on or off with a mouse click
function mousePressed() {
  if (song.isPlaying()) {
    // .isPlaying() returns a boolean
    song.stop();
    background(255, 0, 0);
  } else {
    song.play();
    background(0, 255, 0);
  }
}
