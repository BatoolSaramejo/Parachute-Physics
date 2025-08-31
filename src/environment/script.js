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
let materialArray=[];
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

let skyboxGeo = new THREE.BoxGeometry(60000, 10000, 60000);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
skybox.position.y = -25000;
scene.add(skybox);

let PARAMS = {
  skydiverMass: 60, // kg
  dragCoeff: 1.2, // typical for a human + parachute
  airplaneHeight: 1500, 
  groundType: "hard", // sand, water, hard
//   ropeStrength: 500, // Newtons before breaking
  windX: 0, // 🆕 جديد: قوة الرياح على محور X
  windZ: 0, // 🆕 جديد: قوة الرياح على محور Z
  tensionLeft: 0, // 🆕 جديد: شد الحبل الأيسر
  tensionRight: 0, // 🆕 جديد: شد الحبل الأيمن
  yawDamping: 0.5, // arbitrary damping factor
  armLength: 1, // meters
  legPosture: 0, 
  openParachuteArea: 15,
};

//skydiverMass
pane.addInput(PARAMS, "skydiverMass", { min: 60, max: 114, step: 1 })
    .on("change", (ev) => {
        parachute.mass = ev.value; 
        console.log(`⚖️ تم تغيير الكتلة إلى ${parachute.mass} كغ`);
    });

// Drag coefficient
pane.addInput(PARAMS, "dragCoeff", { min: 0.5, max: 2.5, step: 0.01 });

// Airplane height
pane.addInput(PARAMS, "airplaneHeight", { min:2000, max: 4000, step: 100 });

// Ground type
pane.addInput(PARAMS, "groundType", {
  options: {
    Sand: "sand",
    "Hard Ground": "hard",
  },
});

const yawDampingInput = pane.addInput(PARAMS, "yawDamping", {
    min: 0.0,
    max: 2.0,
    step: 0.01
});

pane.addInput(PARAMS, "openParachuteArea", {
    min: 10,
    max: 100,
    step: 1
})
.on("change", (ev) => {
    if (window.parachute) {
        window.parachute.openArea = ev.value;
        console.log(`🪂 تم تغيير مساحة المظلة المفتوحة إلى ${ev.value} متر مربع`);
    }
});

//  تعديل: تحكم مباشر بقوة الرياح على المحورين X و Z
// Wind on X-axis (East/West)
pane.addInput(PARAMS, "windX", { min: -80, max: 80, step: 1, label: 'Wind X (E/W)' });

// Wind on Z-axis (North/South)
pane.addInput(PARAMS, "windZ", { min: -80, max: 80, step: 1, label: 'Wind Z (N/S)' });


//تحكم بشد الحبل الأيسر
pane.addInput(PARAMS, "tensionLeft", { min: 0, max: 50, step: 1, label: 'Tension Left' });

//  تحكم بشد الحبل الأيمن
pane.addInput(PARAMS, "tensionRight", { min: 0, max: 50, step: 1, label: 'Tension Right' });


