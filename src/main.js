import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import gsap from 'gsap';
import { createSpaceAmbience } from './spaceAmbience.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 30, 80);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('scene-container').appendChild(renderer.domElement);

// CSS2D Renderer for labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.getElementById('scene-container').appendChild(labelRenderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 20;
controls.maxDistance = 200;

// Set initial camera position to see the whole solar system
camera.position.set(0, 60, 120);

// Bloom effect for sun glow
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  2.0,  // strength
  0.6,  // radius
  0.1  // threshold - lower threshold makes the sun glow more
);

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Planet data
const planetData = [
  {
    name: 'Sun',
    radius: 8,
    color: 0xffdd00,
    position: { x: 0, y: 0, z: 0 },
    rotationSpeed: 0.001,
    type: 'Star',
    age: '4.6 billion years',
    distance: '0 AU (center of the solar system)',
    description: 'The Sun is the star at the center of the Solar System.',
    audioNarration: 'sun.mp3',
    detailedInfo: {
      composition: 'Hydrogen (73%), Helium (25%), Other elements (2%)',
      diameter: '1,392,700 km (109 times Earth)',
      mass: '1.989 × 10^30 kg (333,000 times Earth)',
      surfaceTemp: '5,500°C (surface), 15,000,000°C (core)',
      rotationPeriod: '25-35 days (varies by latitude)',
      facts: [
        'The Sun accounts for 99.86% of the mass in the solar system',
        'Over one million Earths could fit inside the Sun',
        'The Sun is a G-type main-sequence star (G2V)',
        'Light from the Sun takes about 8 minutes to reach Earth',
        'The Sun converts 600 million tons of hydrogen into helium every second'
      ]
    }
  },
  {
    name: 'Mercury',
    radius: 0.8,
    color: 0xa9a9a9,
    position: { x: 14, y: 0, z: 0 },
    orbitRadius: 14,
    orbitSpeed: 0.0012,
    rotationSpeed: 0.0005,
    type: 'Terrestrial planet',
    age: '4.5 billion years',
    distance: '0.39 AU from the Sun',
    description: 'Mercury is the smallest and innermost planet in the Solar System.',
    audioNarration: 'mercury.mp3',
    detailedInfo: {
      composition: 'Iron core (70%), Silicate crust (30%)',
      diameter: '4,879 km (0.38 times Earth)',
      mass: '3.3011 × 10^23 kg (0.055 times Earth)',
      surfaceTemp: '-173°C to 427°C (extreme temperature variation)',
      atmosphere: 'Minimal - Oxygen, Sodium, Hydrogen, Helium, Potassium (trace)',
      orbitalPeriod: '88 Earth days',
      rotationPeriod: '58.6 Earth days',
      facts: [
        'Mercury has no moons',
        'Mercury has a highly elliptical orbit',
        'Mercury has the most cratered surface in the solar system',
        'Despite being closest to the Sun, Venus is hotter due to Mercury\'s lack of atmosphere',
        'Mercury has a magnetic field, but it\'s only about 1% as strong as Earth\'s'
      ]
    }
  },
  {
    name: 'Venus',
    radius: 1.5,
    color: 0xe6e6fa,
    position: { x: 20, y: 0, z: 0 },
    orbitRadius: 20,
    orbitSpeed: 0.0009,
    rotationSpeed: 0.0002,
    type: 'Terrestrial planet',
    age: '4.5 billion years',
    distance: '0.72 AU from the Sun',
    description: 'Venus is the second planet from the Sun and the hottest planet in our solar system.',
    audioNarration: 'venus.mp3',
    detailedInfo: {
      composition: 'Iron core, Silicate mantle, Basaltic crust',
      diameter: '12,104 km (0.95 times Earth)',
      mass: '4.8675 × 10^24 kg (0.815 times Earth)',
      surfaceTemp: '462°C (hot enough to melt lead)',
      atmosphere: 'Carbon dioxide (96%), Nitrogen (3.5%), Sulfuric acid clouds',
      pressure: '92 times Earth\'s atmospheric pressure',
      orbitalPeriod: '225 Earth days',
      rotationPeriod: '243 Earth days (retrograde rotation)',
      facts: [
        'Venus rotates backwards compared to other planets',
        'A day on Venus is longer than its year',
        'Venus has no moons',
        'Venus is the brightest natural object in Earth\'s night sky after the Moon',
        'Venus has over 1,600 major volcanoes'
      ]
    }
  },
  {
    name: 'Earth',
    radius: 1.6,
    color: 0x6b93d6,
    position: { x: 28, y: 0, z: 0 },
    orbitRadius: 28,
    orbitSpeed: 0.0007,
    rotationSpeed: 0.001,
    type: 'Terrestrial planet',
    age: '4.54 billion years',
    distance: '1 AU from the Sun',
    description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
    audioNarration: 'earth.mp3',
    detailedInfo: {
      composition: 'Iron-nickel core, Silicate mantle, Crust (continental and oceanic)',
      diameter: '12,742 km',
      mass: '5.97237 × 10^24 kg',
      surfaceTemp: '-88°C to 58°C (average: 15°C)',
      atmosphere: 'Nitrogen (78%), Oxygen (21%), Argon, Carbon dioxide, Water vapor',
      water: '71% of surface covered by liquid water oceans',
      orbitalPeriod: '365.25 days',
      rotationPeriod: '23.93 hours',
      facts: [
        'Earth is the only planet not named after a god',
        'Earth has one natural satellite - the Moon',
        'Earth\'s magnetic field protects us from harmful solar radiation',
        'Earth is the densest planet in the Solar System',
        'Earth is approximately 4.54 billion years old'
      ]
    }
  },
  {
    name: 'Mars',
    radius: 1.2,
    color: 0xc1440e,
    position: { x: 35, y: 0, z: 0 },
    orbitRadius: 35,
    orbitSpeed: 0.0005,
    rotationSpeed: 0.0009,
    type: 'Terrestrial planet',
    age: '4.6 billion years',
    distance: '1.52 AU from the Sun',
    description: 'Mars is the fourth planet from the Sun and the second-smallest planet in the Solar System.',
    audioNarration: 'mars.mp3',
    detailedInfo: {
      composition: 'Iron, nickel and sulfur core, Silicate mantle, Basaltic crust',
      diameter: '6,779 km (0.53 times Earth)',
      mass: '6.4171 × 10^23 kg (0.107 times Earth)',
      surfaceTemp: '-153°C to 20°C',
      atmosphere: 'Carbon dioxide (95%), Nitrogen (2.7%), Argon (1.6%)',
      pressure: '0.6% of Earth\'s atmospheric pressure',
      orbitalPeriod: '687 Earth days',
      rotationPeriod: '24.6 hours',
      facts: [
        'Mars has two small moons: Phobos and Deimos',
        'Mars has the largest volcano in the solar system - Olympus Mons',
        'Mars has the longest canyon in the solar system - Valles Marineris',
        'Mars has polar ice caps made of water and carbon dioxide ice',
        'Mars has seasons similar to Earth due to its axial tilt'
      ]
    }
  },
  {
    name: 'Jupiter',
    radius: 3.5,
    color: 0xd8ca9d,
    position: { x: 45, y: 0, z: 0 },
    orbitRadius: 45,
    orbitSpeed: 0.0003,
    rotationSpeed: 0.002,
    type: 'Gas giant',
    age: '4.6 billion years',
    distance: '5.2 AU from the Sun',
    description: 'Jupiter is the fifth planet from the Sun and the largest in the Solar System.',
    audioNarration: 'jupiter.mp3',
    detailedInfo: {
      composition: 'Hydrogen (90%), Helium (10%), traces of methane, water, ammonia',
      diameter: '139,820 km (11 times Earth)',
      mass: '1.8982 × 10^27 kg (318 times Earth)',
      coreTemp: 'Estimated 24,000°C',
      atmosphere: 'Thick, with bands of clouds and the Great Red Spot',
      orbitalPeriod: '11.86 Earth years',
      rotationPeriod: '9.93 hours (fastest rotating planet)',
      facts: [
        'Jupiter has at least 79 moons, including the four large Galilean moons',
        'Jupiter\'s Great Red Spot is a storm that has been raging for at least 400 years',
        'Jupiter has a faint ring system',
        'Jupiter\'s magnetic field is 14 times stronger than Earth\'s',
        'Jupiter emits more energy than it receives from the Sun'
      ]
    }
  },
  {
    name: 'Saturn',
    radius: 3,
    color: 0xead6b8,
    position: { x: 58, y: 0, z: 0 },
    orbitRadius: 58,
    orbitSpeed: 0.00022,
    rotationSpeed: 0.0018,
    type: 'Gas giant',
    age: '4.5 billion years',
    distance: '9.5 AU from the Sun',
    description: 'Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter.',
    audioNarration: 'saturn.mp3',
    hasRings: true,
    ringColor: 0xc5b358,
    detailedInfo: {
      composition: 'Hydrogen (96%), Helium (3%), traces of methane, ammonia, water',
      diameter: '116,460 km (9.1 times Earth)',
      mass: '5.6834 × 10^26 kg (95 times Earth)',
      surfaceTemp: '-178°C (cloud tops)',
      rings: 'Made of ice particles, rock debris, and dust; extend up to 282,000 km from the planet',
      orbitalPeriod: '29.45 Earth years',
      rotationPeriod: '10.7 hours',
      facts: [
        'Saturn has at least 82 moons, including Titan, the second-largest moon in the solar system',
        'Saturn\'s rings are made mostly of water ice',
        'Saturn is the least dense planet in the solar system - it would float in water',
        'Saturn has hexagonal cloud patterns at its north pole',
        'The Cassini division is the largest gap in Saturn\'s rings'
      ]
    }
  },
  {
    name: 'Uranus',
    radius: 2.5,
    color: 0xb5e3e0,
    position: { x: 72, y: 0, z: 0 },
    orbitRadius: 72,
    orbitSpeed: 0.00015,
    rotationSpeed: 0.001,
    type: 'Ice giant',
    age: '4.5 billion years',
    distance: '19.8 AU from the Sun',
    description: 'Uranus is the seventh planet from the Sun and has the third-largest diameter in our solar system.',
    audioNarration: 'uranus.mp3',
    detailedInfo: {
      composition: 'Hydrogen, Helium, Methane (gives blue color), Water, Ammonia, "icy" materials',
      diameter: '50,724 km (4 times Earth)',
      mass: '8.6810 × 10^25 kg (14.5 times Earth)',
      surfaceTemp: '-224°C',
      atmosphere: 'Hydrogen (83%), Helium (15%), Methane (2%)',
      orbitalPeriod: '84 Earth years',
      rotationPeriod: '17.2 hours (retrograde rotation)',
      facts: [
        'Uranus rotates on its side with an axial tilt of 98 degrees',
        'Uranus has 27 known moons, named after characters from Shakespeare and Pope',
        'Uranus has 13 faint rings',
        'Uranus is the coldest planet in the solar system despite not being the farthest from the Sun',
        'Uranus was the first planet discovered using a telescope'
      ]
    }
  },
  {
    name: 'Neptune',
    radius: 2.3,
    color: 0x3f31b0,
    position: { x: 85, y: 0, z: 0 },
    orbitRadius: 85,
    orbitSpeed: 0.0001,
    rotationSpeed: 0.001,
    type: 'Ice giant',
    age: '4.5 billion years',
    distance: '30.1 AU from the Sun',
    description: 'Neptune is the eighth and farthest-known planet from the Sun in the Solar System.',
    audioNarration: 'neptune.mp3',
    detailedInfo: {
      composition: 'Hydrogen, Helium, Methane (gives blue color), Water, Ammonia, "icy" materials',
      diameter: '49,244 km (3.9 times Earth)',
      mass: '1.02413 × 10^26 kg (17 times Earth)',
      surfaceTemp: '-214°C',
      atmosphere: 'Hydrogen (80%), Helium (19%), Methane (1%)',
      orbitalPeriod: '165 Earth years',
      rotationPeriod: '16.1 hours',
      facts: [
        'Neptune has the strongest winds in the solar system, reaching 2,100 km/h',
        'Neptune has 14 known moons, the largest being Triton',
        'Neptune has 5 main rings and 4 ring arcs',
        'Neptune was mathematically predicted before it was observed',
        'Neptune has only been visited by one spacecraft - Voyager 2 in 1989'
      ]
    }
  }
];

