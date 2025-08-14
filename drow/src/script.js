import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Pane } from "tweakpane";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// initialize texture loader
const textureLoader = new THREE.TextureLoader();

const parachuteTexture = textureLoader.load(
  "drow/static/textures/parachute.jpg"
);

// add skybox

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load(
  "drow/static/textures/cubeMap/px.jpg"
);
let texture_bk = new THREE.TextureLoader().load(
  "drow/static/textures/cubeMap/nx.jpg"
);
let texture_up = new THREE.TextureLoader().load(
  "drow/static/textures/cubeMap/py.jpg"
);
let texture_dn = new THREE.TextureLoader().load(
  "drow/static/textures/cubeMap/ny.jpg"
);
let texture_rt = new THREE.TextureLoader().load(
  "drow/static/textures/cubeMap/pz.jpg"
);
let texture_lf = new THREE.TextureLoader().load(
  "drow/static/textures/cubeMap/nz.jpg"
);

materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

let skyboxGeo = new THREE.BoxGeometry(50000, 50000, 50000);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
skybox.position.y = -5000;
scene.add(skybox);
// console.log(Tweakpane.version);
// pane.addInput(
//   skybox.position, // The object to bind
//   'y',             // The property
//   {
//     label: 'Skybox Y',
//     min: -10000,
//     max: 10000,
//     step: 1
//   }
// );

// add something
let planeModel = null;
let pilotModel = null;
let parachuteModel = null;

let ispilotDropping = false;
let pilotHasParachute = false;

let currentCameraTarget = "pilot"; // or "pilot"

// add plane model
const loader = new GLTFLoader();

loader.load("drow/static/models/helicopter.glb", (gltf) => {
  planeModel = gltf.scene;
  planeModel.scale.setScalar(0.4);
  planeModel.position.set(0, 0, 0);
  scene.add(planeModel);
});

loader.load("drow/static/models/PILOT.glb", (gltf) => {
  pilotModel = gltf.scene;
  pilotModel.scale.setScalar(10);
  pilotModel.position.set(0, 0, 0); // Hide initially
  pilotModel.visible = false;
  scene.add(pilotModel);
});

// draw parachute
function createParachute() {
  const object = new THREE.Group();

  const canopyMaterial = new THREE.MeshBasicMaterial({ map: parachuteTexture });

  const canopyPoints = [
    new THREE.Vector2(1.5, 0),
    new THREE.Vector2(1.4, 0.3),
    new THREE.Vector2(1.2, 0.6),
    new THREE.Vector2(1.0, 0.8),
    new THREE.Vector2(0.8, 1.0),
    new THREE.Vector2(0.6, 1.1),
    new THREE.Vector2(0.4, 1.2),
    new THREE.Vector2(0.2, 1.3),
    new THREE.Vector2(0, 1.4),
    new THREE.Vector2(-0.2, 1.3),
    new THREE.Vector2(-0.4, 1.2),
    new THREE.Vector2(-0.6, 1.1),
    new THREE.Vector2(-0.8, 1.0),
    new THREE.Vector2(-1.0, 0.8),
    new THREE.Vector2(-1.2, 0.6),
    new THREE.Vector2(-1.4, 0.3),
    new THREE.Vector2(-1.5, 0),
  ];

  const canopyGeometry = new THREE.LatheGeometry(canopyPoints);
  const parachute = new THREE.Mesh(canopyGeometry, canopyMaterial);
  object.add(parachute);

  const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });

  const line1 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.5, 0, 0),
      new THREE.Vector3(-0.4, -2.1, 0),
    ]),
    lineMat
  );

  const line2 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1.5, 0, 0),
      new THREE.Vector3(0.4, -2.1, 0),
    ]),
    lineMat
  );

  object.add(line1, line2);

  return object;
}

// add light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// initialize the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// add resize listener
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

let dropSpeed = 50;

// add keyboard listener
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (pilotModel && planeModel && !ispilotDropping) {
      pilotModel.visible = true;
      pilotModel.position.set(
        planeModel.position.x,
        planeModel.position.y - 5,
        planeModel.position.z
      );
      ispilotDropping = true;
      currentCameraTarget = "pilot";
    }
  }

  if (event.key === "o") {
    dropSpeed = 5;
    if (pilotModel && !pilotHasParachute && ispilotDropping) {
      const parachute = createParachute();
      parachute.position.set(0, 3.2, 0);
      parachute.scale.setScalar(1.1);

      pilotModel.add(parachute);
      pilotHasParachute = true;
      parachuteModel = parachute;
    }
  }
});

const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / window.innerWidth - 0.5;
  cursor.y = -(event.clientY / window.innerHeight - 0.5);
});

// render loop
const renderloop = () => {
  if (ispilotDropping && pilotModel) {
    pilotModel.position.y = Math.max(pilotModel.position.y - dropSpeed, -29999); // Drop speed
    if (pilotModel.position.y <= -29999) {
      ispilotDropping = false;
      // Hide the parachute if it exists
      if (parachuteModel) {
        parachuteModel.visible = false;
      }
    }
  }

  if (currentCameraTarget === "pilot" && pilotModel) {
    const radius = 70; // Distance from the pilot
    const horizontalAngle = cursor.x * Math.PI * 2; // Full rotation horizontally
    const verticalAngle = cursor.y * Math.PI * 0.5; // Limit vertical tilt to 90°
    camera.position.x =
      pilotModel.position.x +
      Math.sin(horizontalAngle) * Math.cos(verticalAngle) * radius;

    camera.position.z =
      pilotModel.position.z +
      Math.cos(horizontalAngle) * Math.cos(verticalAngle) * radius;

    camera.position.y =
      pilotModel.position.y +
      Math.sin(verticalAngle) * radius + 20;
    camera.lookAt(
      new THREE.Vector3(
        pilotModel.position.x,
        pilotModel.position.y,
        pilotModel.position.z
      )
    );
  }

  // controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