//  الكود الجديد لربط Tweakpane مع الرياح وشد الحبال
pane.on('change', (ev) => {
  if (!window.parachute) return;
// 🆕 ربط معامل التخميد الدوراني بمعامل مقاومة الهواء
if (ev.presetKey === 'dragCoeff') {
    window.parachute.dragCoeff = ev.value;
    const newYawDamping = ev.value * 0.4;
    window.parachute.yawDampingCoeff = newYawDamping;
    // تحديث القيمة المعروضة في Tweakpane
    yawDampingInput.value = newYawDamping;
    console.log(`💨 تم تحديث معامل مقاومة الهواء إلى: ${ev.value}`);
    console.log(`🌀 تم تحديث معامل التخميد الدوراني إلى: ${newYawDamping.toFixed(2)}`);
}

// 🆕 تحديث معامل التخميد الدوراني يدويًا
if (ev.presetKey === 'yawDamping') {
    window.parachute.yawDampingCoeff = ev.value;
    console.log(`🌀 تم تحديث معامل التخميد الدوراني يدويًا إلى: ${ev.value}`);
}
  // تحديث الرياح على المحور الشرقي/الغربي (X-axis)
  if (ev.presetKey === 'windX') {
    window.parachute.wind.x = ev.value;
    console.log(`💨 قوة الرياح على محور X: ${ev.value} نيوتن`);
  }
  
  // تحديث الرياح على المحور الشمالي/الجنوبي (Z-axis)
  if (ev.presetKey === 'windZ') {
    window.parachute.wind.z = ev.value;
    console.log(`💨 قوة الرياح على محور Z: ${ev.value} نيوتن`);
  }


  // 🆕 جديد: تحديث شد الحبل الأيسر
  if (ev.presetKey === 'tensionLeft') {
    window.parachute.tensionLeft = ev.value;
    console.log(`⬅️ شد الحبل الأيسر: ${ev.value} نيوتن`);
  }

  // 🆕 جديد: تحديث شد الحبل الأيمن
  if (ev.presetKey === 'tensionRight') {
    window.parachute.tensionRight = ev.value;
    console.log(`➡️ شد الحبل الأيمن: ${ev.value} نيوتن`);
  }

  // 🆕 جديد: تحديث نوع الأرض
  if (ev.presetKey === 'groundType') {
    window.parachute.surfaceType = ev.value;
    console.log(`🌍 تم تحديث نوع الأرض إلى: ${ev.value}`);
  }
});

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
let landingBox = null;
let currentLandingBoxType = "hard";
let groundLevel = -30000;

let currentCameraTarget = "helicopter";

// add plane model
const loader = new GLTFLoader();

loader.load("/models/helicopter.glb", (gltf) => {
  planeModel = gltf.scene;
  planeModel.scale.setScalar(0.4);
  planeModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
  scene.add(planeModel);
});

loader.load("/models/PILOT.glb", (gltf) => {
  pilotModel = gltf.scene;
  pilotModel.scale.setScalar(10);
  pilotModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
  pilotModel.visible = false;
  scene.add(pilotModel);
});

loader.load("/models/PILOT_ARMS.glb", (gltf) => {
  pilotArmsModel = gltf.scene;
  pilotArmsModel.scale.setScalar(10);
  pilotArmsModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
  pilotArmsModel.visible = false;
  scene.add(pilotArmsModel);
});

loader.load("/models/PILOT_LEGS.glb", (gltf) => {
  pilotLegsModel = gltf.scene;
  pilotLegsModel.scale.setScalar(10);
  pilotLegsModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
  pilotLegsModel.visible = false;
  scene.add(pilotLegsModel);
});

