import { Parachute } from './physics/models/Parachute.js';
import { Vector3 } from './physics/models/Vector3.js';
// لا نحتاج لـ Simulator في هذا الملف، فقط في ملف المحاكاة الرئيسي.

const parachute = new Parachute({
  mass: 90,
  closedArea: 1.0,
  openArea: 15.0,
  dragCoeff: 1.2,
  initialHeight: 1500
});

window.parachute = parachute;

// الحصول على عناصر الواجهة
// قسم الرياح
const windXInput = document.getElementById('windX');
const windYInput = document.getElementById('windY');

const windZInput = document.getElementById('windZ');
const setWindBtn = document.getElementById('setWindBtn');
const stopWindBtn = document.getElementById('stopWindBtn');

// قسم وضعية الجسم والمظلة
const postureOpenBtn = document.getElementById('postureOpenBtn');
const postureCloseBtn = document.getElementById('postureCloseBtn');
const parachuteToggleBtn = document.getElementById('parachuteToggleBtn');

// قسم الشد
const tensionLeftInput = document.getElementById('tensionLeft');
const tensionRightInput = document.getElementById('tensionRight');
const setTensionBtn = document.getElementById('setTensionBtn');

// قسم المعاملات
const armLengthInput = document.getElementById('armLength');
const yawDampingCoeffInput = document.getElementById('yawDampingCoeff');
const setCoeffBtn = document.getElementById('setCoeffBtn');

// قسم التحكم العام
//const resetBtn = document.getElementById('resetBtn');

// ربط أحداث النقر بالوظائف
// الرياح

setWindBtn.addEventListener('click', () => {
    const windX = parseFloat(windXInput.value);
    const windY = parseFloat(windYInput.value); // إضافة هذا السطر
    const windZ = parseFloat(windZInput.value);
    parachute.windVelocity.x = windX;
    parachute.windVelocity.y = windY; // إضافة هذا السطر
    parachute.windVelocity.z = windZ;
    console.log(`🌬️ تم تطبيق سرعة الرياح: X=${windX}، Y=${windY}، Z=${windZ}`);
});

stopWindBtn.addEventListener('click', () => {
    parachute.windVelocity = new Vector3(0, 0, 0);
    windXInput.value = 0;
    windYInput.value = 0; // إضافة هذا السطر
    windZInput.value = 0;
    console.log('🌬️ تم إيقاف الرياح تمامًا.');
});
// وضعية الجسم والمظلة
postureOpenBtn.addEventListener('click', () => {
    parachute.changePosture(1.5);
    console.log('🤸‍♂️ تم نشر اليدين (وضعية أكبر تزيد مقاومة الهواء)');
});
postureCloseBtn.addEventListener('click', () => {
    parachute.changePosture(1.0);
    console.log('🧍‍♂️ تم ضم اليدين (وضعية أصغر تقلل مقاومة الهواء)');
});
parachuteToggleBtn.addEventListener('click', () => {
    parachute.isParachuteOpen = !parachute.isParachuteOpen;
    console.log(parachute.isParachuteOpen ? '🪂 تم فتح المظلة' : '🎒 تم إغلاق المظلة');
});

// الشد
setTensionBtn.addEventListener('click', () => {
    const tensionLeft = parseFloat(tensionLeftInput.value);
    const tensionRight = parseFloat(tensionRightInput.value);
    parachute.tensionLeft = tensionLeft;
    parachute.tensionRight = tensionRight;
    console.log(`🪢 تم تطبيق الشد: يسار=${tensionLeft}N، يمين=${tensionRight}N`);
});

// المعاملات
setCoeffBtn.addEventListener('click', () => {
    const armLength = parseFloat(armLengthInput.value);
    const yawDampingCoeff = parseFloat(yawDampingCoeffInput.value);
    parachute.armLength = armLength;
    parachute.yawDampingCoeff = yawDampingCoeff;
    console.log(`⚙️ تم تطبيق المعاملات: طول الذراع=${armLength}m، معامل الدوران=${yawDampingCoeff}`);
});

// // التحكم العام
// resetBtn.addEventListener('click', () => {
//     parachute.position = new Vector3(0, 1500, 0);
//     parachute.velocity = new Vector3(0, 0, 0);
//     parachute.angularVelocity = new Vector3(0, 0, 0);
//     parachute.orientation = new Vector3(0, 0, 0);
//     console.log('🔄 تم إعادة تعيين المحاكاة إلى الوضع الابتدائي');
// });

function animate() {
    parachute.update(0.05);
    console.log(`Pos: ${parachute.position.toString()} | Vel: ${parachute.velocity.toString()}`);
    console.log(`Yaw Angle: ${(parachute.yawAngle * 180 / Math.PI).toFixed(2)}°`);
    console.log(`Wind Velocity: ${parachute.windVelocity.toString()}`);
    
    if (parachute.position.y > 0) {
        requestAnimationFrame(animate);
    } else {
        console.log('✅ Reached Ground');
    }
}

window.animate = animate;
animate();