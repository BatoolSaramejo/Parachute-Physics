import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Pane } from "tweakpane";
import { SkeletonHelper } from "three";

// initialize pane
const pane = new Pane();

// initialize the scene
const scene = new THREE.Scene();

// initialize texture loader
const textureLoader = new THREE.TextureLoader();

const parachuteTexture = textureLoader.load("textures/parachute.jpg");
// add skybox

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load("textures/cubeMap/px.jpg");
let texture_bk = new THREE.TextureLoader().load("textures/cubeMap/nx.jpg");
let texture_up = new THREE.TextureLoader().load("textures/cubeMap/py.jpg");
let texture_dn = new THREE.TextureLoader().load("textures/cubeMap/ny.jpg");
let texture_rt = new THREE.TextureLoader().load("textures/cubeMap/pz.jpg");
let texture_lf = new THREE.TextureLoader().load("textures/cubeMap/nz.jpg");

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

let PARAMS = {
  skydiverMass: 80, // kg
  dragCoeff: 1.2, // typical for a human + parachute
  airplaneHeight: 500, // meters
  groundType: "sand", // sand, water, hard
  ropeStrength: 500, // Newtons before breaking
  windNS: "none", // north, south, none
  windEW: "none", // east, west, none
  yawDamping: 0.5, // arbitrary damping factor
  armLength: 0.8, // meters
};

// Skydiver mass
pane.addInput(PARAMS, "skydiverMass", { min: 40, max: 120, step: 1 });

// Drag coefficient
pane.addInput(PARAMS, "dragCoeff", { min: 0.5, max: 2.5, step: 0.01 });

// Airplane height
pane.addInput(PARAMS, "airplaneHeight", { min: 10000, max: 45000, step: 100 });

// Ground type
pane.addInput(PARAMS, "groundType", {
  options: {
    Sand: "sand",
    Water: "water",
    "Hard Ground": "hard",
  },
});

// Rope tensile strength
pane.addInput(PARAMS, "ropeStrength", { min: 100, max: 2000, step: 10 });

// Wind - North/South
pane.addInput(PARAMS, "windNS", {
  options: {
    None: "none",
    North: "north",
    South: "south",
  },
});

// Wind - East/West
pane.addInput(PARAMS, "windEW", {
  options: {
    None: "none",
    East: "east",
    West: "west",
  },
});

// Yaw damping coefficient
pane.addInput(PARAMS, "yawDamping", { min: 0.1, max: 2.0, step: 0.01 });

// Arm length
pane.addInput(PARAMS, "armLength", { min: 0.3, max: 1.5, step: 0.01 });

// add something
let planeModel = null;
let pilotModel = null;
let pilotArmsModel = null;
let pilotLegsModel = null;
let pilotArmsLegsModel = null;
let parachute_1_Model = null;
let parachute_2_Model = null;
let parachute_3_Model = null;
let parachute_4_Model = null;

let ispilotDropping = false;
let pilotHasParachute = false;
let reachedGround = false;

let currentCameraTarget = "pilot";

// add plane model
const loader = new GLTFLoader();

loader.load("/models/helicopter.glb", (gltf) => {
  planeModel = gltf.scene;
  planeModel.scale.setScalar(0.4);
  planeModel.position.set(0, -30000 + PARAMS["airplaneHeight"], 0);
  scene.add(planeModel);
});

loader.load("/models/PILOT.glb", (gltf) => {
  pilotModel = gltf.scene;
  pilotModel.scale.setScalar(10);
  pilotModel.position.set(0, 0, 0);
  pilotModel.visible = false; // Hide initially
  scene.add(pilotModel);
});

loader.load("/models/PILOT_ARMS.glb", (gltf) => {
  pilotArmsModel = gltf.scene;
  pilotArmsModel.scale.setScalar(10);
  pilotArmsModel.position.set(0, 0, 0);
  pilotArmsModel.visible = false; // Hide initially
  scene.add(pilotArmsModel);
});

loader.load("/models/PILOT_LEGS.glb", (gltf) => {
  pilotLegsModel = gltf.scene;
  pilotLegsModel.scale.setScalar(10);
  pilotLegsModel.position.set(0, 0, 0);
  pilotLegsModel.visible = false; // Hide initially
  scene.add(pilotLegsModel);
});

loader.load("/models/PILOT_ARMS_LEGS.glb", (gltf) => {
  pilotArmsLegsModel = gltf.scene;
  pilotArmsLegsModel.scale.setScalar(10);
  pilotArmsLegsModel.position.set(0, 0, 0);
  pilotArmsLegsModel.visible = false; // Hide initially
  scene.add(pilotArmsLegsModel);
});

