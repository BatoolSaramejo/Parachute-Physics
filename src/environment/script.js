// // import * as THREE from "three";
// // import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// // import { Pane } from "tweakpane";
// // import { SkeletonHelper } from "three";

// // // initialize pane
// // const pane = new Pane();

// // // initialize the scene
// // const scene = new THREE.Scene();

// // // initialize texture loader
// // const textureLoader = new THREE.TextureLoader();

// // const parachuteTexture = textureLoader.load("textures/parachute.jpg");
// // // add skybox

// // let materialArray = [];
// // let texture_ft = new THREE.TextureLoader().load("textures/cubeMap/px.jpg");
// // let texture_bk = new THREE.TextureLoader().load("textures/cubeMap/nx.jpg");
// // let texture_up = new THREE.TextureLoader().load("textures/cubeMap/py.jpg");
// // let texture_dn = new THREE.TextureLoader().load("textures/cubeMap/ny.jpg");
// // let texture_rt = new THREE.TextureLoader().load("textures/cubeMap/pz.jpg");
// // let texture_lf = new THREE.TextureLoader().load("textures/cubeMap/nz.jpg");

// // materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
// // materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
// // materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
// // materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
// // materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
// // materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

// // for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

// // let skyboxGeo = new THREE.BoxGeometry(50000, 50000, 50000);
// // let skybox = new THREE.Mesh(skyboxGeo, materialArray);
// // skybox.position.y = -5000;
// // scene.add(skybox);

// // let PARAMS = {
// //   skydiverMass: 80, // kg
// //   dragCoeff: 1.2, // typical for a human + parachute
// //   airplaneHeight: 500, // meters
// //   groundType: "hard", // sand, water, hard
// //   ropeStrength: 500, // Newtons before breaking
// //   windNS: "none", // north, south, none
// //   windEW: "none", // east, west, none
// //   yawDamping: 0.5, // arbitrary damping factor
// //   armLength: 0.8, // meters
// // };

// // // Skydiver mass
// // pane.addInput(PARAMS, "skydiverMass", { min: 40, max: 120, step: 1 });

// // // Drag coefficient
// // pane.addInput(PARAMS, "dragCoeff", { min: 0.5, max: 2.5, step: 0.01 });

// // // Airplane height
// // pane.addInput(PARAMS, "airplaneHeight", { min: 10000, max: 45000, step: 100 });

// // // Ground type
// // pane.addInput(PARAMS, "groundType", {
// //   options: {
// //     Sand: "sand",
// //     Water: "water",
// //     "Hard Ground": "hard",
// //   },
// // });

// // // Rope tensile strength
// // pane.addInput(PARAMS, "ropeStrength", { min: 100, max: 2000, step: 10 });

// // // Wind - North/South
// // pane.addInput(PARAMS, "windNS", {
// //   options: {
// //     None: "none",
// //     North: "north",
// //     South: "south",
// //   },
// // });

// // // Wind - East/West
// // pane.addInput(PARAMS, "windEW", {
// //   options: {
// //     None: "none",
// //     East: "east",
// //     West: "west",
// //   },
// // });

// // // Yaw damping coefficient
// // pane.addInput(PARAMS, "yawDamping", { min: 0.1, max: 2.0, step: 0.01 });

// // // Arm length
// // pane.addInput(PARAMS, "armLength", { min: 0.3, max: 1.5, step: 0.01 });

// // // add something
// // let planeModel = null;
// // let pilotModel = null;
// // let pilotArmsModel = null;
// // let pilotLegsModel = null;
// // let pilotArmsLegsModel = null;
// // let parachute_1_Model = null;
// // let parachute_2_Model = null;
// // let parachute_3_Model = null;
// // let parachute_4_Model = null;

// // let ispilotDropping = false;
// // let pilotHasParachute = false;
// // let reachedGround = false;
// // let landingBox = null;
// // let currentLandingBoxType = "hard";
// // let groundLevel = -30000;

// // let currentCameraTarget = "pilot";

// // // add plane model
// // const loader = new GLTFLoader();

// // loader.load("/models/helicopter.glb", (gltf) => {
// //   planeModel = gltf.scene;
// //   planeModel.scale.setScalar(0.4);
// //   planeModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
// //   scene.add(planeModel);
// // });

// // loader.load("/models/PILOT.glb", (gltf) => {
// //   pilotModel = gltf.scene;
// //   pilotModel.scale.setScalar(10);
// //   pilotModel.position.set(0, 0, 0);
// //   pilotModel.visible = false; // Hide initially
// //   scene.add(pilotModel);
// // });

// // loader.load("/models/PILOT_ARMS.glb", (gltf) => {
// //   pilotArmsModel = gltf.scene;
// //   pilotArmsModel.scale.setScalar(10);
// //   pilotArmsModel.position.set(0, 0, 0);
// //   pilotArmsModel.visible = false; // Hide initially
// //   scene.add(pilotArmsModel);
// // });

// // loader.load("/models/PILOT_LEGS.glb", (gltf) => {
// //   pilotLegsModel = gltf.scene;
// //   pilotLegsModel.scale.setScalar(10);
// //   pilotLegsModel.position.set(0, 0, 0);
// //   pilotLegsModel.visible = false; // Hide initially
// //   scene.add(pilotLegsModel);
// // });

// // loader.load("/models/PILOT_ARMS_LEGS.glb", (gltf) => {
// //   pilotArmsLegsModel = gltf.scene;
// //   pilotArmsLegsModel.scale.setScalar(10);
// //   pilotArmsLegsModel.position.set(0, 0, 0);
// //   pilotArmsLegsModel.visible = false; // Hide initially
// //   scene.add(pilotArmsLegsModel);
// // });

// // // draw parachute
// // function createParachute(x_val, y_val) {
// //   const object = new THREE.Group();

// //   const canopyMaterial = new THREE.MeshBasicMaterial({ map: parachuteTexture });

