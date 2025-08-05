import { Parachute } from './physics/models/Parachute.js';
import { Simulator } from './physics/simulator/Simulator.js';
import { Vector3 } from './physics/models/Vector3.js';

const parachute = new Parachute({
  mass: 90,
  closedArea: 1.0,
  openArea: 15.0,
  dragCoeff: 1.2,
  initialHeight: 1500
});
window.parachute = parachute;

window.addEventListener('keydown', (event) => {
  switch(event.key) {
    case 'n':
        parachute.changePosture(1.5);
        console.log('🤸‍♂️ تم نشر اليدين (وضعية أكبر تزيد مقاومة الهواء)');
        break;
    case 'm':
        parachute.changePosture(1.0);
        console.log('🧍‍♂️ تم ضم اليدين (وضعية أصغر تقلل مقاومة الهواء)');
        break;
    case 'p':
        parachute.isParachuteOpen = !parachute.isParachuteOpen;
        console.log(parachute.isParachuteOpen ? '🪂 تم فتح المظلة' : '🎒 تم إغلاق المظلة');
        break;
    case 'q':
        parachute.tensionLeft += 50;
        console.log(`⬅️ زيادة الشد في الجهة اليسرى إلى ${parachute.tensionLeft} نيوتن`);
        break;
    case 'e':
        parachute.tensionRight += 50;
        console.log(`➡️ زيادة الشد في الجهة اليمنى إلى ${parachute.tensionRight} نيوتن`);
        break;
    case 'a':
        parachute.tensionLeft = Math.max(0, parachute.tensionLeft - 50);
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
        console.log('🔄 تم إعادة تعيين المحاكاة إلى الوضع الابتدائي');
        break;
}

});

// function printHUD() {
//   console.clear();  // يمسح الشاشة كل Frame
//   console.log('================== 📊 تقرير المحاكاة ==================');
//   console.log(`🕒 الزمن الحالي: ${(performance.now() / 1000).toFixed(2)} ثانية`);
//   console.log(`📍 الموقع: X=${parachute.position.x.toFixed(2)} m | Y=${parachute.position.y.toFixed(2)} m | Z=${parachute.position.z.toFixed(2)} m`);
//   console.log(`🚀 السرعة: Vx=${parachute.velocity.x.toFixed(2)} m/s | Vy=${parachute.velocity.y.toFixed(2)} m/s | Vz=${parachute.velocity.z.toFixed(2)} m/s`);
//   console.log(`📈 التسارع: Ax=${parachute.acceleration.x.toFixed(2)} m/s² | Ay=${parachute.acceleration.y.toFixed(2)} m/s² | Az=${parachute.acceleration.z.toFixed(2)} m/s²`);
//   console.log(`🌀 زاوية التوجيه (Yaw): ${(parachute.orientation.y * 180 / Math.PI).toFixed(2)}°`);
//   console.log(`🔄 سرعة الدوران حول المحور الرأسي (Yaw Velocity): ${(parachute.angularVelocity.y * 180 / Math.PI).toFixed(2)}°/s`);
//   console.log(`🧮 تسارع زاوي (Yaw Acceleration): ${(parachute.angularAcceleration.y * 180 / Math.PI).toFixed(2)}°/s²`);
//   console.log(`🌫️ كثافة الهواء الحالية: ${parachute.dynamicAirDensity().toFixed(3)} kg/m³ (تتناقص مع الارتفاع)`);
//   console.log(`🪢 الشد الأيسر: ${parachute.tensionLeft} N | الشد الأيمن: ${parachute.tensionRight} N`);
//   console.log(`🦾 طول الذراع: ${parachute.armLength.toFixed(2)} m (كلما زاد الطول زاد عزم الدوران)`);
//   console.log(`🌀 معامل مقاومة الدوران: ${parachute.yawDampingCoeff.toFixed(2)} (يقلل سرعة الدوران تدريجياً)`);
//   console.log(`🪂 حالة المظلة: ${parachute.isParachuteOpen ? 'مفتوحة' : 'مغلقة'}`);
//   console.log('========================================================');
// }


//تابع الحركة المستمر
function animate() {
  parachute.update(0.05); // تحديث الحركة كل frame
  console.log(`Pos: ${parachute.position.toString()} | Vel: ${parachute.velocity.toString()}`);
  console.log(`Yaw Angle: ${(parachute.yawAngle * 180 / Math.PI).toFixed(2)}°`);

  // printHUD(); 

  if (parachute.position.y > 0) {
    requestAnimationFrame(animate);
  } else {
    console.log('✅ Reached Ground');
  }


}


window.animate = animate;
animate();