loader.load("/models/PILOT_ARMS_LEGS.glb", (gltf) => {
  pilotArmsLegsModel = gltf.scene;
  pilotArmsLegsModel.scale.setScalar(10);
  pilotArmsLegsModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
  pilotArmsLegsModel.visible = false;
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

// draw landing box
function createLandingBox(filler_type) {
  const boxGroup = new THREE.Group();
  const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

  // ground
  const boxGroundGeometry = new THREE.BoxGeometry(5, 0.25, 5);
  const uv2boxGroundGeometry = new THREE.BufferAttribute(boxGroundGeometry.attributes.uv.array, 2);
  boxGroundGeometry.setAttribute('uv2', uv2boxGroundGeometry);

  const boxGroundMesh = new THREE.Mesh(boxGroundGeometry, boxMaterial);

  // left
  const boxLeftSideGeometry = new THREE.BoxGeometry(0.25, 1, 5);
  const uv2boxLeftSideGeometry = new THREE.BufferAttribute(boxLeftSideGeometry.attributes.uv.array, 2);
  boxLeftSideGeometry.setAttribute('uv2', uv2boxLeftSideGeometry);

  const boxLeftSideMesh = new THREE.Mesh(boxLeftSideGeometry, boxMaterial);
  boxLeftSideMesh.position.y += 0.5;
  boxLeftSideMesh.position.x -= 2.375;

  // right
  const boxRightSideGeometry = new THREE.BoxGeometry(0.25, 1, 5);
  const uv2boxRightSideGeometry = new THREE.BufferAttribute(boxRightSideGeometry.attributes.uv.array, 2);
  boxRightSideGeometry.setAttribute('uv2', uv2boxRightSideGeometry);

  const boxRightSideMesh = new THREE.Mesh(boxRightSideGeometry, boxMaterial);
  boxRightSideMesh.position.y += 0.5;
  boxRightSideMesh.position.x += 2.375;

  // front
  const boxFrontSideGeometry = new THREE.BoxGeometry(4.5, 1, 0.25);
  const uv2boxFrontSideGeometry = new THREE.BufferAttribute(boxFrontSideGeometry.attributes.uv.array, 2);
  boxFrontSideGeometry.setAttribute('uv2', uv2boxFrontSideGeometry);

  const boxFrontSideMesh = new THREE.Mesh(boxFrontSideGeometry, boxMaterial);
  boxFrontSideMesh.position.y += 0.5;
  boxFrontSideMesh.position.z += 2.375;

  // back
  const boxBackSideGeometry = new THREE.BoxGeometry(4.5, 1, 0.25);
  const uv2boxBackSideGeometry = new THREE.BufferAttribute(boxBackSideGeometry.attributes.uv.array, 2);
  boxBackSideGeometry.setAttribute('uv2', uv2boxBackSideGeometry);

  const boxBackSideMesh = new THREE.Mesh(boxBackSideGeometry, boxMaterial);
  boxBackSideMesh.position.y += 0.5;
  boxBackSideMesh.position.z -= 2.375;

  // filler
  const fillerGeometry = new THREE.BoxGeometry(4.5, 0.5, 4.5);
  const uv2fillerGeometry = new THREE.BufferAttribute(fillerGeometry.attributes.uv.array, 2);
  fillerGeometry.setAttribute('uv2', uv2fillerGeometry);

  let fillerMaterial = null;

if (filler_type === "sand") {
    fillerMaterial = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
  } else if (filler_type === "hard") {
    fillerMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  } else return null;

  const fillerMesh = new THREE.Mesh(fillerGeometry, fillerMaterial);
  fillerMesh.position.set(0, 0.5, 0);

  boxGroup.add(boxGroundMesh, boxLeftSideMesh, boxRightSideMesh, boxFrontSideMesh, boxBackSideMesh, fillerMesh);
  return boxGroup;
}

// function to update landing box
function updateLandingBox() {
  if (PARAMS.groundType === "hard" || PARAMS.groundType === "sand") {
    groundLevel = -29985;
  } else if (PARAMS.groundType === "water") {
    groundLevel = -29995;
  }

  if (landingBox && pilotModel) {
    landingBox.position.set(pilotModel.position.x, -30000, pilotModel.position.z);
  }
  // remove old one
  if (landingBox && currentLandingBoxType != PARAMS.groundType) {
    scene.remove(landingBox);
    landingBox.traverse((child) => {
      if (child.isMesh) {
        child.geometry.dispose();
        child.material.dispose();
      }
    });
    landingBox = null;
  } else if (!landingBox) {
    // create new one
    landingBox = createLandingBox(PARAMS.groundType);
    currentLandingBoxType = PARAMS.groundType;
    if (landingBox) {
      landingBox.position.set(0, -30000, 0); // set where the pilot lands
      landingBox.scale.setScalar(20, 20, 20);
      scene.add(landingBox);
    }
  } else return;
}

updateLandingBox();

// add light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(5, 10, 7.5);
// scene.add(directionalLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1000, groundLevel + PARAMS["airplaneHeight"] + 1000, 1000);
scene.add(directionalLight);
// initialize the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100000
);


camera.position.set(0, groundLevel + PARAMS["airplaneHeight"] + 50, 200);

// initialize the renderer
const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// function createInfoPanel(text, topPosition) {
//       const div = document.createElement("div");
//       div.style.position = "absolute";
//       div.style.top = `${topPosition}px`;
//       div.style.left = "20px";
//       div.style.padding = "8px 16px";
//       div.style.background = "rgba(45, 45, 45, 0.8)";
//       div.style.color = "#E0E0E0";
//       div.style.fontFamily = "monospace";
//       div.style.fontSize = "16px";
//       div.style.fontWeight = "bold";
//       div.style.borderRadius = "8px";
//       div.style.zIndex = "999";
//       div.innerText = text;
//       document.body.appendChild(div);
//       return div;
//   }

// // استخدام الدالة لإنشاء اللوحات
// const altitudeDiv = createInfoPanel("Height: 0 m", 20);
// const velocityDiv = createInfoPanel("Velocity: 0 m/s", 60);
// const accelerationDiv = createInfoPanel("Acceleration: 0 m/s²", 100);

// const yawDiv = createInfoPanel("Yaw: 0°", 140);
// const posXDiv = createInfoPanel("Pos X: 0.00", 180);
// const posYDiv = createInfoPanel("Pos Y: 0.00", 220);
// const posZDiv = createInfoPanel("Pos Z: 0.00", 260);
// // add resize listener
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });
function createCombinedInfoPanel() {
  const style = document.createElement('style');
style.innerHTML = `
    .info-panel {
        position: absolute;
        top: 20px;
        left: 20px;
        padding: 10px; 
        background: rgba(30, 30, 30, 0.85);
        color: #E0E0E0;
        border-radius: 8px; 
        z-index: 999;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        font-family: monospace;
        width: 250px; /* Reduced width */
    }
    .info-panel h2 {
        text-align: right;
        color: #61A470;
        font-size: 16px; 
        margin: 0 0 10px 0; 
        padding-bottom: 8px; 
        border-bottom: 1px solid #61A470; 
    }
    .info-panel h3 {
        text-align: right;
        color: #61A470;
        font-size: 14px; 
        margin: 10px 0 8px 0; 
        padding-bottom: 4px; 
        border-bottom: 1px solid #61A470;
        direction: rtl;
    }
    .info-panel .data-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
        margin-bottom: 6px; 
        font-size: 14px;
        direction: rtl;
    }
    .info-panel .label {
        font-weight: bold;
        color: #C0C0C0;
        text-align: right;
        white-space: nowrap;
    }
    .info-panel .value {
        text-align: center;
        font-weight: bold;
        color: #E0E0E0;
        direction: ltr;
    }
    .info-panel .unit {
        text-align: left;
        font-weight: bold;
        color: #C0C0C0;
    }
    .controls-list {
        direction: rtl;
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .controls-list li {
        margin-bottom: 3px; 
        color: #C0C0C0;
        font-size: 14px; 
    }
    .controls-list .key {
        font-weight: bold;
        color: #E0E0E0;
        background-color: #444;
        padding: 1px 5px;
        border-radius: 3px; 
        margin-left: 3px;
    }
`;
document.head.appendChild(style);

    const panel = document.createElement("div");
    panel.classList.add("info-panel");
    document.body.appendChild(panel);

    const title = document.createElement("h2");
    title.innerText = "معلومات الرحلة";
    panel.appendChild(title);

    const dataContainer = document.createElement("div");
    panel.appendChild(dataContainer);

    const elements = {};
   const motionPoints = [
    { label: "الارتفاع", key: "altitude", unit: " m   " },
    { label: "السرعة", key: "velocity", unit: " m/s   " },
    { label: "التسارع", key: "acceleration", unit: " m/s²    " },
];

    motionPoints.forEach(item => {
        const row = document.createElement("div");
        row.classList.add("data-row");

        const labelSpan = document.createElement("span");
        labelSpan.classList.add("label");
        labelSpan.innerText = item.label;
        row.appendChild(labelSpan);

        const valueSpan = document.createElement("span");
        valueSpan.classList.add("value");
        valueSpan.id = item.key + "Value";
        elements[item.key] = valueSpan;
        row.appendChild(valueSpan);

        const unitSpan = document.createElement("span");
        unitSpan.classList.add("unit");
        unitSpan.innerText = item.unit;
        row.appendChild(unitSpan);

        dataContainer.appendChild(row);
    });

    // New section for Position
    const positionTitle = document.createElement("h3");
    positionTitle.innerText = "الموضع";
    panel.appendChild(positionTitle);
    
    const positionContainer = document.createElement("div");
    panel.appendChild(positionContainer);
    
    const positionPoints = [
        { label: "الموضع X", key: "posX", unit: "m" },
        { label: "الموضع Y", key: "posY", unit: "m" },
        { label: "الموضع Z", key: "posZ", unit: "m" },
        { label: "زاوية ", key: "yaw", unit: "°" },
    ];

    positionPoints.forEach(item => {
        const row = document.createElement("div");
        row.classList.add("data-row");

        const labelSpan = document.createElement("span");
        labelSpan.classList.add("label");
        labelSpan.innerText = item.label;
        row.appendChild(labelSpan);

        const valueSpan = document.createElement("span");
        valueSpan.classList.add("value");
        valueSpan.id = item.key + "Value";
        elements[item.key] = valueSpan;
        row.appendChild(valueSpan);

        const unitSpan = document.createElement("span");
        unitSpan.classList.add("unit");
        unitSpan.innerText = item.unit;
        row.appendChild(unitSpan);

        positionContainer.appendChild(row);
    });
    
    // New section for controls
    const controlsTitle = document.createElement("h3");
    controlsTitle.innerText = "التحكم";
    panel.appendChild(controlsTitle);

    const controlsList = document.createElement("ul");
    controlsList.classList.add("controls-list");
    
    controlsList.innerHTML = `
        <li>
            <span class="key">S</span>
            <span>جاهز للقفز</span>
        </li>
        <li>
            <span class="key">O</span>
            <span>لفتح المظلة</span>
        </li>
        <li>
            <span class="key">H</span>
            <span>لإغلاق المظلة</span>
        </li>
    `;
    panel.appendChild(controlsList);

    return elements;
}