// //   const canopyPoints = [
// //     new THREE.Vector2(1.5, 0),
// //     new THREE.Vector2(1.4, 0.3),
// //     new THREE.Vector2(1.2, 0.6),
// //     new THREE.Vector2(1.0, 0.8),
// //     new THREE.Vector2(0.8, 1.0),
// //     new THREE.Vector2(0.6, 1.1),
// //     new THREE.Vector2(0.4, 1.2),
// //     new THREE.Vector2(0.2, 1.3),
// //     new THREE.Vector2(0, 1.4),
// //     new THREE.Vector2(-0.2, 1.3),
// //     new THREE.Vector2(-0.4, 1.2),
// //     new THREE.Vector2(-0.6, 1.1),
// //     new THREE.Vector2(-0.8, 1.0),
// //     new THREE.Vector2(-1.0, 0.8),
// //     new THREE.Vector2(-1.2, 0.6),
// //     new THREE.Vector2(-1.4, 0.3),
// //     new THREE.Vector2(-1.5, 0),
// //   ];

// //   const canopyGeometry = new THREE.LatheGeometry(canopyPoints);
// //   const parachute = new THREE.Mesh(canopyGeometry, canopyMaterial);
// //   object.add(parachute);

// //   const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });

// //   const line1 = new THREE.Line(
// //     new THREE.BufferGeometry().setFromPoints([
// //       new THREE.Vector3(-1.5, 0, 0),
// //       new THREE.Vector3(-x_val, -y_val, 0),
// //     ]),
// //     lineMat
// //   );

// //   const line2 = new THREE.Line(
// //     new THREE.BufferGeometry().setFromPoints([
// //       new THREE.Vector3(1.5, 0, 0),
// //       new THREE.Vector3(x_val, -y_val, 0),
// //     ]),
// //     lineMat
// //   );

// //   object.add(line1, line2);

// //   return object;
// // }

// // // draw landing box
// // function createLandingBox(filler_type) {
// //   const boxGroup = new THREE.Group();
// //   const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

// //   // ground
// //   const boxGroundGeometry = new THREE.BoxGeometry(5, 0.25, 5);
// //   const uv2boxGroundGeometry = new THREE.BufferAttribute(boxGroundGeometry.attributes.uv.array, 2);
// //   boxGroundGeometry.setAttribute('uv2', uv2boxGroundGeometry);

// //   const boxGroundMesh = new THREE.Mesh(boxGroundGeometry, boxMaterial);

// //   // left
// //   const boxLeftSideGeometry = new THREE.BoxGeometry(0.25, 1, 5);
// //   const uv2boxLeftSideGeometry = new THREE.BufferAttribute(boxLeftSideGeometry.attributes.uv.array, 2);
// //   boxLeftSideGeometry.setAttribute('uv2', uv2boxLeftSideGeometry);

// //   const boxLeftSideMesh = new THREE.Mesh(boxLeftSideGeometry, boxMaterial);
// //   boxLeftSideMesh.position.y += 0.5;
// //   boxLeftSideMesh.position.x -= 2.375;

// //   // right
// //   const boxRightSideGeometry = new THREE.BoxGeometry(0.25, 1, 5);
// //   const uv2boxRightSideGeometry = new THREE.BufferAttribute(boxRightSideGeometry.attributes.uv.array, 2);
// //   boxRightSideGeometry.setAttribute('uv2', uv2boxRightSideGeometry);

// //   const boxRightSideMesh = new THREE.Mesh(boxRightSideGeometry, boxMaterial);
// //   boxRightSideMesh.position.y += 0.5;
// //   boxRightSideMesh.position.x += 2.375;

// //   // front
// //   const boxFrontSideGeometry = new THREE.BoxGeometry(4.5, 1, 0.25);
// //   const uv2boxFrontSideGeometry = new THREE.BufferAttribute(boxFrontSideGeometry.attributes.uv.array, 2);
// //   boxFrontSideGeometry.setAttribute('uv2', uv2boxFrontSideGeometry);

// //   const boxFrontSideMesh = new THREE.Mesh(boxFrontSideGeometry, boxMaterial);
// //   boxFrontSideMesh.position.y += 0.5;
// //   boxFrontSideMesh.position.z += 2.375;

// //   // back
// //   const boxBackSideGeometry = new THREE.BoxGeometry(4.5, 1, 0.25);
// //   const uv2boxBackSideGeometry = new THREE.BufferAttribute(boxBackSideGeometry.attributes.uv.array, 2);
// //   boxBackSideGeometry.setAttribute('uv2', uv2boxBackSideGeometry);

// //   const boxBackSideMesh = new THREE.Mesh(boxBackSideGeometry, boxMaterial);
// //   boxBackSideMesh.position.y += 0.5;
// //   boxBackSideMesh.position.z -= 2.375;

// //   // filler
// //   const fillerGeometry = new THREE.BoxGeometry(4.5, 0.5, 4.5);
// //   const uv2fillerGeometry = new THREE.BufferAttribute(fillerGeometry.attributes.uv.array, 2);
// //   fillerGeometry.setAttribute('uv2', uv2fillerGeometry);

// //   let fillerMaterial = null;
// //   if (filler_type === "water") {
// //     fillerMaterial = new THREE.MeshStandardMaterial({ color: 0x1e90ff, transparent: true, opacity: 0.7 });
// //   } else if (filler_type === "sand") {
// //     fillerMaterial = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
// //   } else if (filler_type === "hard") {
// //     fillerMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
// //   } else return null;

// //   const fillerMesh = new THREE.Mesh(fillerGeometry, fillerMaterial);
// //   fillerMesh.position.set(0, 0.5, 0);

// //   boxGroup.add(boxGroundMesh, boxLeftSideMesh, boxRightSideMesh, boxFrontSideMesh, boxBackSideMesh, fillerMesh);
// //   return boxGroup;
// // }

// // // function to update landing box
// // function updateLandingBox() {
// //   if (PARAMS.groundType === "hard" || PARAMS.groundType === "sand") {
// //     groundLevel = -29985;
// //   } else if (PARAMS.groundType === "water") {
// //     groundLevel = -29995;
// //   }

// //   if (landingBox && pilotModel) {
// //     landingBox.position.set(pilotModel.position.x, -30000, pilotModel.position.z);
// //   }
// //   // remove old one
// //   if (landingBox && currentLandingBoxType != PARAMS.groundType) {
// //     scene.remove(landingBox);
// //     landingBox.traverse((child) => {
// //       if (child.isMesh) {
// //         child.geometry.dispose();
// //         child.material.dispose();
// //       }
// //     });
// //     landingBox = null;
// //   } else if (!landingBox) {
// //     // create new one
// //     landingBox = createLandingBox(PARAMS.groundType);
// //     currentLandingBoxType = PARAMS.groundType;
// //     if (landingBox) {
// //       landingBox.position.set(0, -30000, 0); // set where the pilot lands
// //       landingBox.scale.setScalar(20, 20, 20);
// //       scene.add(landingBox);
// //     }
// //   } else return;
// // }

