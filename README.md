# 3D Solar System

An interactive 3D visualization of our solar system built with Three.js, featuring realistic planet models, informative details, and immersive audio.

![3D Solar System Screenshot](https://i.imgur.com/example.png)

## 🌟 Features

- **Realistic 3D Models**: Accurate representation of all planets in our solar system with proper scaling and textures
- **Interactive Information**: Click on any planet to view detailed information about its physical characteristics, composition, orbit, and interesting facts
- **Immersive Audio**: Background space ambience and narration for each celestial body
- **Camera Controls**: Multiple viewing angles and the ability to freely explore the solar system
- **Visual Effects**: Bloom effect for the sun, particle systems for stars, and custom shaders
- **Responsive Design**: Works on both desktop and mobile devices

## 🚀 Live Demo

Check out the live demo: [3D Solar System](https://fascinating-trifle-6729e5.netlify.app/)

## 🛠️ Technologies Used

- [Three.js](https://threejs.org/) - 3D library for rendering
- [Vite](https://vitejs.dev/) - Build tool and development server
- [GSAP](https://greensock.com/gsap/) - Animation library
- [CSS2DRenderer](https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer) - For HTML labels in 3D space
- [lil-gui](https://lil-gui.georgealways.com/) - For debug controls
- Web Audio API - For procedural space sounds

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/3d-solar-system.git
   cd 3d-solar-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory, ready to be deployed.

## 🚀 Deployment

The project can be easily deployed to platforms like Netlify, Vercel, or GitHub Pages.

### Deploying to Netlify

1. Build your project: `npm run build`
2. Drag and drop your `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Your site will be live in seconds!

## 🎮 Controls

- **Left Mouse Button + Drag**: Rotate the camera
- **Right Mouse Button + Drag**: Pan the camera
- **Scroll Wheel**: Zoom in/out
- **Click on a Planet**: View detailed information
- **Camera Presets**: Use the buttons in the top-right corner to switch between different views
- **Time Controls**: Pause/resume the simulation or adjust the speed
- **Audio Toggle**: Turn the sound on/off

## 🌌 Planet Information

Each planet includes detailed information about:
- Physical characteristics (diameter, mass, temperature)
- Composition
- Orbit and rotation details
- Atmosphere (where applicable)
- Interesting scientific facts

## 🎵 Audio Features

- **Space Ambience**: Procedurally generated background sounds create an immersive space environment
- **Planet Narrations**: Educational audio descriptions play when viewing planet details
- **Audio Controls**: Toggle sound on/off with the audio button

## 🧩 Project Structure

```
3d-solar-system/
├── public/              # Static assets
│   └── audio/           # Audio files
├── src/                 # Source files
│   ├── style.css        # Main stylesheet
│   ├── main.js          # Main application code
│   └── spaceAmbience.js # Procedural audio generation
├── index.html           # Entry HTML file
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

## 🔍 Future Improvements

- Add more moons and smaller celestial bodies
- Implement asteroid belt visualization
- Add spacecraft models and historical mission paths
- Create a timeline feature to show planetary positions at different dates
- Add more educational content and quizzes

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Planet textures from [Solar System Scope](https://www.solarsystemscope.com/)
- Three.js community for examples and documentation
- [NASA](https://www.nasa.gov/) for planetary data and information

## 👤 Author

Your Name - [Your LinkedIn](https://linkedin.com/in/yourprofile) - your.email@example.com

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/3d-solar-system/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
