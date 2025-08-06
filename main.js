import { Parachute } from './physics/models/Parachute.js';
import { Simulator } from './physics/simulator/Simulator.js';
import { Vector3 } from './physics/models/Vector3.js';

let isSimulationRunning = true;

const parachute = new Parachute({
  mass: 90,
  closedArea: 1.0,
  openArea: 15.0,
  dragCoeff: 1.2,
  initialHeight: 1500
});
window.parachute = parachute;

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'n':
      parachute.changePosture(1.5);
      console.log('🤸‍♂️ تم نشر اليدين (وضعية أكبر تزيد مقاومة الهواء)');
      break;
    case 'm':
      parachute.changePosture(1.0);
      console.log('🧍‍♂️ تم ضم اليدين (وضعية أصغر تقلل مقاومة الهواء)');
      break;
    case 'b':
      parachute.changeLegPosture(1.5);
      console.log('🦵 تم نشر الرجلين (وضعية أكبر تزيد مقاومة الهواء)');
      break;
    case 'l':
      parachute.changeLegPosture(1.0);
      console.log('🦵 تم ضم الرجلين (وضعية أصغر تقلل مقاومة الهواء)');
      break;
    case 'p':
      parachute.isParachuteOpen = !parachute.isParachuteOpen;
      console.log(parachute.isParachuteOpen ? '🪂 تم فتح المظلة' : '🎒 تم إغلاق المظلة');
      break;
    case 'q':
      parachute.tensionLeft += 200;
      console.log(`⬅️ زيادة الشد في الجهة اليسرى إلى ${parachute.tensionLeft} نيوتن`);
      break;
    case 'e':
      parachute.tensionRight += 50;
      console.log(`➡️ زيادة الشد في الجهة اليمنى إلى ${parachute.tensionRight} نيوتن`);
      break;
    case 'a':
      parachute.tensionLeft = Math.max(0, parachute.tensionLeft - 200);
      console.log(`⬅️ تقليل الشد في الجهة اليسرى إلى ${parachute.tensionLeft} نيوتن`);
      break;
    case 'd':
      parachute.tensionRight = Math.max(0, parachute.tensionRight - 50);
      console.log(`➡️ تقليل الشد في الجهة اليمنى إلى ${parachute.tensionRight} نيوتن`);
      break;
    case 'z':
      parachute.armLength += 0.05;
      console.log(`🦾 زيادة طول الذراع إلى ${parachute.armLength.toFixed(2)} متر`);
      break;
    case 'x':
      parachute.armLength = Math.max(0.1, parachute.armLength - 0.05);
      console.log(`🦿 تقليل طول الذراع إلى ${parachute.armLength.toFixed(2)} متر`);
      break;
    case 'c':
      parachute.yawDampingCoeff += 0.01;
      console.log(`🌀 زيادة معامل مقاومة الدوران إلى ${parachute.yawDampingCoeff.toFixed(2)}`);
      break;
    case 'v':
      parachute.yawDampingCoeff = Math.max(0, parachute.yawDampingCoeff - 0.01);
      console.log(`🌀 تقليل معامل مقاومة الدوران إلى ${parachute.yawDampingCoeff.toFixed(2)}`);
      break;
    case 'r':
      parachute.position = new Vector3(0, 1500, 0);
      parachute.velocity = new Vector3(0, 0, 0);
      parachute.angularVelocity = new Vector3(0, 0, 0);
      parachute.orientation = new Vector3(0, 0, 0);
      parachute.yawAngle = 0;
      parachute.hasStoppedRotation = false; // إعادة تعيين حالة الرسالة
      console.log('🔄 إعادة تعيين المحاكاة');
      isSimulationRunning = true;
      animate();
      break;
    case 's':
      isSimulationRunning = !isSimulationRunning;
      console.log(isSimulationRunning ? '▶️ استئناف المحاكاة' : '⏸️ إيقاف المحاكاة');
      if (isSimulationRunning) animate();
      break;
    case '1':
      parachute.surfaceType = 'hard';
      console.log('🪨 تم اختيار سطح صلب');
      break;
    case '2':
      parachute.surfaceType = 'sand';
      console.log('🏖️ تم اختيار سطح رملي');
      break;
    case '3':
      parachute.surfaceType = 'water';
      console.log('🌊 تم اختيار سطح مائي');
      break;
    case '4':
      parachute.surfaceType = 'ice';
      console.log('❄️ تم اختيار سطح جليدي');
      break;
  }
});

function animate() {
  if (!isSimulationRunning) return;
  parachute.update(0.05);
  console.log(`Pos: ${parachute.position.toString()} | Vel: ${parachute.velocity.toString()}`);
  console.log(`Yaw Angle: ${parachute.yawAngle.toFixed(2)}°`);
  if (parachute.position.y > 0) {
    requestAnimationFrame(animate);
  } else {
    console.log('✅ Reached Ground');
  }
}

window.animate = animate;
animate();