// // updateLandingBox();

// // // add light
// // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// // scene.add(ambientLight);

// // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// // directionalLight.position.set(5, 10, 7.5);
// // scene.add(directionalLight);

// // // initialize the camera
// // const camera = new THREE.PerspectiveCamera(
// //   75,
// //   window.innerWidth / window.innerHeight,
// //   0.1,
// //   100000
// // );

// // // initialize the renderer
// // const canvas = document.querySelector("canvas.threejs");
// // const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
// // renderer.setSize(window.innerWidth, window.innerHeight);
// // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // // add resize listener
// // window.addEventListener("resize", () => {
// //   camera.aspect = window.innerWidth / window.innerHeight;
// //   camera.updateProjectionMatrix();
// //   renderer.setSize(window.innerWidth, window.innerHeight);
// // });

// // let dropSpeed = 50;

// // // add keyboard listener

// // window.addEventListener("keydown", (event) => {
// //   if (event.key === "s") {
// //     if (pilotModel && planeModel && !ispilotDropping) {
// //       pilotModel.visible = true;
// //       pilotModel.position.set(
// //         planeModel.position.x,
// //         planeModel.position.y - 5,
// //         planeModel.position.z
// //       );
// //       if (pilotArmsModel) {
// //         pilotArmsModel.position.set(
// //           planeModel.position.x,
// //           planeModel.position.y - 5,
// //           planeModel.position.z
// //         );
// //       }
// //       if (pilotLegsModel) {
// //         pilotLegsModel.position.set(
// //           planeModel.position.x,
// //           planeModel.position.y - 5,
// //           planeModel.position.z
// //         );
// //       }
// //       if (pilotArmsLegsModel) {
// //         pilotArmsLegsModel.position.set(
// //           planeModel.position.x,
// //           planeModel.position.y - 5,
// //           planeModel.position.z
// //         );
// //       }
// //       ispilotDropping = true;
// //       currentCameraTarget = "pilot";
// //     }
// //   }

// //   if (event.key === "a") {
// //     // open Arms
// //     if (
// //       pilotModel &&
// //       pilotArmsModel &&
// //       planeModel &&
// //       ispilotDropping &&
// //       pilotModel.visible
// //     ) {
// //       pilotModel.visible = false;
// //       pilotArmsModel.visible = true;
// //     } else if (
// //       pilotLegsModel &&
// //       pilotArmsLegsModel &&
// //       planeModel &&
// //       ispilotDropping &&
// //       pilotLegsModel.visible
// //     ) {
// //       pilotLegsModel.visible = false;
// //       pilotArmsLegsModel.visible = true;
// //     }
// //   }

// //   if (event.key === "c") {
// //     // close Arms
// //     if (
// //       pilotModel &&
// //       pilotArmsModel &&
// //       planeModel &&
// //       ispilotDropping &&
// //       pilotArmsModel.visible
// //     ) {
// //       pilotModel.visible = true;
// //       pilotArmsModel.visible = false;
// //     } else if (
// //       pilotLegsModel &&
// //       pilotArmsLegsModel &&
// //       planeModel &&
// //       ispilotDropping &&
// //       pilotArmsLegsModel.visible
// //     ) {
// //       pilotLegsModel.visible = true;
// //       pilotArmsLegsModel.visible = false;
// //     }
// //   }

// //   if (event.key === "l" && ispilotDropping) {
// //     // open legs
// //     if (
// //       pilotModel &&
// //       pilotLegsModel &&
// //       planeModel &&
// //       ispilotDropping &&
// //       pilotModel.visible
// //     ) {
// //       pilotModel.visible = false;
// //       pilotLegsModel.visible = true;
// //     } else if (
// //       pilotModel &&
// //       pilotArmsLegsModel &&
// //       planeModel &&
// //       ispilotDropping &&
// //       pilotArmsModel.visible
// //     ) {
// //       pilotArmsModel.visible = false;
// //       pilotArmsLegsModel.visible = true;
// //     }
// //   }

// //   if (event.key === "x") {
// //     // close Legs
// //     if (
// //       pilotModel &&
// //       pilotLegsModel &&
// //       planeModel &&
// //       ispilotDropping &&
// //       pilotLegsModel.visible
// //     ) {
// //       pilotModel.visible = true;
// //       pilotLegsModel.visible = false;
// //     } else if (
// //       pilotModel &&
// //       pilotArmsLegsModel &&
// //       planeModel &&
// //       ispilotDropping &&
// //       pilotArmsLegsModel.visible
// //     ) {
// //       pilotArmsModel.visible = true;
// //       pilotArmsLegsModel.visible = false;
// //     }
// //   }

// //   if (event.key === "o") {
// //     dropSpeed = 10;
// //     if (pilotModel && !pilotHasParachute && ispilotDropping) {
// //       const parachute_1 = createParachute(0.4, 2.1);
// //       parachute_1.position.set(0, 3.2, 0);
// //       parachute_1.scale.setScalar(1.1);
// //       pilotModel.add(parachute_1);

// //       const parachute_3 = createParachute(0.4, 2.1);
// //       parachute_3.position.set(0, 3.2, 0);
// //       parachute_3.scale.setScalar(1.1);
// //       pilotLegsModel.add(parachute_3);

// //       const parachute_2 = createParachute(0.8, 2.1);
// //       parachute_2.position.set(0, 3.9, 0);
// //       parachute_2.scale.setScalar(1.1);
// //       pilotArmsModel.add(parachute_2);

// //       const parachute_4 = createParachute(0.8, 2.1);
// //       parachute_4.position.set(0, 3.4, 0);
// //       parachute_4.scale.setScalar(1.1);
// //       pilotArmsLegsModel.add(parachute_4);

// //       pilotHasParachute = true;
// //       parachute_1_Model = parachute_1;
// //       parachute_2_Model = parachute_2;
// //       parachute_3_Model = parachute_3;
// //       parachute_4_Model = parachute_4;
// //     }
// //   }

