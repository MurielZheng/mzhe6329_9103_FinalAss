# mzhe6329_9103_FinalAss
The default song - "Noel" is pruduced and composed by Muriel Zheng.

# Audio Visualizer

This project contains a p5.js-based audio visualizer that creates a dynamic visual representation of a playing audio
track using the Fast Fourier Transform (FFT) algorithm.

## Features

- Dynamic canvas resizing based on window inner height.
- FFT analysis for real-time audio visualization.
- Audio input selection from a default song, microphone, or an uploaded file.
- A pre-defined color palette for visual elements.
- Responsive buttons for controlling audio input sources.
- Customizable audio-reactive visual elements that react to different frequency bands.

## Setup

Before running the visualizer, ensure you have the following file in your project directory:

- `assets/Noel.mp3`: The default song that plays when the visualizer starts.

To initialize the visualizer, simply open the HTML file that includes this script.

## Interactive Components

- **Audio Source Selection**: Choose between using a default song, microphone input, or an uploaded song file.
- **File Input**: Upload your own song file for visualization.
- **Playback Controls**: Play or pause the current audio source by interacting with the on-screen buttons or clicking on
the visualizer canvas.

## Instructions

1. **Starting the Visualizer**: Click anywhere on the canvas to start the audio.
2. **Changing Audio Input**: Use the respective buttons to toggle between the default song, microphone, and uploaded
song.

- **Microphone**: Enable real-time audio visualization using your device's microphone.
- **Default Song**: Play the pre-loaded song and visualize its frequencies.
- **Uploaded Song**: Select and visualize a song from your local files.

3. **Visualization Elements**:
- Circles and ellipses represent different frequency bands (bass, mid, treble).
- Colors and sizes change dynamically based on the audio's frequency and amplitude.

## Audio Analysis

- The visualizer uses FFT to analyze frequencies within the audio signal.
- Visual elements on the canvas will change in size and color based on the audio's bass, midrange, and treble
frequencies.

## Developer Notes

- The visualizer requires a browser with support for the Web Audio API.
- It is essential for the microphone access to be granted by the user if microphone input is selected.

## Code Structure

The project is structured as follows:

- `index.html`: The entry point of the application that includes the visualizer canvas.
- `sketch.js`: The p5.js sketch file where the main visualizer functions are drawn.
- `audio.js`: Handles audio input and processing using the p5.js sound library.
- `styles/`: Contains CSS files for styling the application.
- `lib/`: Includes all the required p5.js libraries and other third-party plugins.

## Libraries and Frameworks

- [p5.js](https://p5js.org/) - A client-side library for creating graphic and interactive experiences.
- [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) - An addon for p5.js that enables web audio functionality.

## License

This project is licensed under the [MIT License](LICENSE.txt) - see the LICENSE file for details.

# Wheels of Fortune by Pacita Abad

This repository is dedicated to the study and analysis of "Wheels of Fortune," a vibrant work by the renowned Filipino
artist Pacita Abad (1946-2004). Known for her colorful, layered approach that incorporates various forms and techniques,
Abad's art provides a deep reflection on society, culture, and personal experiences.

## Artwork Overview

"Wheels of Fortune" is an exemplary representation of Abad's style, characterized by bright colors and complex geometric
shapes. It portrays a series of circles that vary in size, shape, and color, symbolizing the ever-turning wheel of fate
that represents life's highs and lows, opportunities, and challenges.

### Interpretation

- **Visual Impact:** The artwork uses overlapping circles and varying colors to depict life's complexity and diversity.
- **Symbolism:** Each circle may represent an individual destiny, interconnected, influencing each other, and forming a
complex network.
- **Message:** The artwork is imbued with vitality, conveying that life is colorful, variable, and should be cherished.

## Cultural Significance

### Aboriginal Art Influence
- **Technique:** The stippling and circular patterns are reminiscent of those found in Australian Aboriginal art.
- **Meaning:** The radiating colors and patterns from the center of each circle are akin to Dreamtime stories, where
each pattern could represent a narrative or geographic feature.

### Modern Digital Art Influence
- **Design:** The artwork's color choices and layout may have drawn inspiration from modern digital art, evidenced by
the use of gradients and contrasting colors.

## Audio Visualization

The associated music visualizer's development is influenced by various technical resources and artistic considerations:

### Technical Components

- **FFT Analysis:** Utilizes the `p5.FFT()` object from the p5.js sound library to analyze the audio signal's frequency
spectrum.
- **Audio Input:** Implements live audio capture through the `p5.AudioIn()` object as per p5.js documentation.

### Visual Aesthetics

- **Color Palette:** Adopts a predefined color palette influenced by the aesthetic principles found in Kuler's color
theory guide.

### Learning Resources

- **The Coding Train:** Follows guidance from Daniel Shiffman's tutorials on YouTube, with a focus on sound
visualization series.

## Resources

- Pacita Abad's Artwork: [Pinterest Link 1](https://pin.it/2RnNj61)
- Modern Digital Art Inspiration: [Pinterest Link 2](https://pin.it/4yCoval)

## Acknowledgments

This project would not have been possible without the various resources and inspirations that have shaped its
development, from the intricate art of Pacita Abad to the educational tutorials by Daniel Shiffman.