// draw parachute
function createParachute(x_val, y_val) {
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
      new THREE.Vector3(-x_val, -y_val, 0),
    ]),
    lineMat
  );

  const line2 = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1.5, 0, 0),
      new THREE.Vector3(x_val, -y_val, 0),
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
      if (pilotArmsModel) {
        pilotArmsModel.position.set(
          planeModel.position.x,
          planeModel.position.y - 5,
          planeModel.position.z
        );
      }
      if (pilotLegsModel) {
        pilotLegsModel.position.set(
          planeModel.position.x,
          planeModel.position.y - 5,
          planeModel.position.z
        );
      }
      ispilotDropping = true;
      currentCameraTarget = "pilot";
    }
  }

  if (event.key === "a") {
    // open Arms
    if (
      pilotModel &&
      pilotArmsModel &&
      planeModel &&
      ispilotDropping &&
      pilotModel.visible
    ) {
      pilotModel.visible = false;
      pilotArmsModel.visible = true;
    } else if (
      pilotLegsModel &&
      pilotArmsLegsModel &&
      planeModel &&
      ispilotDropping &&
      pilotLegsModel.visible
    ) {
      pilotLegsModel.visible = false;
      pilotArmsLegsModel.visible = true;
    }
  }

  if (event.key === "c") {
    // close Arms
    if (
      pilotModel &&
      pilotArmsModel &&
      planeModel &&
      ispilotDropping &&
      pilotArmsModel.visible
    ) {
      pilotModel.visible = true;
      pilotArmsModel.visible = false;
    } else if (
      pilotLegsModel &&
      pilotArmsLegsModel &&
      planeModel &&
      ispilotDropping &&
      pilotArmsLegsModel.visible
    ) {
      pilotLegsModel.visible = true;
      pilotArmsLegsModel.visible = false;
    }
  }

  if (event.key === "l" && ispilotDropping) {
    // open legs
    if (
      pilotModel &&
      pilotLegsModel &&
      planeModel &&
      ispilotDropping &&
      pilotModel.visible
    ) {
      pilotModel.visible = false;
      pilotLegsModel.visible = true;
    } else if (
      pilotModel &&
      pilotArmsLegsModel &&
      planeModel &&
      ispilotDropping &&
      pilotArmsModel.visible
    ) {
      pilotArmsModel.visible = false;
      pilotArmsLegsModel.visible = true;
    }
  }

  if (event.key === "x") {
    // close Legs
    if (
      pilotModel &&
      pilotLegsModel &&
      planeModel &&
      ispilotDropping &&
      pilotLegsModel.visible
    ) {
      pilotModel.visible = true;
      pilotLegsModel.visible = false;
    } else if (
      pilotModel &&
      pilotArmsLegsModel &&
      planeModel &&
      ispilotDropping &&
      pilotArmsLegsModel.visible
    ) {
      pilotArmsModel.visible = true;
      pilotArmsLegsModel.visible = false;
    }
  }

  if (event.key === "o") {
    dropSpeed = 10;
    if (pilotModel && !pilotHasParachute && ispilotDropping) {
      const parachute_1 = createParachute(0.4, 2.1);
      parachute_1.position.set(0, 3.2, 0);
      parachute_1.scale.setScalar(1.1);
      pilotModel.add(parachute_1);

      const parachute_3 = createParachute(0.4, 2.1);
      parachute_3.position.set(0, 3.2, 0);
      parachute_3.scale.setScalar(1.1);
      pilotLegsModel.add(parachute_3);

      const parachute_2 = createParachute(0.8, 2.1);
      parachute_2.position.set(0, 3.9, 0);
      parachute_2.scale.setScalar(1.1);
      pilotArmsModel.add(parachute_2);

      const parachute_4 = createParachute(0.8, 2.1);
      parachute_4.position.set(0, 3.4, 0);
      parachute_4.scale.setScalar(1.1);
      pilotArmsLegsModel.add(parachute_4);

      pilotHasParachute = true;
      parachute_1_Model = parachute_1;
      parachute_2_Model = parachute_2;
      parachute_3_Model = parachute_3;
      parachute_4_Model = parachute_4;
    }
  }

  if (event.key === "h") {
    dropSpeed = 50;
    if (pilotModel && pilotHasParachute && ispilotDropping) {
      pilotHasParachute = false;
      parachute_1_Model.visible = false;
      parachute_2_Model.visible = false;
      parachute_3_Model.visible = false;
      parachute_4_Model.visible = false;
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
  if (planeModel) {
    planeModel.position.set(0, -30000 + PARAMS["airplaneHeight"], 0);
  }
  if (planeModel && pilotModel && !ispilotDropping && !reachedGround) {
    pilotModel.position.set(
      planeModel.position.x,
      planeModel.position.y - 5,
      planeModel.position.z
    );
  }
    
  if (ispilotDropping && pilotModel) {
    pilotModel.position.y = Math.max(pilotModel.position.y - dropSpeed, -29999); // Drop speed
    pilotArmsModel.position.y = Math.max(
      pilotArmsModel.position.y - dropSpeed,
      -29999
    ); // Drop speed
    pilotLegsModel.position.y = Math.max(
      pilotLegsModel.position.y - dropSpeed,
      -29999
    ); // Drop speed
    pilotArmsLegsModel.position.y = Math.max(
      pilotArmsLegsModel.position.y - dropSpeed,
      -29999
    ); // Drop speed

    if (pilotModel.position.y <= -29999) {
      ispilotDropping = false;
      reachedGround = true;
      // Hide the parachute if it exists
      if (
        parachute_1_Model ||
        parachute_2_Model ||
        parachute_3_Model ||
        parachute_4_Model
      ) {
        parachute_1_Model.visible = false;
        parachute_2_Model.visible = false;
        parachute_3_Model.visible = false;
        parachute_4_Model.visible = false;
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
      pilotModel.position.y + Math.sin(verticalAngle) * radius + 20;
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