// //   if (event.key === "h") {
// //     dropSpeed = 50;
// //     if (pilotModel && pilotHasParachute && ispilotDropping) {
// //       pilotHasParachute = false;
// //       parachute_1_Model.visible = false;
// //       parachute_2_Model.visible = false;
// //       parachute_3_Model.visible = false;
// //       parachute_4_Model.visible = false;
// //     }
// //   }
// // });

// // const cursor = {
// //   x: 0,
// //   y: 0,
// // };
// // let isCameraActive = false;

// // // Activate on click
// // canvas.addEventListener("mousedown", () => {
// //   isCameraActive = true;
// // });

// // // Deactivate on mouse up
// // canvas.addEventListener("mouseup", () => {
// //   isCameraActive = false;
// // });

// // // Update cursor only when camera is active
// // canvas.addEventListener("mousemove", (event) => {
// //   if (!isCameraActive) return;

// //   const rect = canvas.getBoundingClientRect();
// //   cursor.x = (event.clientX - rect.left) / rect.width - 0.5;
// //   cursor.y = -((event.clientY - rect.top) / rect.height - 0.5);
// // });

// // window.addEventListener("wheel", (event) => {
// //   // Zoom in = decrease FOV, Zoom out = increase FOV
// //   camera.fov += event.deltaY * 0.05; 
// //   camera.fov = THREE.MathUtils.clamp(camera.fov, 20, 100); // keep it in a range
// //   camera.updateProjectionMatrix();
// // });

// // // render loop
// // const renderloop = () => {
// //   if (planeModel) {
// //     planeModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
// //   }
// //   if (planeModel && pilotModel && !ispilotDropping && !reachedGround) {
// //     pilotModel.position.set(
// //       planeModel.position.x,
// //       planeModel.position.y - 5,
// //       planeModel.position.z
// //     );
// //   }

// //   if (ispilotDropping && pilotModel) {
// //     pilotModel.position.y = Math.max(pilotModel.position.y - dropSpeed, groundLevel + 1); // Drop speed
// //     pilotArmsModel.position.y = Math.max(
// //       pilotArmsModel.position.y - dropSpeed,
// //       groundLevel + 1
// //     ); // Drop speed
// //     pilotLegsModel.position.y = Math.max(
// //       pilotLegsModel.position.y - dropSpeed,
// //       groundLevel + 1
// //     ); // Drop speed
// //     pilotArmsLegsModel.position.y = Math.max(
// //       pilotArmsLegsModel.position.y - dropSpeed,
// //       groundLevel + 1
// //     ); // Drop speed

// //     if (pilotModel.position.y <= groundLevel + 1) {
// //       ispilotDropping = false;
// //       reachedGround = true;
// //       // Hide the parachute if it exists
// //       if (
// //         parachute_1_Model ||
// //         parachute_2_Model ||
// //         parachute_3_Model ||
// //         parachute_4_Model
// //       ) {
// //         parachute_1_Model.visible = false;
// //         parachute_2_Model.visible = false;
// //         parachute_3_Model.visible = false;
// //         parachute_4_Model.visible = false;
// //       }
// //       if (
// //         pilotModel &&
// //         pilotLegsModel &&
// //         planeModel &&
// //         pilotLegsModel.visible
// //       ) {
// //         pilotModel.visible = true;
// //         pilotLegsModel.visible = false;
// //       } else if (
// //         pilotModel &&
// //         pilotArmsLegsModel &&
// //         planeModel &&
// //         pilotArmsLegsModel.visible
// //       ) {
// //         pilotArmsModel.visible = true;
// //         pilotArmsLegsModel.visible = false;
// //       }

// //       if (camera.position.y < groundLevel + 10) {
// //         camera.position.y = groundLevel + 10;
// //       }
// //     }
// //   }

// //   if (currentCameraTarget === "pilot" && pilotModel) {
// //     const radius = 70; // Distance from the pilot
// //     const horizontalAngle = cursor.x * Math.PI * 2; // Full rotation horizontally
// //     const verticalAngle = cursor.y * Math.PI * 0.5; // Limit vertical tilt to 90°
// //     camera.position.x =
// //       pilotModel.position.x +
// //       Math.sin(horizontalAngle) * Math.cos(verticalAngle) * radius;

// //     camera.position.z =
// //       pilotModel.position.z +
// //       Math.cos(horizontalAngle) * Math.cos(verticalAngle) * radius;

// //     camera.position.y =
// //       pilotModel.position.y + Math.sin(verticalAngle) * radius + 20;

// //     if (reachedGround) {
// //       // const groundLevel = pilotModel.position.y + 20; // keep camera above ground
// //       if (camera.position.y < groundLevel + 10) {
// //         camera.position.y = groundLevel + 10;
// //       }
// //     }
// //     const lookAtOffset = 10; // adjust until it feels natural
// //     camera.lookAt(
// //       new THREE.Vector3(
// //         pilotModel.position.x,
// //         pilotModel.position.y + lookAtOffset,
// //         pilotModel.position.z
// //       )
// //     );
// //   }

// //   if (reachedGround) {
// //     pilotModel.position.y = groundLevel + 1;
// //     pilotArmsModel.position.y = groundLevel + 1;
// //     pilotLegsModel.position.y = groundLevel + 1;
// //     pilotArmsLegsModel.position.y = groundLevel + 1;
// //   }

// //   updateLandingBox();

// //   // controls.update();
// //   renderer.render(scene, camera);
// //   window.requestAnimationFrame(renderloop);
// // };

// // renderloop();
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { Pane } from "tweakpane";
// import { SkeletonHelper } from "three";

// // initialize pane
// const pane = new Pane();

// // initialize the scene
// const scene = new THREE.Scene();

// // initialize texture loader
// const textureLoader = new THREE.TextureLoader();

// const parachuteTexture = textureLoader.load("textures/parachute.jpg");
// // add skybox

// let materialArray = [];
// let texture_ft = new THREE.TextureLoader().load("textures/cubeMap/px.jpg");
// let texture_bk = new THREE.TextureLoader().load("textures/cubeMap/nx.jpg");
// let texture_up = new THREE.TextureLoader().load("textures/cubeMap/py.jpg");
// let texture_dn = new THREE.TextureLoader().load("textures/cubeMap/ny.jpg");
// let texture_rt = new THREE.TextureLoader().load("textures/cubeMap/pz.jpg");
// let texture_lf = new THREE.TextureLoader().load("textures/cubeMap/nz.jpg");

// materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
// materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
// materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
// materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
// materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
// materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

// for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

// let skyboxGeo = new THREE.BoxGeometry(50000, 50000, 50000);
// let skybox = new THREE.Mesh(skyboxGeo, materialArray);
// skybox.position.y = -5000;
// scene.add(skybox);

// let PARAMS = {
//   skydiverMass: 80, // kg
//   dragCoeff: 1.2, // typical for a human + parachute
//   airplaneHeight: 1500, // 🆕 تم تعديل الارتفاع ليتطابق مع كود الفيزياء
//   groundType: "hard", // sand, water, hard
//   ropeStrength: 500, // Newtons before breaking
//   windNS: "none", // north, south, none
//   windEW: "none", // east, west, none
//   yawDamping: 0.5, // arbitrary damping factor
//   armLength: 0.8, // meters
// };

// // Skydiver mass
// pane.addInput(PARAMS, "skydiverMass", { min: 40, max: 120, step: 1 });

// // Drag coefficient
// pane.addInput(PARAMS, "dragCoeff", { min: 0.5, max: 2.5, step: 0.01 });

// // Airplane height
// pane.addInput(PARAMS, "airplaneHeight", { min: 1500, max: 5000, step: 100 });

// // Ground type
// pane.addInput(PARAMS, "groundType", {
//   options: {
//     Sand: "sand",
//     Water: "water",
//     "Hard Ground": "hard",
//   },
// });

// // Rope tensile strength
// pane.addInput(PARAMS, "ropeStrength", { min: 100, max: 2000, step: 10 });

// // Wind - North/South
// pane.addInput(PARAMS, "windNS", {
//   options: {
//     None: "none",
//     North: "north",
//     South: "south",
//   },
// });

// // Wind - East/West
// pane.addInput(PARAMS, "windEW", {
//   options: {
//     None: "none",
//     East: "east",
//     West: "west",
//   },
// });

// // Yaw damping coefficient
// pane.addInput(PARAMS, "yawDamping", { min: 0.1, max: 2.0, step: 0.01 });

// // Arm length
// pane.addInput(PARAMS, "armLength", { min: 0.3, max: 1.5, step: 0.01 });

// // add something
// let planeModel = null;
// let pilotModel = null;
// let pilotArmsModel = null;
// let pilotLegsModel = null;
// let pilotArmsLegsModel = null;
// let parachute_1_Model = null;
// let parachute_2_Model = null;
// let parachute_3_Model = null;
// let parachute_4_Model = null;

// let ispilotDropping = false;
// let pilotHasParachute = false;
// let reachedGround = false;
// let landingBox = null;
// let currentLandingBoxType = "hard";
// let groundLevel = -30000;

// let currentCameraTarget = "pilot";

// // add plane model
// const loader = new GLTFLoader();

// loader.load("/models/helicopter.glb", (gltf) => {
//   planeModel = gltf.scene;
//   planeModel.scale.setScalar(0.4);
//   planeModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
//   scene.add(planeModel);
// });

// loader.load("/models/PILOT.glb", (gltf) => {
//   pilotModel = gltf.scene;
//   pilotModel.scale.setScalar(10);
//   pilotModel.position.set(0, 0, 0);
//   pilotModel.visible = false; // Hide initially
//   scene.add(pilotModel);
// });

// loader.load("/models/PILOT_ARMS.glb", (gltf) => {
//   pilotArmsModel = gltf.scene;
//   pilotArmsModel.scale.setScalar(10);
//   pilotArmsModel.position.set(0, 0, 0);
//   pilotArmsModel.visible = false; // Hide initially
//   scene.add(pilotArmsModel);
// });

// loader.load("/models/PILOT_LEGS.glb", (gltf) => {
//   pilotLegsModel = gltf.scene;
//   pilotLegsModel.scale.setScalar(10);
//   pilotLegsModel.position.set(0, 0, 0);
//   pilotLegsModel.visible = false; // Hide initially
//   scene.add(pilotLegsModel);
// });

// loader.load("/models/PILOT_ARMS_LEGS.glb", (gltf) => {
//   pilotArmsLegsModel = gltf.scene;
//   pilotArmsLegsModel.scale.setScalar(10);
//   pilotArmsLegsModel.position.set(0, 0, 0);
//   pilotArmsLegsModel.visible = false; // Hide initially
//   scene.add(pilotArmsLegsModel);
// });

// // draw parachute
// function createParachute(x_val, y_val) {
//   const object = new THREE.Group();

//   const canopyMaterial = new THREE.MeshBasicMaterial({ map: parachuteTexture });

//   const canopyPoints = [
//     new THREE.Vector2(1.5, 0),
//     new THREE.Vector2(1.4, 0.3),
//     new THREE.Vector2(1.2, 0.6),
//     new THREE.Vector2(1.0, 0.8),
//     new THREE.Vector2(0.8, 1.0),
//     new THREE.Vector2(0.6, 1.1),
//     new THREE.Vector2(0.4, 1.2),
//     new THREE.Vector2(0.2, 1.3),
//     new THREE.Vector2(0, 1.4),
//     new THREE.Vector2(-0.2, 1.3),
//     new THREE.Vector2(-0.4, 1.2),
//     new THREE.Vector2(-0.6, 1.1),
//     new THREE.Vector2(-0.8, 1.0),
//     new THREE.Vector2(-1.0, 0.8),
//     new THREE.Vector2(-1.2, 0.6),
//     new THREE.Vector2(-1.4, 0.3),
//     new THREE.Vector2(-1.5, 0),
//   ];

//   const canopyGeometry = new THREE.LatheGeometry(canopyPoints);
//   const parachute = new THREE.Mesh(canopyGeometry, canopyMaterial);
//   object.add(parachute);

//   const lineMat = new THREE.LineBasicMaterial({ color: 0x000000 });

//   const line1 = new THREE.Line(
//     new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(-1.5, 0, 0),
//       new THREE.Vector3(-x_val, -y_val, 0),
//     ]),
//     lineMat
//   );

//   const line2 = new THREE.Line(
//     new THREE.BufferGeometry().setFromPoints([
//       new THREE.Vector3(1.5, 0, 0),
//       new THREE.Vector3(x_val, -y_val, 0),
//     ]),
//     lineMat
//   );