// Create textures
const textureLoader = new THREE.TextureLoader();

// We'll use colors instead of textures to avoid loading issues
const defaultTexture = null;

// Moon data
const moonData = [
  {
    name: "Moon",
    parentPlanet: "Earth",
    radius: 0.4,
    color: 0xcccccc,
    orbitRadius: 3,
    orbitSpeed: 0.015,
    rotationSpeed: 0.001
  },
  {
    name: "Phobos",
    parentPlanet: "Mars",
    radius: 0.15,
    color: 0x9a9a9a,
    orbitRadius: 2,
    orbitSpeed: 0.02,
    rotationSpeed: 0.001
  },
  {
    name: "Deimos",
    parentPlanet: "Mars",
    radius: 0.1,
    color: 0x8a8a8a,
    orbitRadius: 2.8,
    orbitSpeed: 0.015,
    rotationSpeed: 0.001
  },
  {
    name: "Io",
    parentPlanet: "Jupiter",
    radius: 0.4,
    color: 0xf9db62,
    orbitRadius: 4.5,
    orbitSpeed: 0.025,
    rotationSpeed: 0.001
  },
  {
    name: "Europa",
    parentPlanet: "Jupiter",
    radius: 0.35,
    color: 0xd6c9a2,
    orbitRadius: 5.5,
    orbitSpeed: 0.02,
    rotationSpeed: 0.001
  },
  {
    name: "Ganymede",
    parentPlanet: "Jupiter",
    radius: 0.5,
    color: 0xa79d87,
    orbitRadius: 6.5,
    orbitSpeed: 0.015,
    rotationSpeed: 0.001
  },
  {
    name: "Callisto",
    parentPlanet: "Jupiter",
    radius: 0.45,
    color: 0x5a5a5a,
    orbitRadius: 7.5,
    orbitSpeed: 0.01,
    rotationSpeed: 0.001
  },
  {
    name: "Titan",
    parentPlanet: "Saturn",
    radius: 0.5,
    color: 0xfad6a5,
    orbitRadius: 5,
    orbitSpeed: 0.01,
    rotationSpeed: 0.001
  },
  {
    name: "Enceladus",
    parentPlanet: "Saturn",
    radius: 0.2,
    color: 0xffffff,
    orbitRadius: 3.5,
    orbitSpeed: 0.02,
    rotationSpeed: 0.001
  },
  {
    name: "Triton",
    parentPlanet: "Neptune",
    radius: 0.4,
    color: 0xd1e7e7,
    orbitRadius: 4,
    orbitSpeed: 0.015,
    rotationSpeed: 0.001
  }
];

