import "./environment/script.js";
import { Parachute } from "./physics/models/Parachute.js";
import { Simulator } from "./physics/simulator/Simulator.js";
import { Vector3 } from "./physics/models/Vector3.js";

let isSimulationRunning = false;
window.isSimulationRunning = isSimulationRunning;

const parachute = new Parachute({
  mass: 60,
  closedArea: 1.0,
  openArea: 15.0,
  dragCoeff: 1.2,
//   initialHeight: 1500,
});
window.parachute = parachute;

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "q":
      parachute.tensionLeft += 50;
      console.log(`⬅️ زيادة الشد في الجهة اليسرى إلى ${parachute.tensionLeft} نيوتن`);
      break;
    case "e":
      parachute.tensionRight += 50;
      console.log(`➡️ زيادة الشد في الجهة اليمنى إلى ${parachute.tensionRight} نيوتن`);
      break;
    case "a":
      parachute.tensionLeft = Math.max(0, parachute.tensionLeft - 50);
      console.log(`⬅️ تقليل الشد في الجهة اليسرى إلى ${parachute.tensionLeft} نيوتن`);
      break;
    case "d":
      parachute.tensionRight = Math.max(0, parachute.tensionRight - 50);
      console.log(`➡️ تقليل الشد في الجهة اليمنى إلى ${parachute.tensionRight} نيوتن`);
      break;
    case "c":
      parachute.yawDampingCoeff += 0.01;
      console.log(`🌀 زيادة معامل مقاومة الدوران إلى ${parachute.yawDampingCoeff.toFixed(2)}`);
      break;
    case "f":
      parachute.yawDampingCoeff = Math.max(0, parachute.yawDampingCoeff - 0.01);
      console.log(`🌀 تقليل معامل مقاومة الدوران إلى ${parachute.yawDampingCoeff.toFixed(2)}`);
      break;
  }
});

function animate() {
  if (!window.isSimulationRunning) return;
  parachute.update(0.05);
//   console.log(
//     `Pos: ${parachute.position.toString()} | Vel: ${parachute.velocity.toString()} | Wind: ${parachute.wind.toString()}`
//   );
//   console.log(`Yaw Angle: ${parachute.yawAngle.toFixed(2)}°`);

  if (parachute.position.y <= 0) {
    console.log("✅ Reached Ground");
    window.isSimulationRunning = false;
  } else {
    requestAnimationFrame(animate);
  }
}
window.animate = animate;