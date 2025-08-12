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
const cubeTextureLoader = new THREE.CubeTextureLoader();
cubeTextureLoader.setPath("textures/cubeMap/");

// add skybox

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load("textures/cubeMap/px.png");
let texture_bk = new THREE.TextureLoader().load("textures/cubeMap/nx.png");
let texture_up = new THREE.TextureLoader().load("textures/cubeMap/py.png");
let texture_dn = new THREE.TextureLoader().load("textures/cubeMap/ny.png");
let texture_rt = new THREE.TextureLoader().load("textures/cubeMap/pz.png");
let texture_lf = new THREE.TextureLoader().load("textures/cubeMap/nz.png");

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

// add something
let planeModel = null;
let spongebobModel = null;
let parachuteModel = null;

let isSpongebobDropping = false;
let spongebobHasParachute = false;
let hKeyPressed = false;

let currentCameraTarget = "plane"; // or "spongebob"

const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  a: false, // rotate left
  d: false, // rotate right
  w: false, // rotate X up
  s: false, // rotate X down
  q: false, // move up
  e: false, // move down
};

// add plane model
const loader = new GLTFLoader();

loader.load("/models/plane.glb", (gltf) => {
  planeModel = gltf.scene;
  planeModel.scale.setScalar(5);
  planeModel.position.set(0, 0, -20000); // Start behind the camera
  scene.add(planeModel);
});

loader.load("/models/SPONGEBOB.glb", (gltf) => {
  spongebobModel = gltf.scene;
  spongebobModel.scale.setScalar(10);
  spongebobModel.position.set(0, -1000, 0); // Hide initially
  spongebobModel.visible = false;
  scene.add(spongebobModel);
});

// draw parachute
function createParachute() {
  const object = new THREE.Group();

  const canopyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

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
  80000
);
camera.position.z = 100;
camera.position.y = 5;

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

let dropSpeed = 10;

// add keyboard listener

window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    hKeyPressed = true;
  }

  if (hKeyPressed && event.key === "+") {
    if (planeModel) planeModel.position.y += 1;
  }

  if (hKeyPressed && event.key === "-") {
    if (planeModel) planeModel.position.y -= 1;
  }

  if (event.key === "Enter") {
    if (spongebobModel && planeModel && !isSpongebobDropping) {
      spongebobModel.visible = true;
      spongebobModel.position.set(
        planeModel.position.x,
        planeModel.position.y - 5,
        planeModel.position.z
      );
      isSpongebobDropping = true;
      currentCameraTarget = "spongebob";
    }
  }

  if (event.key === "o") {
    dropSpeed = 5;
    if (spongebobModel && !spongebobHasParachute && isSpongebobDropping) {
      const parachute = createParachute();
      parachute.position.set(0, 2.6, 0);
      parachute.scale.setScalar(1);

      spongebobModel.add(parachute);
      spongebobHasParachute = true;
      parachuteModel = parachute;
    }
  }

  if (event.key in keysPressed) {
    keysPressed[event.key] = true;
  }
});

window.addEventListener("keyup", (event) => {
  if (event.key === "h") {
    hKeyPressed = false;
  }

  if (event.key in keysPressed) {
    keysPressed[event.key] = false;
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

const speed = 2;
const rotationSpeed = 0.02;

// render loop
const renderloop = () => {
  if (planeModel) {
    planeModel.position.z += 20; // Move forward
  }

  if (isSpongebobDropping && spongebobModel) {
    spongebobModel.position.y -= dropSpeed; // Drop speed
    if (spongebobModel.position.y <= -29995) {
      isSpongebobDropping = false;
      // Hide the parachute if it exists
      if (parachuteModel) {
        parachuteModel.visible = false;
      }
    }
  }

  // camera
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);

  const side = new THREE.Vector3();
  side.crossVectors(camera.up, direction).normalize();

  // Movement
  if (keysPressed.ArrowUp) {
    camera.position.addScaledVector(direction, speed);
  }
  if (keysPressed.ArrowDown) {
    camera.position.addScaledVector(direction, -speed);
  }
  if (keysPressed.ArrowLeft) {
    camera.position.addScaledVector(side, speed);
  }
  if (keysPressed.ArrowRight) {
    camera.position.addScaledVector(side, -speed);
  }
  if (keysPressed.q) {
    camera.position.y += speed;
  }
  if (keysPressed.e) {
    camera.position.y -= speed;
  }

  // Rotation
  if (keysPressed.a) {
    camera.rotation.y += rotationSpeed;
  }
  if (keysPressed.d) {
    camera.rotation.y -= rotationSpeed;
  }

  if (currentCameraTarget === "plane" && planeModel) {
    camera.position.x = planeModel.position.x + 70;
    camera.position.z = planeModel.position.z + 50;
    camera.position.y = planeModel.position.y + 1.8;
    camera.lookAt(
      new THREE.Vector3(
        planeModel.position.x,
        planeModel.position.y,
        planeModel.position.z
      )
    );
  }

  if (currentCameraTarget === "spongebob" && spongebobModel) {
    camera.position.x =
      spongebobModel.position.x + Math.sin(cursor.x * Math.PI * 2) * 130;
    camera.position.z =
      spongebobModel.position.z + Math.cos(cursor.x * Math.PI * 2) * 130;
    camera.position.y = spongebobModel.position.y;
    camera.lookAt(
      new THREE.Vector3(
        spongebobModel.position.x,
        spongebobModel.position.y,
        spongebobModel.position.z
      )
    );
  }

  // controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();