//   object.add(line1, line2);

//   return object;
// }

// // draw landing box
// function createLandingBox(filler_type) {
//   const boxGroup = new THREE.Group();
//   const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

//   // ground
//   const boxGroundGeometry = new THREE.BoxGeometry(5, 0.25, 5);
//   const uv2boxGroundGeometry = new THREE.BufferAttribute(boxGroundGeometry.attributes.uv.array, 2);
//   boxGroundGeometry.setAttribute('uv2', uv2boxGroundGeometry);

//   const boxGroundMesh = new THREE.Mesh(boxGroundGeometry, boxMaterial);

//   // left
//   const boxLeftSideGeometry = new THREE.BoxGeometry(0.25, 1, 5);
//   const uv2boxLeftSideGeometry = new THREE.BufferAttribute(boxLeftSideGeometry.attributes.uv.array, 2);
//   boxLeftSideGeometry.setAttribute('uv2', uv2boxLeftSideGeometry);

//   const boxLeftSideMesh = new THREE.Mesh(boxLeftSideGeometry, boxMaterial);
//   boxLeftSideMesh.position.y += 0.5;
//   boxLeftSideMesh.position.x -= 2.375;

//   // right
//   const boxRightSideGeometry = new THREE.BoxGeometry(0.25, 1, 5);
//   const uv2boxRightSideGeometry = new THREE.BufferAttribute(boxRightSideGeometry.attributes.uv.array, 2);
//   boxRightSideGeometry.setAttribute('uv2', uv2boxRightSideGeometry);

//   const boxRightSideMesh = new THREE.Mesh(boxRightSideGeometry, boxMaterial);
//   boxRightSideMesh.position.y += 0.5;
//   boxRightSideMesh.position.x += 2.375;

//   // front
//   const boxFrontSideGeometry = new THREE.BoxGeometry(4.5, 1, 0.25);
//   const uv2boxFrontSideGeometry = new THREE.BufferAttribute(boxFrontSideGeometry.attributes.uv.array, 2);
//   boxFrontSideGeometry.setAttribute('uv2', uv2boxFrontSideGeometry);

//   const boxFrontSideMesh = new THREE.Mesh(boxFrontSideGeometry, boxMaterial);
//   boxFrontSideMesh.position.y += 0.5;
//   boxFrontSideMesh.position.z += 2.375;

//   // back
//   const boxBackSideGeometry = new THREE.BoxGeometry(4.5, 1, 0.25);
//   const uv2boxBackSideGeometry = new THREE.BufferAttribute(boxBackSideGeometry.attributes.uv.array, 2);
//   boxBackSideGeometry.setAttribute('uv2', uv2boxBackSideGeometry);

//   const boxBackSideMesh = new THREE.Mesh(boxBackSideGeometry, boxMaterial);
//   boxBackSideMesh.position.y += 0.5;
//   boxBackSideMesh.position.z -= 2.375;

//   // filler
//   const fillerGeometry = new THREE.BoxGeometry(4.5, 0.5, 4.5);
//   const uv2fillerGeometry = new THREE.BufferAttribute(fillerGeometry.attributes.uv.array, 2);
//   fillerGeometry.setAttribute('uv2', uv2fillerGeometry);

//   let fillerMaterial = null;
//   if (filler_type === "water") {
//     fillerMaterial = new THREE.MeshStandardMaterial({ color: 0x1e90ff, transparent: true, opacity: 0.7 });
//   } else if (filler_type === "sand") {
//     fillerMaterial = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
//   } else if (filler_type === "hard") {
//     fillerMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
//   } else return null;

//   const fillerMesh = new THREE.Mesh(fillerGeometry, fillerMaterial);
//   fillerMesh.position.set(0, 0.5, 0);

//   boxGroup.add(boxGroundMesh, boxLeftSideMesh, boxRightSideMesh, boxFrontSideMesh, boxBackSideMesh, fillerMesh);
//   return boxGroup;
// }

// // function to update landing box
// function updateLandingBox() {
//   if (PARAMS.groundType === "hard" || PARAMS.groundType === "sand") {
//     groundLevel = -29985;
//   } else if (PARAMS.groundType === "water") {
//     groundLevel = -29995;
//   }

//   if (landingBox && pilotModel) {
//     landingBox.position.set(pilotModel.position.x, -30000, pilotModel.position.z);
//   }
//   // remove old one
//   if (landingBox && currentLandingBoxType != PARAMS.groundType) {
//     scene.remove(landingBox);
//     landingBox.traverse((child) => {
//       if (child.isMesh) {
//         child.geometry.dispose();
//         child.material.dispose();
//       }
//     });
//     landingBox = null;
//   } else if (!landingBox) {
//     // create new one
//     landingBox = createLandingBox(PARAMS.groundType);
//     currentLandingBoxType = PARAMS.groundType;
//     if (landingBox) {
//       landingBox.position.set(0, -30000, 0); // set where the pilot lands
//       landingBox.scale.setScalar(20, 20, 20);
//       scene.add(landingBox);
//     }
//   } else return;
// }

// updateLandingBox();

// // add light
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(5, 10, 7.5);
// scene.add(directionalLight);

// // initialize the camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   100000
// );

// // initialize the renderer
// const canvas = document.querySelector("canvas.threejs");
// const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// // add resize listener
// window.addEventListener("resize", () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// let dropSpeed = 50;

// // add keyboard listener

// window.addEventListener("keydown", (event) => {
//   if (event.key === "s") {
//     if (pilotModel && planeModel && !ispilotDropping) {
//       ispilotDropping = true;
//       pilotModel.visible = true;
//       currentCameraTarget = "pilot";

//       // 🆕 مزامنة ارتفاع الفيزياء مع ارتفاع الطائرة وبدء المحاكاة
//       if (window.parachute) {
//         window.parachute.position.y = PARAMS["airplaneHeight"];
//         window.isSimulationRunning = true;
//         window.animate();
//         console.log("▶️ بدء المحاكاة");
//       }
//     } else if (ispilotDropping && window.parachute) {
//       // 🆕 إيقاف/استئناف المحاكاة
//       window.isSimulationRunning = !window.isSimulationRunning;
//       if (window.isSimulationRunning) {
//         window.animate();
//         console.log("▶️ تم استئناف المحاكاة");
//       } else {
//         console.log("⏸️ تم إيقاف المحاكاة");
//       }
//     }
//   }