// Create planets
const planets = [];
const moons = [];
const orbitLines = [];
const planetMeshes = {};
const moonMeshes = {};

// Create sun with glow effect
const sunGeometry = new THREE.SphereGeometry(planetData[0].radius, 64, 64);
const sunMaterial = new THREE.MeshBasicMaterial({
  color: planetData[0].color,
  emissive: planetData[0].color,
  emissiveIntensity: 1
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.name = "Sun"; // Add name to the sun mesh
console.log("Created Sun mesh:", sun);
scene.add(sun);
planetMeshes['Sun'] = sun;

// Create sun light
const sunLight = new THREE.PointLight(0xffffff, 2, 200);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Add a sun label
const sunDiv = document.createElement('div');
sunDiv.className = 'planet-label';
sunDiv.textContent = 'Sun';
const sunLabel = new CSS2DObject(sunDiv);
sunLabel.position.set(0, planetData[0].radius + 1, 0);
sun.add(sunLabel);

// Create planets and orbit lines
for (let i = 1; i < planetData.length; i++) {
  const planet = planetData[i];

  // Create planet
  const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);

  let material;
  let mesh;

  // Special case for Earth - using colors instead of textures
  if (planet.name === 'Earth') {
    // Create Earth with blue/green color
    material = new THREE.MeshStandardMaterial({
      color: 0x1a66ff,  // Blue color for Earth
      metalness: 0.1,
      roughness: 0.7,
      emissive: 0x0a3d99,
      emissiveIntensity: 0.2
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Earth"; // Add a name to the Earth mesh for easier identification

    console.log("Created Earth mesh:", mesh);

    // Add a simple pattern to simulate continents
    const continentsGeometry = new THREE.SphereGeometry(planet.radius + 0.01, 32, 32);
    const continentsMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d862d,  // Green color for continents
      metalness: 0.1,
      roughness: 0.8,
      transparent: true,
      opacity: 0.7
    });

    // Only cover part of the sphere with "continents"
    for (let i = 0; i < continentsGeometry.attributes.position.count; i++) {
      const x = continentsGeometry.attributes.position.getX(i);
      const y = continentsGeometry.attributes.position.getY(i);
      const z = continentsGeometry.attributes.position.getZ(i);

      // Create a pattern that looks somewhat like continents
      const noise = Math.sin(5 * x) * Math.cos(5 * y) * Math.sin(5 * z);

      if (noise < 0) {
        // Set this vertex to be transparent (no continent)
        if (continentsGeometry.attributes.color === undefined) {
          continentsGeometry.setAttribute('color', new THREE.BufferAttribute(
            new Float32Array(continentsGeometry.attributes.position.count * 4), 4
          ));
        }
        continentsGeometry.attributes.color.setXYZW(i, 0, 0, 0, 0);
      }
    }

    const continentsMesh = new THREE.Mesh(continentsGeometry, continentsMaterial);
    continentsMesh.name = "EarthContinents"; // Add name to the continents mesh
    mesh.add(continentsMesh);
    console.log("Added continents to Earth:", continentsMesh);

  } else {
    // Regular planet material
    material = new THREE.MeshStandardMaterial({
      color: planet.color,
      metalness: 0.2,
      roughness: 0.7,
      emissive: planet.color,
      emissiveIntensity: 0.1
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.name = planet.name; // Add name to the mesh for easier identification
    console.log(`Created ${planet.name} mesh:`, mesh);
  }

  mesh.position.set(planet.position.x, planet.position.y, planet.position.z);
  scene.add(mesh);
  planets.push(mesh);
  planetMeshes[planet.name] = mesh;

  // Create orbit line
  const orbitGeometry = new THREE.RingGeometry(planet.orbitRadius - 0.1, planet.orbitRadius + 0.1, 128);
  const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0x666666,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitLine.rotation.x = Math.PI / 2;
  scene.add(orbitLine);
  orbitLines.push(orbitLine);

  // Create Saturn's rings if applicable
  if (planet.hasRings) {
    const ringGeometry = new THREE.RingGeometry(planet.radius + 0.5, planet.radius + 2.5, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: planet.ringColor || 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    mesh.add(ring);
  }

  // Create planet label
  const planetDiv = document.createElement('div');
  planetDiv.className = 'planet-label';
  planetDiv.textContent = planet.name;
  const planetLabel = new CSS2DObject(planetDiv);
  planetLabel.position.set(0, planet.radius + 0.5, 0);
  mesh.add(planetLabel);
}

// Create moons
moonData.forEach(moon => {
  // Find parent planet
  const parentPlanet = planetMeshes[moon.parentPlanet];

  if (parentPlanet) {
    // Create moon
    const moonGeometry = new THREE.SphereGeometry(moon.radius, 16, 16);
    const moonMaterial = new THREE.MeshStandardMaterial({
      color: moon.color,
      metalness: 0.1,
      roughness: 0.8
    });

    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

    // Create moon orbit container (this will be added to the planet)
    const moonOrbit = new THREE.Object3D();
    parentPlanet.add(moonOrbit);

    // Position moon in its orbit
    moonMesh.position.set(moon.orbitRadius, 0, 0);
    moonOrbit.add(moonMesh);

    // Add to moons array for animation
    moons.push({
      mesh: moonMesh,
      orbit: moonOrbit,
      data: moon
    });

    moonMeshes[moon.name] = moonMesh;

    // Create moon label
    const moonDiv = document.createElement('div');
    moonDiv.className = 'moon-label';
    moonDiv.textContent = moon.name;
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(0, moon.radius + 0.2, 0);
    moonMesh.add(moonLabel);

    // Create moon orbit line
    const moonOrbitGeometry = new THREE.RingGeometry(moon.orbitRadius - 0.03, moon.orbitRadius + 0.03, 64);
    const moonOrbitMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    const moonOrbitLine = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
    moonOrbitLine.rotation.x = Math.PI / 2;
    parentPlanet.add(moonOrbitLine);
  }
});

// Create star field background
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    transparent: true,
    opacity: 0.8
  });

  const starsVertices = [];
  for (let i = 0; i < 8000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
  }

  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);

  // Add some colored stars for variety
  const coloredStarsGeometry = new THREE.BufferGeometry();
  const coloredStarsMaterial = new THREE.PointsMaterial({
    color: 0xaaccff,
    size: 0.3,
    transparent: true,
    opacity: 0.8
  });

  const coloredStarsVertices = [];
  for (let i = 0; i < 1000; i++) {
    const x = (Math.random() - 0.5) * 1500;
    const y = (Math.random() - 0.5) * 1500;
    const z = (Math.random() - 0.5) * 1500;
    coloredStarsVertices.push(x, y, z);
  }

  coloredStarsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(coloredStarsVertices, 3));
  const coloredStars = new THREE.Points(coloredStarsGeometry, coloredStarsMaterial);
  scene.add(coloredStars);
}