const infoElements = createCombinedInfoPanel();
let dropSpeed = 50;

let cameraAngle = 0;
const cameraRadius = 100; 

// add keyboard listener
window.addEventListener("keydown", (event) => {
    if (!event) {
        return;
    }
if (ispilotDropping && window.parachute) {
    // if (event.key === "c") {
    //     window.parachute.yawDampingCoeff += 0.01;
    //     yawDampingInput.value = window.parachute.yawDampingCoeff;
    //     console.log(`🌀 زيادة معامل مقاومة الدوران إلى ${window.parachute.yawDampingCoeff.toFixed(2)}`);
    // }
    // if (event.key === "f") {
    //     window.parachute.yawDampingCoeff = Math.max(0, window.parachute.yawDampingCoeff - 0.01);
    //     yawDampingInput.value = window.parachute.yawDampingCoeff;
    //     console.log(`🌀 تقليل معامل مقاومة الدوران إلى ${window.parachute.yawDampingCoeff.toFixed(2)}`);
    // }
}
    if (event.key === "s") {
        if (pilotModel && planeModel && !ispilotDropping) {
            ispilotDropping = true;
            pilotModel.visible = true;
            currentCameraTarget = "pilot";

            if (window.parachute) {
                window.parachute.position.y = PARAMS["airplaneHeight"];
                window.isSimulationRunning = true;
                window.animate();
                console.log("▶️ بدء المحاكاة");
            }
        }
    }

    if (ispilotDropping && window.parachute) {
        // مفتاح "1": افتح اليدين
        if (event.key === "1") {
            if (pilotModel.visible) {
                pilotModel.visible = false;
                pilotArmsModel.visible = true;
            } else if (pilotLegsModel.visible) {
                pilotLegsModel.visible = false;
                pilotArmsLegsModel.visible = true;
            }
            window.parachute.changePosture(1.5);
            console.log("🤸‍♂️ تم نشر اليدين لزيادة المقاومة.");
        }

        // مفتاح "2": اضمم اليدين
        if (event.key === "2") {
            if (pilotArmsModel.visible) {
                pilotArmsModel.visible = false;
                pilotModel.visible = true;
            } else if (pilotArmsLegsModel.visible) {
                pilotArmsLegsModel.visible = false;
                pilotLegsModel.visible = true;
            }
            window.parachute.changePosture(1.0);
            console.log("🧍‍♂️ تم ضم اليدين لتقليل المقاومة.");
        }

        // مفتاح "3": افتح الأرجل
        if (event.key === "3") {
            if (pilotModel.visible) {
                pilotModel.visible = false;
                pilotLegsModel.visible = true;
            } else if (pilotArmsModel.visible) {
                pilotArmsModel.visible = false;
                pilotArmsLegsModel.visible = true;
            }
            window.parachute.changeLegPosture(1.5);
            console.log("🦵 تم نشر الأرجل لزيادة المقاومة.");
        }

        // مفتاح "4": اضمم الأرجل
        if (event.key === "4") {
            if (pilotLegsModel.visible) {
                pilotLegsModel.visible = false;
                pilotModel.visible = true;
            } else if (pilotArmsLegsModel.visible) {
                pilotArmsLegsModel.visible = false;
                pilotArmsModel.visible = true;
            }
            window.parachute.changeLegPosture(1.0);
            console.log("🦿 تم ضم الأرجل لتقليل المقاومة.");
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

            if (window.parachute) {
                window.parachute.isParachuteOpen = true;
                console.log("🪂 تم فتح المظلة في المحاكاة الفيزيائية");
            }
        }
    }

   // main.js file
if (event.key === "h") {
    dropSpeed = 50;
    if (pilotModel && pilotHasParachute && ispilotDropping) {
        pilotHasParachute = false;
        parachute_1_Model.visible = false;
        parachute_2_Model.visible = false;
        parachute_3_Model.visible = false;
        parachute_4_Model.visible = false;
        
        if (window.parachute) {
            window.parachute.isParachuteOpen = false;
            console.log("🎒 تم إغلاق المظلة في المحاكاة الفيزيائية");
        }
    }
}
});

