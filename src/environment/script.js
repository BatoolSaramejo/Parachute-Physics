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
pane.addInput(skybox.position, "y", {
  label: "Skybox Y",
  min: -10000,
  max: 10000,
  step: 1,
});

// add something
let planeModel = null;
let pilotModel = null;
let parachuteModel = null;

let ispilotDropping = false;
let pilotHasParachute = false;
let hKeyPressed = false;

let currentCameraTarget = "pilot";

// add plane model
const loader = new GLTFLoader();

loader.load("/models/helicopter.glb", (gltf) => {
  planeModel = gltf.scene;
  planeModel.scale.setScalar(0.4);
  planeModel.position.set(0, 0, 0);
  scene.add(planeModel);
});

let bones = [];

const leftArmBones = [
  "c_shoulderl",
  "arm_ikl",
  "arm_fkl",
  "arml",
  "arm_twistl",
  "c_arm_ikl",
  "c_arm_twist_offsetl",
  "forearm_ikl",
  "forearm_fkl",
  "forearm_twistl",
  "forearml",
  "handl",
  "c_hand_fkl",
  "c_hand_fk_scale_fixl",
  "arm_fk_pre_polel",
  "c_index1_basel",
  "index1l",
  "index2l",
  "index3l",
  "c_thumb1_basel",
  "thumb1l",
  "thumb2l",
  "thumb3l",
];

const rightArmBones = [
  // "c_shoulderr",
  "arm_ikr",
  "arm_fkr",
  "armr",
  "arm_twistr",
  "c_arm_ikr",
  "c_arm_twist_offsetr",
  "forearm_ikr",
  "forearm_fkr",
  "forearm_twistr",
  "forearmr",
  "handr",
  "c_hand_fkr",
  "c_hand_fk_scale_fixr",
  "arm_fk_pre_poler",
  // "c_index1_baser",
  // "index1r",
  // "index2r",
  // "index3r",
  // "c_thumb1_baser",
  // "thumb1r",
  // "thumb2r",
  // "thumb3r",
];

const leftLegBones = [
  "c_thigh_bl",
  "c_thigh_fkl",
  "thighl",
  "thigh_twistl",
  "thigh_ik_nostrl",
  "c_thigh_ikl",
  "c_stretch_legl",
  "thigh_stretchl",
  "legl",
  "leg_ikl",
  "leg_fkl",
  "c_leg_fkl",
  "leg_twistl",
  "leg_stretchl",
  "footl",
  "foot_fkl",
  "c_foot_fkl",
  "c_foot_fk_scale_fixl",
  "foot_01_polel",
  "foot_ik_targetl",
  "toes_01l",
  "c_toes_fkl",
  "c_toes_ikl",
  "c_toes_end_01l",
];

const rightLegBones = [
  "c_thigh_br",
  "c_thigh_fkr",
  "thighr",
  "thigh_twistr",
  "thigh_ik_nostrr",
  "c_thigh_ikr",
  "c_stretch_legr",
  "thigh_stretchr",
  "legr",
  "leg_ikr",
  "leg_fkr",
  "c_leg_fkr",
  "leg_twistr",
  "leg_stretchr",
  "footr",
  "foot_fkr",
  "c_foot_fkr",
  "c_foot_fk_scale_fixr",
  "foot_01_poler",
  "foot_ik_targetr",
  "toes_01r",
  "c_toes_fkr",
  "c_toes_ikr",
  "c_toes_end_01r",
];