createStars();

// Audio setup
let audioContext;
let audioElements = {};
let currentAudio = null;
let isAudioEnabled = true;
let spaceAmbience; // Space ambient sound

function setupAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create empty audio elements object but don't try to create actual audio elements
  // This avoids the "NotSupportedError: The element has no supported sources" error
  audioElements = {};

  // Create space ambient sound
  spaceAmbience = createSpaceAmbience(audioContext);

  // Audio toggle button
  const toggleAudioBtn = document.getElementById('toggle-audio');
  toggleAudioBtn.addEventListener('click', () => {
    isAudioEnabled = !isAudioEnabled;
    toggleAudioBtn.textContent = isAudioEnabled ? '🔊' : '🔇';

    // Toggle space ambience volume
    spaceAmbience.setVolume(isAudioEnabled ? 0.15 : 0);

    if (currentAudio && !isAudioEnabled) {
      currentAudio.pause();
      resumeOrbits();
    }
  });
}

// Planet popup creation
function createPlanetPopup() {
  const popup = document.createElement('div');
  popup.className = 'planet-popup';
  popup.innerHTML = `
    <h3>Planet Name</h3>
    <p><strong>Type:</strong> <span class="planet-type"></span></p>
    <p><strong>Age:</strong> <span class="planet-age"></span></p>
    <p><strong>Distance:</strong> <span class="planet-distance"></span></p>
    <p class="planet-description"></p>
  `;
  document.getElementById('app').appendChild(popup);
  return popup;
}

