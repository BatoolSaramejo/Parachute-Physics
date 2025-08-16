// import "./environment/script.js";
// import { Parachute } from "./physics/models/Parachute.js";
// import { Simulator } from "./physics/simulator/Simulator.js";
// import { Vector3 } from "./physics/models/Vector3.js";

// let isSimulationRunning = false; //  خلي الوضع الافتراضي متوقف

// const parachute = new Parachute({
//   mass: 90,
//   closedArea: 1.0,
//   openArea: 15.0,
//   dragCoeff: 1.2,
//   initialHeight: 1500,
// });
// window.parachute = parachute;

// window.addEventListener("keydown", (event) => {
//   switch (event.key) {
//     case "n":
//       parachute.changePosture(1.5);
//       console.log("🤸‍♂️ تم نشر اليدين (وضعية أكبر تزيد مقاومة الهواء)");
//       break;
//     case "m":
//       parachute.changePosture(1.0);
//       console.log("🧍‍♂️ تم ضم اليدين (وضعية أصغر تقلل مقاومة الهواء)");
//       break;
//     case "b":
//       parachute.changeLegPosture(1.5);
//       console.log("🦵 تم نشر الرجلين (وضعية أكبر تزيد مقاومة الهواء)");
//       break;
//     case "v":
//       parachute.changeLegPosture(1.0);
//       console.log("🦵 تم ضم الرجلين (وضعية أصغر تقلل مقاومة الهواء)");
//       break;
//     case "p":
//       parachute.isParachuteOpen = !parachute.isParachuteOpen;
//       console.log(parachute.isParachuteOpen ? "🪂 تم فتح المظلة" : "🎒 تم إغلاق المظلة");
//       break;
//     case "q":
//       parachute.tensionLeft += 50;
//       console.log(`⬅️ زيادة الشد في الجهة اليسرى إلى ${parachute.tensionLeft} نيوتن`);
//       break;
//     case "e":
//       parachute.tensionRight += 50;
//       console.log(`➡️ زيادة الشد في الجهة اليمنى إلى ${parachute.tensionRight} نيوتن`);
//       break;
//     case "a":
//       parachute.tensionLeft = Math.max(0, parachute.tensionLeft - 50);
//       console.log(`⬅️ تقليل الشد في الجهة اليسرى إلى ${parachute.tensionLeft} نيوتن`);
//       break;
//     case "d":
//       parachute.tensionRight = Math.max(0, parachute.tensionRight - 50);
//       console.log(`➡️ تقليل الشد في الجهة اليمنى إلى ${parachute.tensionRight} نيوتن`);
//       break;
//     case "z":
//       parachute.armLength += 0.05;
//       console.log(`🦾 زيادة طول الذراع إلى ${parachute.armLength.toFixed(2)} متر`);
//       break;
//     case "x":
//       parachute.armLength = Math.max(0.1, parachute.armLength - 0.05);
//       console.log(`🦿 تقليل طول الذراع إلى ${parachute.armLength.toFixed(2)} متر`);
//       break;
//     case "c":
//       parachute.yawDampingCoeff += 0.01;
//       console.log(`🌀 زيادة معامل مقاومة الدوران إلى ${parachute.yawDampingCoeff.toFixed(2)}`);
//       break;
//     case "f":
//       parachute.yawDampingCoeff = Math.max(0, parachute.yawDampingCoeff - 0.01);
//       console.log(`🌀 تقليل معامل مقاومة الدوران إلى ${parachute.yawDampingCoeff.toFixed(2)}`);
//       break;
//     case "r":
//       parachute.position = new Vector3(0, 1500, 0);
//       parachute.velocity = new Vector3(0, 0, 0);
//       parachute.angularVelocity = new Vector3(0, 0, 0);
//       parachute.orientation = new Vector3(0, 0, 0);
//       parachute.yawAngle = 0;
//       parachute.hasStoppedRotation = false;
//       console.log("🔄 إعادة تعيين المحاكاة - main.js:114");
//       isSimulationRunning = false; // ⚠️ خليها متوقفة بعد إعادة التعيين
//       break;
//    case "s":
//   if (!isSimulationRunning) { // فقط إذا لم تكن المحاكاة تعمل مسبقًا
//     isSimulationRunning = true;
//     console.log("▶️ بدء المحاكاة ولن يمكن إيقافها بعد الآن");
//     animate();
//   }
//   break;

//     case "1":
//       parachute.surfaceType = "hard";
//       console.log("🪨 تم اختيار سطح صلب - main.js:129");
//       break;
//     case "2":
//       parachute.surfaceType = "sand";
//       console.log("🏖️ تم اختيار سطح رملي - main.js:133");
//       break;
//     case "3":
//       parachute.surfaceType = "water";
//       console.log("🌊 تم اختيار سطح مائي - main.js:137");
//       break;
//     case "4":
//       parachute.surfaceType = "ice";
//       console.log("❄️ تم اختيار سطح جليدي - main.js:141");
//       break;
//     case "ArrowUp":
//       parachute.wind.z -= 1;
//       console.log(`💨 زيادة قوة الرياح على محور Z إلى ${parachute.wind.z.toFixed(2)}`);
//       break;
//     case "ArrowDown":
//       parachute.wind.z += 1;
//       console.log(`💨 تقليل قوة الرياح على محور Z إلى ${parachute.wind.z.toFixed(2)}`);
//       break;
//     case "ArrowLeft":
//       parachute.wind.x -= 1;
//       console.log(`💨 زيادة قوة الرياح على محور X إلى ${parachute.wind.x.toFixed(2)}`);
//       break;
//     case "ArrowRight":
//       parachute.wind.x += 1;
//       console.log(`💨 تقليل قوة الرياح على محور X إلى ${parachute.wind.x.toFixed(2)}`);
//       break;
//   }
// });