loader.load("/models/PILOT.glb", (gltf) => {
  pilotModel = gltf.scene;
  pilotModel.scale.setScalar(10);
  pilotModel.position.set(0, 0, 0);
  pilotModel.visible = false; // Hide initially
  scene.add(pilotModel);

  // const skeletonHelper = new THREE.SkeletonHelper(pilotModel);
  // scene.add(skeletonHelper);

  // Find all bones
  pilotModel.traverse((child) => {
    if (child.isBone) {
      bones.push(child);
      console.log(
        "Bone:",
        child.name,
        "Children:",
        child.children.map((c) => c.name),
        "Position:",
        child.position,
        "Rotation:",
        child.rotation
      );
    }

    if (child.isSkinnedMesh) {
      console.log("Skinned mesh found: - script.js:202", child);
      console.log(
        "Bones influencing this mesh:",
        child.skeleton.bones.map((b) => b.name)
      );
    }
  });

  // pilotModel.traverse((child) => {
  //   if (child.isBone) {
  //     bones[child.name] = child;

  // Optional: add colored sphere to visualize bones
  // const sphere = new THREE.Mesh(
  //   new THREE.SphereGeometry(0.3),
  //   new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
  // );
  // child.add(sphere);
  //   }
  // });

  // console.log("All bones: - script.js:117", Object.keys(bones));
});
// const leftUpperArm = bones["forearm_ikl"];
// const rightUpperArm = bones["forearm_fkl"];
// const leftUpperLeg = bones["forearm_twistl"];
// const rightUpperLeg = bones["forearm_twistl"];

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

  // if (event.key === "q" && pilotModel) {
  // const leftArm = pilotModel.getObjectByName("c_arms_polel");
  // const rightArm = pilotModel.getObjectByName("c_arms_poler");
  // const leftLeg = pilotModel.getObjectByName("c_leg_polel");
  // const rightLeg = pilotModel.getObjectByName("c_leg_poler");

  // console.log(leftArm, rightArm, leftLeg, rightLeg);
  // pilotModel.traverse((child) => {
  //   if (child.isSkinnedMesh) {
  //     console.log("Skinned mesh found: - script.js:187", child);
  //   }
  // });
  // if (leftArm) {
  //   leftArm.rotation.set(5, 5, 5); // Extreme rotation
  //   leftArm.scale.set(2, 2, 2); // Make it double size
  //   leftArm.position.y += 5; // Move it up
  // }
  // // if (leftArm) leftArm.rotation.x = Math.PI;
  // if (rightArm) rightArm.rotation.x = -Math.PI;
  // if (leftLeg) leftLeg.rotation.z = Math.PI;
  // if (rightLeg) rightLeg.rotation.z = Math.PI;

  // // Update the skeleton matrices
  // pilotModel.traverse((child) => {
  //   if (child.isSkinnedMesh) {
  //     child.skeleton.update();
  //   }
  // });
  // pilotModel.updateMatrixWorld(true);

  if (event.key === "q" && ispilotDropping) {
    bones.forEach((bone) => {
      if (rightArmBones.includes(bone.name)) {
        console.log(bone);
        // bone.rotation.x += 0.2; // huge rotation
        // console.log(bone.rotation.x);
        bone.rotation.y += Math.PI / 2;
        // bone.rotation.z += 0.2;
        // bone.position.x++;
        // bone.scale.set(bone.scale.x + 0.2, bone.scale.y + 0.2, bone.scale.z + 0.2); // big scale change
      }
      // bone.position.y += 5; // big position change
    });

    // Update skeletons for all skinned meshes
    pilotModel.traverse((child) => {
      if (child.isSkinnedMesh) {
        child.skeleton.update();
      }
    });

    console.log("Bones transformed! - script.js:381");
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

  //////////////////////////////////////////////
  // const step = 2; // rotation step
  // switch (event.key) {
  //   case "q": // left arm up
  //     if (leftUpperArm) leftUpperArm.scale.setScalar += step;
  //     break;
  //   case "w": // right arm up
  //     if (rightUpperArm) rightUpperArm.rotation.x += step;
  //     break;
  //   case "a": // left leg forward
  //     if (leftUpperLeg) leftUpperLeg.rotation.x += step;
  //     break;
  //   case "s": // right leg forward
  //     if (rightUpperLeg) rightUpperLeg.rotation.x += step;
  //     break;
  // }

  // // Update skeletons
  // pilotModel.traverse((child) => {
  //   if (child.isSkinnedMesh) child.skeleton.update();
  // });

  //////////////////////////////////////////////
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