const planetPopup = createPlanetPopup();

// Setup detailed info panel
function setupDetailedInfoPanel() {
  const detailedInfoPanel = document.getElementById('detailed-info-panel');
  const closeButton = document.getElementById('close-panel');

  // Close panel when close button is clicked
  closeButton.addEventListener('click', () => {
    console.log("Close button clicked");
    detailedInfoPanel.classList.add('hidden');

    // Reset all planet scales
    Object.values(planetMeshes).forEach(planet => {
      gsap.to(planet.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.5,
        ease: 'power2.in'
      });
    });

    resumeOrbits();
  });

  // Close panel when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target === detailedInfoPanel) {
      console.log("Clicked outside panel");
      detailedInfoPanel.classList.add('hidden');

      // Reset all planet scales
      Object.values(planetMeshes).forEach(planet => {
        gsap.to(planet.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: 'power2.in'
        });
      });

      resumeOrbits();
    }
  });

  // Close panel with Escape key
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      console.log("Escape key pressed");
      detailedInfoPanel.classList.add('hidden');

      // Reset all planet scales
      Object.values(planetMeshes).forEach(planet => {
        gsap.to(planet.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          ease: 'power2.in'
        });
      });

      resumeOrbits();
    }
  });
}

// Interaction
let isPaused = false;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let timeScale = 1.0; // Time scale factor

function pauseOrbits() {
  isPaused = true;
  document.getElementById('pause-play').textContent = '▶️';
}

function resumeOrbits() {
  isPaused = false;
  document.getElementById('pause-play').textContent = '⏸️';
}

function setupTimeControls() {
  const pausePlayBtn = document.getElementById('pause-play');
  const speedDownBtn = document.getElementById('speed-down');
  const speedUpBtn = document.getElementById('speed-up');
  const speedIndicator = document.getElementById('speed-indicator');

  // Pause/Play button
  pausePlayBtn.addEventListener('click', () => {
    if (isPaused) {
      resumeOrbits();
    } else {
      pauseOrbits();
    }
  });

  // Speed down button
  speedDownBtn.addEventListener('click', () => {
    if (timeScale > 0.25) {
      timeScale -= 0.25;
      updateSpeedIndicator();
    }
  });

  // Speed up button
  speedUpBtn.addEventListener('click', () => {
    if (timeScale < 3) {
      timeScale += 0.25;
      updateSpeedIndicator();
    }
  });

  function updateSpeedIndicator() {
    speedIndicator.textContent = `${timeScale.toFixed(2)}x`;
  }
}

