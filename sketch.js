// Base values for the size of the canvas and the radius for the visual elements
let size = 1000;
let radius = size * 0.25;
let canvasHeight = window.innerHeight;
// The sound track for the visualizer, FFT analysis, and microphone input
let song, uploadedSong, fft, mic;
// Input for audio file upload and buttons for audio source selection
let fileInput, micButton, defaultSongButton, uploadedSongButton;
// Current audio source state: 'defaultSong', 'microphone', 'uploadedSong'
let currentAudioSource = 'defaultSong';
let isUsingMic = false;
let isUsingUploadedSong = false;
// Predefined color palette for the visual elements
const palette = [
  '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900',
  '#FF4E50', '#F9D423', '#EDE574', '#A8E6CF', '#DCEDC1',
  '#FFD3B6', '#FFAAA5', '#FF8B94', '#F67280', '#355C7D',
  '#C0D6DF', '#E5FCC2', '#9DE0AD', '#45ADA8', '#547980'
];
// Arrays to store various properties for visual elements
let colors = []; // Stores colors for circles
let deviations = []; // Stores deviations for circle placement
let coordinates = []; // Stores x,y coordinates for circle placement

// Preload the default song
function preload() {
  song = loadSound("assets/DEMO-fallin flower.mp3");
}

// Set up the canvas, audio analysis tools, and UI elements
function setup() {
  createCanvas(size, canvasHeight);
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
  // Create buttons for audio source interaction
  micButton = createButton('Use Microphone');
  micButton.mousePressed(enableMic);
  defaultSongButton = createButton('Play Default Song');
  defaultSongButton.mousePressed(playDefaultSong);
  uploadedSongButton = createButton('Play Uploaded Song');
  uploadedSongButton.mousePressed(playUploadedSong);
  // Disable buttons initially
  micButton.attribute('disabled', '');
  uploadedSongButton.attribute('disabled', '');
  // Adjust the button positions based on the new canvas height
  fileInput.position(10, canvasHeight - 30);
  micButton.position(10, canvasHeight - 60);
  defaultSongButton.position(125, canvasHeight - 60);
  uploadedSongButton.position(250, canvasHeight - 60);
}

// Enable the microphone as the audio source
function enableMic() {
  if (uploadedSong) {
    uploadedSong.stop();
  }
  song.stop();
  mic.start();
  fft.setInput(mic);
  isUsingMic = true;
  isUsingUploadedSong = false;
  displayPlaybackMode("Microphone", true);
}

// Play the default song
function playDefaultSong() {
  if (uploadedSong) {
    uploadedSong.stop();
  }
  mic.stop();
  song.play();
  fft.setInput(song);
  isUsingMic = false;
  isUsingUploadedSong = false;
  displayPlaybackMode("Default Song", true);
}

// Play the uploaded song
function playUploadedSong() {
  if (uploadedSong) {
    mic.stop();
    song.stop();
    uploadedSong.play();
    fft.setInput(uploadedSong);
    isUsingMic = false;
    isUsingUploadedSong = true;
    displayPlaybackMode("Uploaded Song", true);
  } else {
    console.error("No song uploaded.");
  }
}

// Handle mousePressed for toggling default song playback
function mousePressed() {
  if (!isUsingMic && !isUsingUploadedSong) {
    // Toggles default song playback
    if (song.isPlaying()) {
      song.stop();
    } else {
      song.play();
    }
  }
}

// Display start instructions on the canvas
function displayStartInstructions() {
  background(50);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Click to start the audio', width / 2, height / 2 - 50);
  textSize(16);
  text('The visualizer will react to the music!', width / 2, height / 2);
  textSize(12);
  text('(Ensure "DEMO-fallin flower.mp3" is in the project directory)', width / 2, height / 2 + 20);

  // Add interaction text based on the state
  if (isUsingMic) {
    text('Microphone is enabled. Start making some noise!', width / 2, height / 2 + 40);
  } else if (isUsingUploadedSong) {
    text('Play an uploaded song by selecting a file.', width / 2, height / 2 + 40);
  } else {
    text('Click to start the default song.', width / 2, height / 2 + 40);
  }
}

// Function to handle the uploaded file, modified to enable the uploadedSongButton
function handleFile(file) {
  if (file.type === 'audio') {
    if (uploadedSong) {
      uploadedSong.stop();
    }
    uploadedSong = loadSound(file.data, () => {
      uploadedSongButton.removeAttribute('disabled');
    });
  } else {
    console.error("This file type is not supported.");
  }
}

// Function to display the current playback mode on the canvas
function displayPlaybackMode(mode, isPlaying) {
  // Set background color based on whether the song is playing
  let bgColor = isPlaying ? [3, 79, 129] : [50, 50, 50];
  background(bgColor);
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
  // Update button states based on the current mode
  if (mode === "Microphone") {
    micButton.attribute('disabled', '');
    defaultSongButton.removeAttribute('disabled');
    uploadedSongButton.removeAttribute('disabled');
  } else if (mode === "Default Song") {
    micButton.removeAttribute('disabled');
    defaultSongButton.attribute('disabled', '');
    uploadedSongButton.removeAttribute('disabled');
  } else if (mode === "Uploaded Song") {
    micButton.removeAttribute('disabled');
    defaultSongButton.removeAttribute('disabled');
    uploadedSongButton.attribute('disabled', '');
  }
}

// Render loop for the visuals
function draw() {
  if (getAudioContext().state !== 'running') {
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

// Function to draw an individual circle with audio-reactive visual elements
function drawCircle(x, y, index, mapbass, scaleTreble, mapMid) {
  console.log(Math.abs(Math.round(mapMid / 10)))
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
    stroke(color(colors[index * 10 + i + 1 + Math.abs(Math.round(mapMid / 10))]));
    strokeWeight(10);
    ellipse(x, y, (i + 1) * (15 + mapMid / 20) + deviations[i], (i + 1) * (15 + mapMid / 20) + +deviations[i + 1])
  }
  translate(x, y);
  // Draw the serration line in the middle of every four circles
  if (index % 4 === 0) {
    circleLine(color(colors[index * 10 + 10]))
  } else {
    // Draw dashed circle
    for (let i = 0; i < 4; i++) {
      stroke(color(colors[index * 10 + 10 + Math.round(mapbass / 10)]));
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
  for (let i = 0; i < steps; i++) {
    // Decide whether to beginShape or endShape
    let curDashed = (i % dashPeriod) < dashWidth;
    if (curDashed && !lastDashed) {
      beginShape();
    }
    if (!curDashed && lastDashed) {
      endShape();
    }
    // Draw vertex by calculate result
    if (curDashed) {
      let theta = map(i, 0, steps, 0, TWO_PI);
      vertex(cos(theta) * radius, sin(theta) * radius);
    }
    lastDashed = curDashed;
  }
  if (lastDashed) {
    endShape();
  }
}

// Function to draw a line with serration effect
function circleLine(color) {
  stroke(color)
  strokeWeight(3);
  // initialize small/large circle points array
  let smallCirclePoints = [
    [65, 0]
  ];
  let largeCirclePoints = [
    [132, 0]
  ];
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
  rotate(Math.PI * 2 / 90);
  stroke(236, 65, 87);
  bezier(0, 0, -currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius, currentRadius / ratio, currentRadius);
}