// Arrays to store various properties for visual elements
let colors = [];
let deviations = [];
let coordinates = [];

// Base values for the size of the canvas and the radius for the visual elements
let size = 1000;
let radius = size * 0.25;

// The sound track for the visualizer
let song;

// Predefined color palette for the visual elements
let palette = [
  '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900',
  '#FF4E50', '#F9D423', '#EDE574', '#A8E6CF', '#DCEDC1',
  '#FFD3B6', '#FFAAA5', '#FF8B94', '#F67280', '#355C7D',
  '#C0D6DF', '#E5FCC2', '#9DE0AD', '#45ADA8', '#547980'
];

// Function to preload necessary assets
function preload() {
  song = loadSound("Noel.mp3"); // Specify the URL of your audio file
}

// Setup function to initialize the canvas and FFT object
function setup() {
  createCanvas(size, size); // Set up a canvas of 1000x1000 pixels
  fft = new p5.FFT(); // Create an FFT analysis object
  song.connect(fft); // Connect the song to the FFT object for analysis

  // Initialize color array with random colors from the palette
  for (let i = 0; i < 500; i++) {
    let colorIndex = floor(random(palette.length));
    let col = palette[colorIndex];
    colors.push(col);
    deviations.push(random(-6, 6));
  }

  // Generate staggered grid of coordinates for circle placement
  for (let i = 0; i < 6; i++) {
    let diff = i % 2 === 0 ? 0 : radius / 2; // Stagger every other row
    for (let j = 0; j < 6; j++) {
      coordinates.push([radius * j + j * 20 + diff, radius * i - i * 10]);
    }
  }
}

// Draw function runs in a loop to render visual elements on canvas
function draw() {
  // Prompt user to interact if audio context is not running
  if (getAudioContext().state !== 'running') {
    background(220);
    text('Tap here to play sound!', 10, 20, width - 20);
    return; // Exit the draw loop until interaction begins
  }

  // Transformation and background setup
  rotate(-PI / 11);
  translate(-350, -100);
  background(3, 79, 120); // Dark blue background

  // Analyze the frequency spectrum of the audio
  let spectrum = fft.analyze();

  // Extract and map frequencies to visual properties
  var bass = fft.getEnergy(100, 150);
  var treble = fft.getEnergy(150, 250);
  var mid = fft.getEnergy("mid");

  var mapMid = map(mid, 0, 255, -100, 200);
  var scaleMid = map(mid, 0, 255, 1, 1.5);

  var mapTreble = map(treble, 0, 255, 200, 350);
  var scaleTreble = map(treble, 0, 255, 0, 1);

  var mapbass = map(bass, 0, 255, 50, 200);
  var scalebass = map(bass, 0, 255, 0.05, 1.2);

  // Mouse position mapping for additional interaction
  mapMouseX = map(mouseX, 0, width, 1, 50);
  mapMouseXbass = map(mouseX, 0, width, 1, 5);
  mapMouseY = map(mouseY, 0, height, 2, 6);

  // Draw each circle according to the grid of coordinates
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
function drawCircle(x, y, index, mapbass, scaleTreble, mapMid) {
  push();

  // Use a smoother transition for the circle's size change, with a minimum and maximum size
  let minDiameter = radius * 0.8;
  let maxDiameter = radius * 1.5;
  let bassDiameterChange = map(mapbass, 0, 255, 0, radius * 0.5);
  let bassDiameter = constrain(minDiameter + bassDiameterChange, minDiameter, maxDiameter);

  // background circle
  noStroke();
  fill(color(colors[index % colors.length]));
  circle(x, y, bassDiameter);

  // center circle
  fill(color(colors[index * 10 + 1]));
  circle(x, y, 20);
  // outer rings
  for (let i = 0; i < 8; i++) {
    fill(0, 0, 0, 0);
    stroke(color(colors[index * 10 + i + 1]));
    strokeWeight(10);
    ellipse(x, y, (i + 1) * (15 + mapMid / 20) + deviations[i], (i + 1) * (15 + mapMid / 20) + + deviations[i + 1])
  }
  translate(x, y);
  // Draw the serration line in the middle of every four circles
  if (index % 4 === 0) {
    circleLine(color (colors[index * 10 + 10]))
  } else {
    // Draw dashed circle
    for (let i = 0; i < 4; i++) {
      stroke(color(colors[index * 10 + 10]));
      dashedCircle(75 + i * (radius - 180) / 5 + scaleTreble * 50, 2, 4);
    }
  }
  // Draw the stamen in the middle of every two circles
  if (index % 2 === 0) {
    rotate(Math.PI * 2 / 30 * index + mapMid / 10);
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