function showPlanetInfo(object) {
  // Check if the object is a planet or the sun
  let celestialInfo = planetData.find(p => planetMeshes[p.name] === object);

  // If not a planet, check if it's a moon
  if (!celestialInfo) {
    const moonInfo = moonData.find(m => moonMeshes[m.name] === object);
    if (moonInfo) {
      // For moons, just highlight the moon
      gsap.to(object.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.5,
        ease: 'power2.out'
      });

      // Show a simple alert for moons
      alert(`${moonInfo.name} is a moon of ${moonInfo.parentPlanet}`);

      return;
    }

    // If neither planet nor moon, exit
    return;
  }

  // Highlight the planet
  gsap.to(object.scale, {
    x: 1.2,
    y: 1.2,
    z: 1.2,
    duration: 0.5,
    ease: 'power2.out'
  });

  // Audio narration is disabled to avoid errors
  // Just pause orbits while viewing info
  pauseOrbits();

  // Show detailed info panel directly for planets and sun
  if (celestialInfo.detailedInfo) {
    showDetailedInfo(celestialInfo);
  }
}

function showDetailedInfo(celestialInfo) {
  // Get the detailed info panel
  const detailedInfoPanel = document.getElementById('detailed-info-panel');

  // Set the planet name
  document.getElementById('planet-name').textContent = celestialInfo.name;

  // Set physical characteristics
  document.getElementById('planet-type').textContent = celestialInfo.type;
  document.getElementById('planet-diameter').textContent = celestialInfo.detailedInfo.diameter || 'Unknown';
  document.getElementById('planet-mass').textContent = celestialInfo.detailedInfo.mass || 'Unknown';

  // Set temperature (different properties for different celestial bodies)
  if (celestialInfo.detailedInfo.surfaceTemp) {
    document.getElementById('planet-temp').textContent = celestialInfo.detailedInfo.surfaceTemp;
  } else if (celestialInfo.detailedInfo.coreTemp) {
    document.getElementById('planet-temp').textContent = celestialInfo.detailedInfo.coreTemp;
  } else {
    document.getElementById('planet-temp').textContent = 'Unknown';
  }

  // Set composition
  document.getElementById('planet-composition').textContent = celestialInfo.detailedInfo.composition || 'Unknown';

  // Set orbit & rotation
  document.getElementById('planet-distance').textContent = celestialInfo.distance;
  document.getElementById('planet-orbital-period').textContent =
    celestialInfo.detailedInfo.orbitalPeriod || (celestialInfo.name === 'Sun' ? 'N/A' : 'Unknown');
  document.getElementById('planet-rotation-period').textContent =
    celestialInfo.detailedInfo.rotationPeriod || 'Unknown';

  // Set atmosphere
  const atmosphereElement = document.getElementById('planet-atmosphere');
  if (celestialInfo.detailedInfo.atmosphere) {
    atmosphereElement.textContent = celestialInfo.detailedInfo.atmosphere;
    atmosphereElement.parentElement.style.display = 'block';
  } else {
    atmosphereElement.parentElement.style.display = 'none';
  }

  // Set interesting facts
  const factsList = document.getElementById('planet-facts');
  factsList.innerHTML = '';
  if (celestialInfo.detailedInfo.facts && celestialInfo.detailedInfo.facts.length > 0) {
    celestialInfo.detailedInfo.facts.forEach(fact => {
      const li = document.createElement('li');
      li.textContent = fact;
      factsList.appendChild(li);
    });
    factsList.parentElement.style.display = 'block';
  } else {
    factsList.parentElement.style.display = 'none';
  }

  // Show the panel
  detailedInfoPanel.classList.remove('hidden');

  // Pause orbits while viewing detailed info
  pauseOrbits();
}

// Make this function globally accessible
window.hidePlanetInfo = function() {
  // Hide the detailed info panel
  const detailedInfoPanel = document.getElementById('detailed-info-panel');
  detailedInfoPanel.classList.add('hidden');

  // Also hide the emergency Earth info panel
  document.getElementById('emergency-earth-info').style.display = 'none';

  // Reset all planet scales
  Object.values(planetMeshes).forEach(planet => {
    gsap.to(planet.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.5,
      ease: 'power2.in'
    });
  });

  // Resume orbits
  resumeOrbits();
};

// Local reference for internal use
function hidePlanetInfo() {
  window.hidePlanetInfo();
}