//   if (event.key === "a") {
//     // open Arms
//     if (
//       pilotModel &&
//       pilotArmsModel &&
//       planeModel &&
//       ispilotDropping &&
//       pilotModel.visible
//     ) {
//       pilotModel.visible = false;
//       pilotArmsModel.visible = true;
//     } else if (
//       pilotLegsModel &&
//       pilotArmsLegsModel &&
//       planeModel &&
//       ispilotDropping &&
//       pilotLegsModel.visible
//     ) {
//       pilotLegsModel.visible = false;
//       pilotArmsLegsModel.visible = true;
//     }
//   }

//   if (event.key === "c") {
//     // close Arms
//     if (
//       pilotModel &&
//       pilotArmsModel &&
//       planeModel &&
//       ispilotDropping &&
//       pilotArmsModel.visible
//     ) {
//       pilotModel.visible = true;
//       pilotArmsModel.visible = false;
//     } else if (
//       pilotLegsModel &&
//       pilotArmsLegsModel &&
//       planeModel &&
//       ispilotDropping &&
//       pilotArmsLegsModel.visible
//     ) {
//       pilotLegsModel.visible = true;
//       pilotArmsLegsModel.visible = false;
//     }
//   }

//   if (event.key === "l" && ispilotDropping) {
//     // open legs
//     if (
//       pilotModel &&
//       pilotLegsModel &&
//       planeModel &&
//       ispilotDropping &&
//       pilotModel.visible
//     ) {
//       pilotModel.visible = false;
//       pilotLegsModel.visible = true;
//     } else if (
//       pilotModel &&
//       pilotArmsLegsModel &&
//       planeModel &&
//       ispilotDropping &&
//       pilotArmsModel.visible
//     ) {
//       pilotArmsModel.visible = false;
//       pilotArmsLegsModel.visible = true;
//     }
//   }

//   if (event.key === "x") {
//     // close Legs
//     if (
//       pilotModel &&
//       pilotLegsModel &&
//       planeModel &&
//       ispilotDropping &&
//       pilotLegsModel.visible
//     ) {
//       pilotModel.visible = true;
//       pilotLegsModel.visible = false;
//     } else if (
//       pilotModel &&
//       pilotArmsLegsModel &&
//       planeModel &&
//       ispilotDropping &&
//       pilotArmsLegsModel.visible
//     ) {
//       pilotArmsModel.visible = true;
//       pilotArmsLegsModel.visible = false;
//     }
//   }

//   if (event.key === "o") {
//     dropSpeed = 10;
//     if (pilotModel && !pilotHasParachute && ispilotDropping) {
//       const parachute_1 = createParachute(0.4, 2.1);
//       parachute_1.position.set(0, 3.2, 0);
//       parachute_1.scale.setScalar(1.1);
//       pilotModel.add(parachute_1);

//       const parachute_3 = createParachute(0.4, 2.1);
//       parachute_3.position.set(0, 3.2, 0);
//       parachute_3.scale.setScalar(1.1);
//       pilotLegsModel.add(parachute_3);

//       const parachute_2 = createParachute(0.8, 2.1);
//       parachute_2.position.set(0, 3.9, 0);
//       parachute_2.scale.setScalar(1.1);
//       pilotArmsModel.add(parachute_2);

//       const parachute_4 = createParachute(0.8, 2.1);
//       parachute_4.position.set(0, 3.4, 0);
//       parachute_4.scale.setScalar(1.1);
//       pilotArmsLegsModel.add(parachute_4);

//       pilotHasParachute = true;
//       parachute_1_Model = parachute_1;
//       parachute_2_Model = parachute_2;
//       parachute_3_Model = parachute_3;
//       parachute_4_Model = parachute_4;
//     }
//   }

//   if (event.key === "h") {
//     dropSpeed = 50;
//     if (pilotModel && pilotHasParachute && ispilotDropping) {
//       pilotHasParachute = false;
//       parachute_1_Model.visible = false;
//       parachute_2_Model.visible = false;
//       parachute_3_Model.visible = false;
//       parachute_4_Model.visible = false;
//     }
//   }
// });

// const cursor = {
//   x: 0,
//   y: 0,
// };
// let isCameraActive = false;

// // Activate on click
// canvas.addEventListener("mousedown", () => {
//   isCameraActive = true;
// });

// // Deactivate on mouse up
// canvas.addEventListener("mouseup", () => {
//   isCameraActive = false;
// });

// // Update cursor only when camera is active
// canvas.addEventListener("mousemove", (event) => {
//   if (!isCameraActive) return;

//   const rect = canvas.getBoundingClientRect();
//   cursor.x = (event.clientX - rect.left) / rect.width - 0.5;
//   cursor.y = -((event.clientY - rect.top) / rect.height - 0.5);
// });

// window.addEventListener("wheel", (event) => {
//   // Zoom in = decrease FOV, Zoom out = increase FOV
//   camera.fov += event.deltaY * 0.05;
//   camera.fov = THREE.MathUtils.clamp(camera.fov, 20, 100); // keep it in a range
//   camera.updateProjectionMatrix();
// });

// // render loop
// const renderloop = () => {
//   if (planeModel) {
//     planeModel.position.set(0, groundLevel + PARAMS["airplaneHeight"], 0);
//   }
  
//   if (window.isSimulationRunning && pilotModel && window.parachute) {
//     // 🆕 ربط ارتفاع النموذج البصري مباشرة بارتفاع الفيزياء
//     const physicsHeight = window.parachute.position.y;
//     const mappedHeight = physicsHeight + groundLevel;

//     pilotModel.position.y = mappedHeight;
//     pilotModel.position.x = window.parachute.position.x; // 🆕 تحديث الموضع الأفقي
//     pilotModel.position.z = window.parachute.position.z; // 🆕 تحديث الموضع الأفقي
//     pilotModel.rotation.y = window.parachute.yawAngle; // 🆕 ربط الدوران بزاوية الفيزياء

//     // تطبيق التغييرات على جميع النماذج المرئية
//     if (pilotArmsModel) pilotArmsModel.position.copy(pilotModel.position);
//     if (pilotLegsModel) pilotLegsModel.position.copy(pilotModel.position);
//     if (pilotArmsLegsModel) pilotArmsLegsModel.position.copy(pilotModel.position);
    