const cursor = {
  x: 0,
  y: 0,
};
let isCameraActive = false;

// Activate on click
canvas.addEventListener("mousedown", () => {
  isCameraActive = true;
});

// Deactivate on mouse up
canvas.addEventListener("mouseup", () => {
  isCameraActive = false;
});

// Update cursor only when camera is active
canvas.addEventListener("mousemove", (event) => {
  if (!isCameraActive) return;

  const rect = canvas.getBoundingClientRect();
  cursor.x = (event.clientX - rect.left) / rect.width - 0.5;
  cursor.y = -((event.clientY - rect.top) / rect.height - 0.5);
});

window.addEventListener("wheel", (event) => {
  // Zoom in = decrease FOV, Zoom out = increase FOV
  camera.fov += event.deltaY * 0.05;
  camera.fov = THREE.MathUtils.clamp(camera.fov, 20, 100); // keep it in a range
  camera.updateProjectionMatrix();
});

// render loop
// render loop
const renderloop = () => {
    if (planeModel) {
        planeModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
    }

    if (window.isSimulationRunning && pilotModel && window.parachute) {
        const physicsHeight = window.parachute.position.y;
        const mappedHeight = physicsHeight + groundLevel;

        pilotModel.position.y = mappedHeight;
        pilotModel.position.x = window.parachute.position.x;
        pilotModel.position.z = window.parachute.position.z;
        pilotModel.rotation.y = window.parachute.yawAngle * Math.PI / 180;

        if (pilotArmsModel) pilotArmsModel.position.copy(pilotModel.position);
        if (pilotLegsModel) pilotLegsModel.position.copy(pilotModel.position);
        if (pilotArmsLegsModel) pilotArmsLegsModel.position.copy(pilotModel.position);

        if (pilotArmsModel) pilotArmsModel.rotation.copy(pilotModel.rotation);
        if (pilotLegsModel) pilotLegsModel.rotation.copy(pilotModel.rotation);
        if (pilotArmsLegsModel) pilotArmsLegsModel.rotation.copy(pilotModel.rotation);

    } else if (!window.isSimulationRunning && pilotModel) {
        if (pilotModel.position.y > groundLevel) {
            pilotModel.position.y = groundLevel;
        }
        if (pilotHasParachute) {
            parachute_1_Model.visible = false;
            parachute_2_Model.visible = false;
            parachute_3_Model.visible = false;
            parachute_4_Model.visible = false;
        }
    }

    if (currentCameraTarget === "pilot" && pilotModel) {
        const radius = 70;
        const horizontalAngle = cursor.x * Math.PI * 2;
        const verticalAngle = cursor.y * Math.PI * 0.5;
        camera.position.x =
            pilotModel.position.x +
            Math.sin(horizontalAngle) * Math.cos(verticalAngle) * radius;

        camera.position.z =
            pilotModel.position.z +
            Math.cos(horizontalAngle) * Math.cos(verticalAngle) * radius;

        camera.position.y =
            pilotModel.position.y + Math.sin(verticalAngle) * radius + 20;

        const lookAtOffset = 10;
        camera.lookAt(
            new THREE.Vector3(
                pilotModel.position.x,
                pilotModel.position.y + lookAtOffset,
                pilotModel.position.z
            )
        );
    } else if (currentCameraTarget === "helicopter" && planeModel) {
        cameraAngle += 0.002;
        camera.position.x = planeModel.position.x + Math.sin(cameraAngle) * cameraRadius;
        camera.position.y = planeModel.position.y + 20; // ارتفاع الكاميرا
        camera.position.z = planeModel.position.z + Math.cos(cameraAngle) * cameraRadius;
        camera.lookAt(planeModel.position);
    }

    if (reachedGround) {
        pilotModel.position.y = groundLevel + 1;
        pilotArmsModel.position.y = groundLevel + 1;
        pilotLegsModel.position.y = groundLevel + 1;
        pilotArmsLegsModel.position.y = groundLevel + 1;
    }
    
    updateLandingBox();

    // Consolidated and corrected code to update the information panel
    if (pilotModel && window.parachute) {
        const altitude = Math.max(0, Math.round(pilotModel.position.y - groundLevel));
        const accelerationY = window.parachute.acceleration.y;
        const velocityY = window.parachute.velocity.y.toFixed(2);
        const posX = window.parachute.position.x.toFixed(2);
        const posY = window.parachute.position.y.toFixed(2);
        const posZ = window.parachute.position.z.toFixed(2);
        const yawAngle = window.parachute.yawAngle.toFixed(0);

        infoElements.altitude.innerText = `${altitude}`;
        infoElements.velocity.innerText = `${-velocityY}`;
        infoElements.acceleration.innerText = `${-accelerationY.toFixed(2)}`;
        infoElements.posX.innerText = `${posX}`;
        infoElements.posY.innerText = `${posY}`;
        infoElements.posZ.innerText = `${posZ}`;
        infoElements.yaw.innerText = `${yawAngle}`;
    }

    renderer.render(scene, camera);
    window.requestAnimationFrame(renderloop);
};

renderloop();