// Event listeners
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('click', (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Get all moon meshes
  const moonMeshList = moons.map(moon => moon.mesh);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(planets.concat([sun]).concat(moonMeshList));

  // Debug message
  console.log("Click detected, intersects:", intersects.length);

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    console.log("Selected object:", selectedObject.name || "unnamed object");

    // Check if the clicked object is Earth (by name, reference, or parent)
    const earthMesh = planetMeshes['Earth'];

    // Check if it's Earth directly, has Earth name, or is a child of Earth
    const isEarthOrChild =
      selectedObject === earthMesh ||
      selectedObject.name === "Earth" ||
      (selectedObject.parent && selectedObject.parent === earthMesh) ||
      (selectedObject.parent && selectedObject.parent.name === "Earth");

    if (isEarthOrChild) {
      console.log("Earth or Earth's child was clicked! Showing Earth info panel");

      // Show the emergency Earth info panel
      const earthPanel = document.getElementById('emergency-earth-info');
      earthPanel.style.display = 'flex';

      // Highlight Earth (use the actual Earth mesh, not potentially a child)
      gsap.to(earthMesh.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 0.5,
        ease: 'power2.out'
      });

      // Pause orbits
      pauseOrbits();

      return;
    }

    // Log more details about the selected object for debugging
    console.log("Selected object details:", {
      name: selectedObject.name,
      type: selectedObject.type,
      isEarthMesh: selectedObject === earthMesh,
      parent: selectedObject.parent ? selectedObject.parent.name : "none"
    });

    // For other planets, use the regular info panel
    showPlanetInfo(selectedObject);
  } else {
    hidePlanetInfo();

    // Also hide the emergency Earth info panel
    document.getElementById('emergency-earth-info').style.display = 'none';

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
      resumeOrbits();
    }
  }
});

// GUI controls
function setupGUI() {
  const gui = new GUI();

  const params = {
    orbitSpeed: 1,
    rotationSpeed: 1,
    bloomStrength: bloomPass.strength,
    bloomRadius: bloomPass.radius,
    bloomThreshold: bloomPass.threshold
  };

  gui.add(params, 'orbitSpeed', 0.1, 10).name('Orbit Speed').onChange((value) => {
    planetData.forEach(planet => {
      if (planet.orbitSpeed) planet.orbitSpeed *= value / params.orbitSpeed;
    });
    params.orbitSpeed = value;
  });

  gui.add(params, 'rotationSpeed', 0, 5).name('Rotation Speed').onChange((value) => {
    planetData.forEach(planet => {
      planet.rotationSpeed *= value / params.rotationSpeed;
    });
    params.rotationSpeed = value;
  });

  const bloomFolder = gui.addFolder('Sun Glow Effect');

  bloomFolder.add(params, 'bloomStrength', 0, 3).name('Glow Strength').onChange((value) => {
    bloomPass.strength = value;
  });

  bloomFolder.add(params, 'bloomRadius', 0, 1).name('Glow Radius').onChange((value) => {
    bloomPass.radius = value;
  });

  bloomFolder.add(params, 'bloomThreshold', 0, 1).name('Glow Threshold').onChange((value) => {
    bloomPass.threshold = value;
  });

  gui.close(); // Start with closed GUI
}

// Loading screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  gsap.to(loadingScreen, {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      loadingScreen.style.display = 'none';
    }
  });
}

// Camera presets
const cameraPresets = {
  overview: {
    position: new THREE.Vector3(0, 60, 120),
    target: new THREE.Vector3(0, 0, 0)
  },
  top: {
    position: new THREE.Vector3(0, 150, 0),
    target: new THREE.Vector3(0, 0, 0)
  },
  side: {
    position: new THREE.Vector3(120, 0, 0),
    target: new THREE.Vector3(0, 0, 0)
  },
  sun: {
    position: new THREE.Vector3(0, 10, 20),
    target: new THREE.Vector3(0, 0, 0)
  },
  earth: {
    position: new THREE.Vector3(28, 5, 35),
    target: new THREE.Vector3(28, 0, 0)
  }
};

function setupCameraPresets() {
  const presetButtons = document.querySelectorAll('#camera-presets button');

  presetButtons.forEach(button => {
    button.addEventListener('click', () => {
      const preset = button.getAttribute('data-preset');
      if (cameraPresets[preset]) {
        moveCamera(cameraPresets[preset]);
      }
    });
  });
}

function moveCamera(preset) {
  // Special case for Earth preset - get current Earth position
  if (preset === cameraPresets.earth && planetMeshes['Earth']) {
    const earthPosition = new THREE.Vector3();
    planetMeshes['Earth'].getWorldPosition(earthPosition);

    // Update the preset with Earth's current position
    preset = {
      position: new THREE.Vector3(
        earthPosition.x,
        earthPosition.y + 5,
        earthPosition.z + 7
      ),
      target: earthPosition
    };
  }

  // Use GSAP to animate camera movement
  gsap.to(camera.position, {
    x: preset.position.x,
    y: preset.position.y,
    z: preset.position.z,
    duration: 2,
    ease: 'power2.inOut'
  });

  // Update controls target
  gsap.to(controls.target, {
    x: preset.target.x,
    y: preset.target.y,
    z: preset.target.z,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      controls.update();
    }
  });
}