//     // 🆕 تحديث دوران جميع النماذج المرئية
//     if (pilotArmsModel) pilotArmsModel.rotation.copy(pilotModel.rotation);
//     if (pilotLegsModel) pilotLegsModel.rotation.copy(pilotModel.rotation);
//     if (pilotArmsLegsModel) pilotArmsLegsModel.rotation.copy(pilotModel.rotation);

//   } else if (!window.isSimulationRunning && pilotModel) {
//     // 🆕 بعد أن توقفت المحاكاة، نضبط الوضع النهائي
//     if (pilotModel.position.y > groundLevel) {
//       pilotModel.position.y = groundLevel; // نضعه على الأرض تمامًا
//     }
//     // إخفاء المظلة
//     if (pilotHasParachute) {
//       parachute_1_Model.visible = false;
//       parachute_2_Model.visible = false;
//       parachute_3_Model.visible = false;
//       parachute_4_Model.visible = false;
//     }
//   }
  
//   if (currentCameraTarget === "pilot" && pilotModel) {
//     const radius = 70; // Distance from the pilot
//     const horizontalAngle = cursor.x * Math.PI * 2; // Full rotation horizontally
//     const verticalAngle = cursor.y * Math.PI * 0.5; // Limit vertical tilt to 90°
//     camera.position.x =
//       pilotModel.position.x +
//       Math.sin(horizontalAngle) * Math.cos(verticalAngle) * radius;

//     camera.position.z =
//       pilotModel.position.z +
//       Math.cos(horizontalAngle) * Math.cos(verticalAngle) * radius;

//     camera.position.y =
//       pilotModel.position.y + Math.sin(verticalAngle) * radius + 20;

//     if (reachedGround) {
//       if (camera.position.y < groundLevel + 10) {
//         camera.position.y = groundLevel + 10;
//       }
//     }
//     const lookAtOffset = 10;
//     camera.lookAt(
//       new THREE.Vector3(
//         pilotModel.position.x,
//         pilotModel.position.y + lookAtOffset,
//         pilotModel.position.z
//       )
//     );
//   }

//   if (reachedGround) {
//     pilotModel.position.y = groundLevel + 1;
//     pilotArmsModel.position.y = groundLevel + 1;
//     pilotLegsModel.position.y = groundLevel + 1;
//     pilotArmsLegsModel.position.y = groundLevel + 1;
//   }

//   updateLandingBox();

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(renderloop);
// };

// renderloop();
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
  airplaneHeight: 1500, // 🆕 تم تعديل الارتفاع ليتطابق مع كود الفيزياء
  groundType: "hard", // sand, water, hard
  ropeStrength: 500, // Newtons before breaking
  windX: 0, // 🆕 جديد: قوة الرياح على محور X
  windZ: 0, // 🆕 جديد: قوة الرياح على محور Z
  tensionLeft: 0, // 🆕 جديد: شد الحبل الأيسر
  tensionRight: 0, // 🆕 جديد: شد الحبل الأيمن
  yawDamping: 0.5, // arbitrary damping factor
  armLength: 0.8, // meters
};

// Skydiver mass
pane.addInput(PARAMS, "skydiverMass", { min: 40, max: 120, step: 1 });

// Drag coefficient
pane.addInput(PARAMS, "dragCoeff", { min: 0.5, max: 2.5, step: 0.01 });

// Airplane height
pane.addInput(PARAMS, "airplaneHeight", { min: 1500, max: 5000, step: 100 });

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

//  تعديل: تحكم مباشر بقوة الرياح على المحورين X و Z
// Wind on X-axis (East/West)
pane.addInput(PARAMS, "windX", { min: -80, max: 80, step: 1, label: 'Wind X (E/W)' });

// Wind on Z-axis (North/South)
pane.addInput(PARAMS, "windZ", { min: -80, max: 80, step: 1, label: 'Wind Z (N/S)' });


//تحكم بشد الحبل الأيسر
pane.addInput(PARAMS, "tensionLeft", { min: 0, max: 200, step: 1, label: 'Tension Left' });

//  تحكم بشد الحبل الأيمن
pane.addInput(PARAMS, "tensionRight", { min: 0, max: 200, step: 1, label: 'Tension Right' });

// Yaw damping coefficient
pane.addInput(PARAMS, "yawDamping", { min: 0.1, max: 2.0, step: 0.01 });

// Arm length
pane.addInput(PARAMS, "armLength", { min: 0.3, max: 1.5, step: 0.01 });

//  الكود الجديد لربط Tweakpane مع الرياح وشد الحبال
pane.on('change', (ev) => {
  if (!window.parachute) return;

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
  if (filler_type === "water") {
    fillerMaterial = new THREE.MeshStandardMaterial({ color: 0x1e90ff, transparent: true, opacity: 0.7 });
  } else if (filler_type === "sand") {
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

// 🆕 موضع الكاميرا الأولي
camera.position.set(0, groundLevel + PARAMS["airplaneHeight"] + 50, 200);

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

// 🆕 متغير جديد للتحكم في دوران الكاميرا
let cameraAngle = 0;
const cameraRadius = 100; // نصف قطر الدوران

// add keyboard listener

window.addEventListener("keydown", (event) => {
  if (event.key === "s") {
    if (pilotModel && planeModel && !ispilotDropping) {
      ispilotDropping = true;
      pilotModel.visible = true;
      currentCameraTarget = "pilot";

      // 🆕 مزامنة ارتفاع الفيزياء مع ارتفاع الطائرة وبدء المحاكاة
      if (window.parachute) {
        window.parachute.position.y = PARAMS["airplaneHeight"];
        window.isSimulationRunning = true;
        window.animate();
        console.log("▶️ بدء المحاكاة");
      }
    } else if (ispilotDropping && window.parachute) {
      // 🆕 إيقاف/استئناف المحاكاة
      window.isSimulationRunning = !window.isSimulationRunning;
      if (window.isSimulationRunning) {
        window.animate();
        console.log("▶️ تم استئناف المحاكاة");
      } else {
        console.log("⏸️ تم إيقاف المحاكاة");
      }
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

    //  تحديث زاوية الدوران 
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
    cameraAngle += 0.002; // سرعة الدوران
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

  renderer.render(scene, camera);
  window.requestAnimationFrame(renderloop);
};

renderloop();