// function animate() {
//   if (!isSimulationRunning) return;
//   parachute.update(0.05);
//   console.log(
//     `Pos: ${parachute.position.toString()} | Vel: ${parachute.velocity.toString()} | Wind: ${parachute.wind.toString()}`
//   );
//   console.log(`Yaw Angle: ${parachute.yawAngle.toFixed(2)}° - main.js:187`);
//   if (parachute.position.y > 0) {
//     requestAnimationFrame(animate);
//   } else {
//     console.log("✅ Reached Ground - main.js:191");
//   }
// }

// window.animate = animate;

// // ⚠️ ما نشغل المحاكاة عند التحميل
import "./environment/script.js";
import { Parachute } from "./physics/models/Parachute.js";
import { Simulator } from "./physics/simulator/Simulator.js";
import { Vector3 } from "./physics/models/Vector3.js";

let isSimulationRunning = false;
window.isSimulationRunning = isSimulationRunning; // 🆕 الآن يمكن لكود الرسم التحكم في هذا المتغير

const parachute = new Parachute({
  mass: 90,
  closedArea: 1.0,
  openArea: 15.0,
  dragCoeff: 1.2,
  initialHeight: 1500,
});
window.parachute = parachute;

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "n":
      parachute.changePosture(1.5);
      console.log("🤸‍♂️ تم نشر اليدين (وضعية أكبر تزيد مقاومة الهواء)");
      break;
    case "m":
      parachute.changePosture(1.0);
      console.log("🧍‍♂️ تم ضم اليدين (وضعية أصغر تقلل مقاومة الهواء)");
      break;
    case "b":
      parachute.changeLegPosture(1.5);
      console.log("🦵 تم نشر الرجلين (وضعية أكبر تزيد مقاومة الهواء)");
      break;
    case "v":
      parachute.changeLegPosture(1.0);
      console.log("🦵 تم ضم الرجلين (وضعية أصغر تقلل مقاومة الهواء)");
      break;
    case "p":
      parachute.isParachuteOpen = !parachute.isParachuteOpen;
      console.log(parachute.isParachuteOpen ? "🪂 تم فتح المظلة" : "🎒 تم إغلاق المظلة");
      break;
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
    case "z":
      parachute.armLength += 0.05;
      console.log(`🦾 زيادة طول الذراع إلى ${parachute.armLength.toFixed(2)} متر`);
      break;
    case "x":
      parachute.armLength = Math.max(0.1, parachute.armLength - 0.05);
      console.log(`🦿 تقليل طول الذراع إلى ${parachute.armLength.toFixed(2)} متر`);
      break;
    case "c":
      parachute.yawDampingCoeff += 0.01;
      console.log(`🌀 زيادة معامل مقاومة الدوران إلى ${parachute.yawDampingCoeff.toFixed(2)}`);
      break;
    case "f":
      parachute.yawDampingCoeff = Math.max(0, parachute.yawDampingCoeff - 0.01);
      console.log(`🌀 تقليل معامل مقاومة الدوران إلى ${parachute.yawDampingCoeff.toFixed(2)}`);
      break;
    case "r":
      parachute.position = new Vector3(0, 1500, 0);
      parachute.velocity = new Vector3(0, 0, 0);
      parachute.angularVelocity = new Vector3(0, 0, 0);
      parachute.orientation = new Vector3(0, 0, 0);
      parachute.yawAngle = 0;
      parachute.hasStoppedRotation = false;
      console.log("🔄 إعادة تعيين المحاكاة");
      window.isSimulationRunning = false;
      break;
    case "1":
      parachute.surfaceType = "hard";
      console.log("🪨 تم اختيار سطح صلب");
      break;
    case "2":
      parachute.surfaceType = "sand";
      console.log("🏖️ تم اختيار سطح رملي");
      break;
    case "3":
      parachute.surfaceType = "water";
      console.log("🌊 تم اختيار سطح مائي");
      break;
    case "4":
      parachute.surfaceType = "ice";
      console.log("❄️ تم اختيار سطح جليدي");
      break;
    case "ArrowUp":
      parachute.wind.z -= 1;
      console.log(`💨 زيادة قوة الرياح على محور Z إلى ${parachute.wind.z.toFixed(2)}`);
      break;
    case "ArrowDown":
      parachute.wind.z += 1;
      console.log(`💨 تقليل قوة الرياح على محور Z إلى ${parachute.wind.z.toFixed(2)}`);
      break;
    case "ArrowLeft":
      parachute.wind.x -= 1;
      console.log(`💨 زيادة قوة الرياح على محور X إلى ${parachute.wind.x.toFixed(2)}`);
      break;
    case "ArrowRight":
      parachute.wind.x += 1;
      console.log(`💨 تقليل قوة الرياح على محور X إلى ${parachute.wind.x.toFixed(2)}`);
      break;
  }
});

function animate() {
  if (!window.isSimulationRunning) return;
  parachute.update(0.05);
  console.log(
    `Pos: ${parachute.position.toString()} | Vel: ${parachute.velocity.toString()} | Wind: ${parachute.wind.toString()}`
  );
  console.log(`Yaw Angle: ${parachute.yawAngle.toFixed(2)}°`);

  // 🆕 تم تعديل الشرط: إذا كان الارتفاع أقل من أو يساوي 0، تتوقف المحاكاة.
  if (parachute.position.y <= 0) {
    console.log("✅ Reached Ground");
    window.isSimulationRunning = false;
  } else {
    requestAnimationFrame(animate);
  }
}
window.animate = animate;