// Setup planet buttons
function setupPlanetButtons() {
  const planetButtons = document.querySelectorAll('#planet-buttons button');

  planetButtons.forEach(button => {
    button.addEventListener('click', () => {
      const planetName = button.getAttribute('data-planet');
      console.log(`Button clicked for planet: ${planetName}`);

      // Special handling for Earth
      if (planetName === 'Earth') {
        console.log("Earth button clicked - special handling");

        // Get Earth info directly
        const earthInfo = planetData.find(p => p.name === 'Earth');
        console.log("Earth info found:", earthInfo ? "Yes" : "No");

        if (earthInfo) {
          // Show Earth info directly
          const detailedInfoPanel = document.getElementById('detailed-info-panel');

          // Set the planet name
          document.getElementById('planet-name').textContent = 'Earth';

          // Set physical characteristics
          document.getElementById('planet-type').textContent = earthInfo.type;
          document.getElementById('planet-diameter').textContent = earthInfo.detailedInfo.diameter;
          document.getElementById('planet-mass').textContent = earthInfo.detailedInfo.mass;
          document.getElementById('planet-temp').textContent = earthInfo.detailedInfo.surfaceTemp;

          // Set composition
          document.getElementById('planet-composition').textContent = earthInfo.detailedInfo.composition;

          // Set orbit & rotation
          document.getElementById('planet-distance').textContent = earthInfo.distance;
          document.getElementById('planet-orbital-period').textContent = earthInfo.detailedInfo.orbitalPeriod;
          document.getElementById('planet-rotation-period').textContent = earthInfo.detailedInfo.rotationPeriod;

          // Set atmosphere
          const atmosphereElement = document.getElementById('planet-atmosphere');
          atmosphereElement.textContent = earthInfo.detailedInfo.atmosphere;
          atmosphereElement.parentElement.style.display = 'block';

          // Set interesting facts
          const factsList = document.getElementById('planet-facts');
          factsList.innerHTML = '';
          earthInfo.detailedInfo.facts.forEach(fact => {
            const li = document.createElement('li');
            li.textContent = fact;
            factsList.appendChild(li);
          });
          factsList.parentElement.style.display = 'block';

          // Show the panel
          detailedInfoPanel.classList.remove('hidden');

          // Pause orbits
          pauseOrbits();

          // Focus camera on Earth
          const earthMesh = planetMeshes['Earth'];
          if (earthMesh) {
            const earthPosition = new THREE.Vector3();
            earthMesh.getWorldPosition(earthPosition);

            const preset = {
              position: new THREE.Vector3(
                earthPosition.x,
                earthPosition.y + earthInfo.radius * 3,
                earthPosition.z + earthInfo.radius * 5
              ),
              target: earthPosition
            };

            moveCamera(preset);

            // Highlight Earth
            gsap.to(earthMesh.scale, {
              x: 1.2,
              y: 1.2,
              z: 1.2,
              duration: 0.5,
              ease: 'power2.out'
            });
          }

          return;
        }
      }

      // Normal handling for other planets
      const planetInfo = planetData.find(p => p.name === planetName);

      if (planetInfo) {
        // Focus camera on the planet
        const planetMesh = planetMeshes[planetName];
        if (planetMesh) {
          // Create a custom preset for this planet
          const planetPosition = new THREE.Vector3();
          planetMesh.getWorldPosition(planetPosition);

          const preset = {
            position: new THREE.Vector3(
              planetPosition.x,
              planetPosition.y + planetInfo.radius * 3,
              planetPosition.z + planetInfo.radius * 5
            ),
            target: planetPosition
          };

          // Move camera to the planet
          moveCamera(preset);

          // Highlight the planet
          gsap.to(planetMesh.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 0.5,
            ease: 'power2.out'
          });

          // Show detailed info
          showDetailedInfo(planetInfo);
        }
      }
    });
  });
}

// Setup direct Earth info button - now handled directly in HTML
function setupDirectEarthButton() {
  // This function is now empty because we're using inline onclick in the HTML
  console.log("Earth button is now handled directly in HTML");
}

// Initialize
function init() {
  setupAudio();
  setupGUI();
  setupTimeControls();
  setupCameraPresets();
  setupDetailedInfoPanel();
  setupPlanetButtons();
  setupDirectEarthButton();

  // Hide loading screen after a short delay
  setTimeout(hideLoadingScreen, 1500);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update controls
  controls.update();

  // Rotate sun
  sun.rotation.y += planetData[0].rotationSpeed * timeScale;

  // Update planet positions and rotations
  if (!isPaused) {
    for (let i = 1; i < planetData.length; i++) {
      const planet = planetData[i];
      const mesh = planets[i - 1];

      // Update orbit position with time scale
      planet.position.x = Math.cos(Date.now() * planet.orbitSpeed * timeScale) * planet.orbitRadius;
      planet.position.z = Math.sin(Date.now() * planet.orbitSpeed * timeScale) * planet.orbitRadius;
      mesh.position.set(planet.position.x, planet.position.y, planet.position.z);

      // Rotate planet with time scale
      mesh.rotation.y += planet.rotationSpeed * timeScale;

      // Update Earth's rotation - no day/night cycle needed now
      if (planet.name === 'Earth') {
        // We're using simple materials now, so no need to update uniforms
        // Just let Earth rotate normally
      }
    }

    // Update moon positions and rotations with time scale
    moons.forEach(moon => {
      // Rotate moon orbit around parent planet
      moon.orbit.rotation.y += moon.data.orbitSpeed * timeScale;

      // Rotate moon itself
      moon.mesh.rotation.y += moon.data.rotationSpeed * timeScale;
    });
  }

  // Render scene with bloom effect
  composer.render();

  // Render labels
  labelRenderer.render(scene, camera);
}

// Start the application
init();
animate();
