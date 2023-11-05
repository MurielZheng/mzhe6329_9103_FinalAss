// Arrays to store various properties for visual elements
let colors = [];
let deviations = [];
let coordinates = [];

// Base values for the size of the canvas and the radius for the visual elements
let size = 1000;
let radius = size * 0.25;

// The sound track for the visualizer
let song;
let uploadedSong;
let fft;
let mic;

// Input for audio file upload
let fileInput;

// Predefined color palette for the visual elements
let palette = [
  '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900',
  '#FF4E50', '#F9D423', '#EDE574', '#A8E6CF', '#DCEDC1',
  '#FFD3B6', '#FFAAA5', '#FF8B94', '#F67280', '#355C7D',
  '#C0D6DF', '#E5FCC2', '#9DE0AD', '#45ADA8', '#547980'
];

// Function to preload audio assets
function preload() {
  song = loadSound("Noel.mp3");
}

// Setup function to initialize the canvas and audio analysis tools
function setup() {
  createCanvas(size, size);
  fft = new p5.FFT();
  mic = new p5.AudioIn();
  mic.start();
  fft.setInput(song);

  // Populate arrays with random values
  for (let i = 0; i < 500; i++) {
    colors.push(palette[floor(random(palette.length))]);
    deviations.push(random(-6, 6));
  }

  // Generate grid for visual element placement
  for (let i = 0; i < 6; i++) {
    let diff = i % 2 === 0 ? 0 : radius / 2;
    for (let j = 0; j < 6; j++) {
      coordinates.push([radius * j + j * 20 + diff, radius * i - i * 10]);
    }
  }

  // Create a file input button for audio files
  fileInput = createFileInput(handleFile);
  fileInput.position(10, height + 10);
}

// Render loop for the visuals
function draw() {
  if (getAudioContext().state !== 'running' || !mic.enabled) {
    displayStartInstructions();
    return;
  }

  if (song.isPlaying()) {
    background(3, 79, 129); // Playing background color
  } else {
    background(50); // Paused background color
  }

  // Rotate and translate for visual transformation
  rotate(-PI / 11);
  translate(-350, -100);

  let spectrum = fft.analyze();
  let bass = fft.getEnergy(100, 150);
  let treble = fft.getEnergy(150, 250);
  let mid = fft.getEnergy("mid");

  // Map frequency energies to visual properties
  let mapMid = map(mid, 0, 255, -100, 200);
  let scaleMid = map(mid, 0, 255, 1, 1.5);
  let mapTreble = map(treble, 0, 255, 200, 350);
  let scaleTreble = map(treble, 0, 255, 0, 1);
  let mapBass = map(bass, 0, 255, 50, 200);
  let scaleBass = map(bass, 0, 255, 0.05, 1.2);

  // Draw circles influenced by the audio
  for (let i = 0; i < coordinates.length; i++) {
    drawCircle(coordinates[i][0], coordinates[i][1], i, mapBass, scaleTreble, mapMid);
  }
}

// Display instructions to start audio
function displayStartInstructions() {
  background(50);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Click to start the audio', width / 2, height / 2 - 50);
  textSize(16);
  text('The visualizer will react to the music!', width / 2, height / 2);
  textSize(12);
  text('(Ensure "Noel.mp3" is in the project directory)', width / 2, height / 2 + 20);
}

// Function to draw an individual circle with audio-reactive visual elements
function drawCircle(x, y, index, mapbass, scaleTreble, mapMid) {
  push();

  // Use a smoother transition for the circle's size change, with a minimum and maximum size
  let minDiameter = radius * 0.75;
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
      dashedCircle(75 + i * (radius - 180) / 5 + scaleTreble * 30, 2, 4);
    }
  }
  // Draw the stamen in the middle of every two circles
  if (index % 2 === 0) {
    rotate(Math.PI * 2 / 30 * index + mapMid / 10);
    drawPetal(150)
  }
  pop()
}

// Function to draw a dashed circle
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

// Function to draw a line with serration effect
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

// Function to draw a stamen-like line within the circle
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

// Function to handle the uploaded file
function handleFile(file) {
  if (file.type === 'audio') {
    if (uploadedSong) {
      uploadedSong.stop();
    }
    uploadedSong = loadSound(file.data, () => {
      if (song.isPlaying()) {
        song.stop();
      }
      mic.stop();
      uploadedSong.play();
      fft.setInput(uploadedSong);
    });
  } else {
    console.error("This file type is not supported.");
  }
}

// Adjust the mousePressed function to accommodate the uploaded audio
function mousePressed() {
  if (song.isPlaying()) {
    song.stop();
    mic.start();
    fft.setInput(mic);
    displayPlaybackMode("Microphone", false);
  } else if (uploadedSong && uploadedSong.isPlaying()) {
    uploadedSong.stop();
    mic.start();
    fft.setInput(mic);
    displayPlaybackMode("Microphone", false);
  } else {
    if (getAudioContext().state !== 'running') {
      userStartAudio();
    }
    if (uploadedSong) {
      mic.stop();
      uploadedSong.play();
      fft.setInput(uploadedSong);
      displayPlaybackMode("Uploaded Song", true);
    } else {
      mic.stop();
      song.play();
      fft.setInput(song);
      displayPlaybackMode("Song", true);
    }
  }
}

// Function to display the current playback mode on the canvas
function displayPlaybackMode(mode, isPlaying) {
  // Set background color based on whether the song is playing
  let bgColor = isPlaying ? [3, 79, 129] : [50, 50, 50];
  background(bgColor);
  textFont("Lato");
  fill(255); // White text for visibility
  textSize(17);
  textAlign(CENTER, BOTTOM);
  let modeText;
  switch (mode) {
    case "Microphone":
      modeText = "Listening to the Microphone";
      break;
    case "Song":
      modeText = "Playing the Song";
      break;
    case "Uploaded Song":
      modeText = "Playing the Uploaded Song";
      break;
  }
  text(`Mode: ${modeText}`, width / 2, height - 30);
}