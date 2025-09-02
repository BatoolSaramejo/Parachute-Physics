import {
  GRAVITY,
  AIR_DENSITY_SEA_LEVEL,
  COLLISION_DELTA_TIME,
  MAX_TENSION_FORCE,
  MOMENT_OF_INERTIA 
} from '../constants/PhysicalConstants.js';
import { Vector3 } from './Vector3.js';

export class Parachute {
  constructor(options) {
    this.mass = options.mass;
    this.dragCoeff = options.dragCoeff;
    this.initialHeight = options.initialHeight;
    this.yawAngle = 0;

    this.closedArea = options.closedArea || 1;
    this.openArea = options.openArea || 15;
    this.area = this.closedArea;

    this.surfaceType = 'hard'; // نوع سطح التصادم: 'hard', 'sand', 'water'

    this.isParachuteOpen = false;
    this.bodyPostureFactor = 1.0; // عامل وضعية الجسم (اليدين)
    this.legPostureFactor = 1.0;  // عامل وضعية الرجلين (جديد)

    this.position = new Vector3(0, this.initialHeight, 0);
    this.velocity = new Vector3(0, 0, 0);
    this.acceleration = new Vector3(0, 0, 0);

    // قيم ديناميكية قابلة للتغيير من الكونسول
    this.gravity = GRAVITY;       // الجاذبية الأرضية
    this.airDensity = AIR_DENSITY_SEA_LEVEL;
    this.tensionLeft = 0;          // قوة الشد
    this.tensionRight = 0;         // قوة الشد

    // للحركة الدورانية
    this.angularVelocity = new Vector3(0, 0, 0);         
    this.angularAcceleration = new Vector3(0, 0, 0);    
    this.orientation = new Vector3(0, 0, 0);            
    this.yawDampingCoeff = 0.1;       // معامل مقاومة الدوران
    this.armLength = options.armLength || 0.5;
    this.momentOfInertia = options.momentOfInertia || 30; // I (kg·m²)

    this.reachedTerminalVelocity = false;
    this.hasStoppedRotation = false; // متغير لمنع تكرار الرسالة
    this.wind = options.wind || new Vector3(0, 0, 0);

    // إضافة جديدة: متغير للسرعة الارتدادية، يبدأ بـ 0
    this.reboundVelocity = 0;
  }

  gravityForce() {
    return new Vector3(0, -this.mass * this.gravity, 0);
  }

  dragForce() {
    const relativeVelocity = this.velocity.subtract(this.wind);
    
    const speed = relativeVelocity.magnitude();
    const baseArea = this.isParachuteOpen ? this.openArea : this.closedArea;
    const area = baseArea * this.bodyPostureFactor * this.legPostureFactor;
    const rho = AIR_DENSITY_SEA_LEVEL;
    const dragMagnitude = 0.5 * rho * this.dragCoeff * area * speed * speed;

    const dragDirection = speed === 0
        ? new Vector3()
        : relativeVelocity.normalize().negate();

    const sinRoll = Math.sin(this.orientation.x);
    const cosRoll = Math.cos(this.orientation.x);
    const sinPitch = Math.sin(this.orientation.z);
    const cosPitch = Math.cos(this.orientation.z);

    const adjustedDrag = new Vector3(
      dragDirection.x * cosPitch - dragDirection.y * sinPitch + sinRoll * 0.02,
      dragDirection.y * cosRoll + sinPitch * 0.01,
      dragDirection.z * cosPitch + sinRoll * 0.02
    ).normalize();

    return adjustedDrag.scale(dragMagnitude);
  }

  tensionForce() {
    const totalTension = this.tensionLeft + this.tensionRight;
    const clamped = Math.min(totalTension, MAX_TENSION_FORCE);
    return new Vector3(0, clamped, 0);
  }

  lateralTensionDrift() {
    const diff = this.tensionLeft - this.tensionRight;
    return new Vector3(diff * 0.002, 0, diff * 0.002);
  }

  impactForce(deltaV) {
    const deltaT = this.computeCollisionDeltaTime();
    const magnitude = this.mass * Math.abs(deltaV) / deltaT;
    return new Vector3(0, magnitude, 0);
  }

  torqueForce() {
    const tensionDiff = this.tensionRight - this.tensionLeft;

    // 🔹 تعديل جديد: خفض activeTorqueY إلى 0.0005 عشان دوران أضعف جدًا حول Y
    const activeTorqueY = tensionDiff * this.armLength * 0.005; // زيادة من 0.0005 إلى 0.005

    // 🔹 الحفاظ على rollTorque و pitchTorque لميلان بسيط
    const rollTorque = tensionDiff * 0.01;
    const pitchTorque = tensionDiff * 0.005;

    // 🔹 التخميد
    const dynamicDampingCoeff = this.yawDampingCoeff * (this.isParachuteOpen ? 3 : 1) * this.bodyPostureFactor;
    const dampingTorque = this.angularVelocity.scale(-dynamicDampingCoeff);

    // 🔹 تعديل جديد: عزم استرجاع أقوى جدًا للـ orientation.y
    const restoringTorqueX = -0.5 * this.orientation.x;
    const restoringTorqueY = -1.5 * this.orientation.y; // زيادة من -3.0 إلى -5.0
    const restoringTorqueZ = -0.5 * this.orientation.z;

    // 🔹 العزم الصافي
    const netTorque = new Vector3(
      rollTorque + restoringTorqueX + dampingTorque.x,
      activeTorqueY + restoringTorqueY + dampingTorque.y,
      pitchTorque + restoringTorqueZ + dampingTorque.z
    );

    // 🔹 تعديل جديد: إيقاف الدوران إذا كان tensionDiff صغير جدًا
    if (this.angularVelocity.magnitude() < 0.0005) { // خفض من 0.1 إلى 0.05
      this.angularVelocity = new Vector3(0, 0, 0);
      this.orientation = new Vector3(this.orientation.x * 0.5, this.orientation.y * 0.5, this.orientation.z * 0.5); // تخفيف إعادة تعيين orientation.y وتخفيف x/z
      console.log('✅ توقف الدوران بسبب شد متساوي تقريبًا');
      this.hasStoppedRotation = true;
    } else if (Math.abs(tensionDiff) >= 0.05) {
      this.hasStoppedRotation = false;
    }

    return netTorque;
  }

  computeAngularAcceleration(torque) {
    if (this.momentOfInertia === 0) {
      console.warn('⚠️ Moment of Inertia is zero! Setting angular acceleration to 0');
      return new Vector3(0, 0, 0);
    }
    return new Vector3(
      torque.x / this.momentOfInertia,
      torque.y / this.momentOfInertia,
      torque.z / this.momentOfInertia
    );
  }

  totalForce() {
    let total = new Vector3();
    total = total.add(this.gravityForce());
    total = total.add(this.dragForce());
    total = total.add(this.tensionForce());
    total = total.add(this.lateralTensionDrift());

    const lateralFromTilt = new Vector3(
      Math.sin(this.orientation.x) * 0.05 * this.mass,
      0,
      Math.sin(this.orientation.z) * 0.05 * this.mass
    );

    lateralFromTilt.x = Math.max(Math.min(lateralFromTilt.x, 10), -10);
    lateralFromTilt.z = Math.max(Math.min(lateralFromTilt.z, 10), -10);

    total = total.add(lateralFromTilt);

    if (this.position.y <= 0 && this.velocity.y < 0) {
      const deltaV = Math.abs(this.velocity.y);
    total = total.add(this.impactForce(this.velocity.y));
    }

    return total;
  }

  accelerationVector() { 
    const netForce = this.totalForce();
    return netForce.scale(1 / this.mass);
  }

  computeCollisionDeltaTime() {
    switch (this.surfaceType) {
      case 'hard': return 0.05;
      case 'sand': return 1.0;
      default: return 0.09;
    }
  }

  update(dt) {
    // 🔹 تعديل جديد: تحديد dt عشان نمنع تقلبات كبيرة
    const cappedDt = Math.min(dt, 0.1); // سقف للـ dt

    // 1️⃣ حساب العزم (Torque)
    const torque = this.torqueForce();

    // 2️⃣ حساب التسارع الزاوي (Angular Acceleration)
    this.angularAcceleration = this.computeAngularAcceleration(torque);
    if (isNaN(this.angularAcceleration.y)) {
      console.warn('⚠️ angularAcceleration.y is NaN');
      this.angularAcceleration.y = 0;
    }

    // 3️⃣ تحديث السرعة الزاوية (Angular Velocity)
    this.angularVelocity = this.angularVelocity.add(this.angularAcceleration.scale(cappedDt));

    // 🔹 تعديل جديد: سقف للسرعة الزاوية عشان نمنع دوران سريع (يويو)
    const maxAngularVelocity = 0.1; // rad/s
    if (Math.abs(this.angularVelocity.y) > maxAngularVelocity) {
      this.angularVelocity.y = Math.sign(this.angularVelocity.y) * maxAngularVelocity;
    }

    // 🔹 تعديل جديد: تخميد أقوى جدًا
    const dampingFactor = 0.999; // زيادة من 0.995 إلى 0.999
    this.angularVelocity = this.angularVelocity.scale(dampingFactor);

    // 🔹 تعديل جديد: إذا السرعة الزاوية صغيرة جدًا و tensionDiff صغير، أوقفها
    if (this.angularVelocity.magnitude() < 0.0005 && Math.abs(this.tensionLeft - this.tensionRight) < 0.05) {
      this.angularVelocity = new Vector3(0, 0, 0);
    }

    // 4️⃣ تحديث الزاوية (Orientation)
    this.orientation = this.orientation.add(this.angularVelocity.scale(cappedDt));

    // 🔹 تعديل جديد: تخميد إضافي للـ orientation إذا كانت صغيرة
    if (Math.abs(this.orientation.y) < 0.01 && Math.abs(this.tensionLeft - this.tensionRight) < 0.05) {
      this.orientation.y = 0;
    }
    this.orientation.y = (this.orientation.y + Math.PI * 2) % (Math.PI * 2);

    // 5️⃣ تحديث القوى الخطية (Linear Forces)
    this.acceleration = this.accelerationVector();

    // 6️⃣ كشف السرعة الحدية (Terminal Velocity)
    const accelerationMagnitude = this.acceleration.magnitude();
    if (!this.reachedTerminalVelocity && accelerationMagnitude < 0.01) {
      console.log('✅ تم الوصول للسرعة الحدية');
      this.reachedTerminalVelocity = true;
    }

    // 7️⃣ تحديث السرعة الخطية (Linear Velocity)
    this.velocity = this.velocity.add(this.acceleration.scale(cappedDt));

    // 🔹 التعديل الأساسي: تخميد السرعة الأفقية (x و z) عندما يكون فرق الشد صفراً
    const tensionDiff = this.tensionLeft - this.tensionRight;
    if (Math.abs(tensionDiff) < 0.05) {
      this.velocity.x *= 0.95; // تخميد أقوى
      this.velocity.z *= 0.95;
      if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.001) this.velocity.z = 0;
    }

    // 8️⃣ تحديث الموقع (Position)
    this.position = this.position.add(this.velocity.scale(cappedDt));

    // 9️⃣ تحديث زاوية الدوران العامة (Yaw Angle)
    this.yawAngle = this.orientation.y * (180 / Math.PI) % 360;
    if (this.yawAngle < 0) this.yawAngle += 360;


    //جديد جديد وحصري من عنا وبس
    // معاملات الارتداد حسب نوع السطح
        const restitution = {
            hard: 0.1,  // ارتداد بسيط
            sand: 0.02  // شبه معدوم
        };

    // 🔟 إذا وصلت الأرض
    if (this.position.y <= 0 && this.velocity.y < 0) {
        this.position.y = 0;

       // 💡 خطوة جديدة: حفظ قيمة سرعة الهبوط النهائية
        const finalImpactVelocity = this.velocity.y;
        
 
        console.log(`سرعة الهبوط النهائية: ${finalImpactVelocity.toFixed(2)} م/ث`);

      //جديد جديد وحصري من عنا وبس
      // عكس السرعة بمعامل الارتداد المناسب
        const e = restitution[this.surfaceType] || 0.0;
        this.reboundVelocity = -e * finalImpactVelocity;  // سرعة الارتداد (إيجابية)

        console.log(`سرعة الارتداد: ${this.reboundVelocity.toFixed(2)} م/ث`);

      if (Math.abs(this.reboundVelocity) < 0.01) {
        this.reboundVelocity = 0;
      } 

      this.velocity.y = 0; // صفر سرعة المظلي الرئيسية

      this.angularVelocity = new Vector3(0, 0, 0);
      this.orientation = new Vector3(0, 0, 0); // 🔹 إعادة تعيين كل الزوايا
      this.yawAngle = 0;
      this.hasStoppedRotation = false;
      console.log('✅ هبوط ناجح - تم التوقف');
    }
  }

  changePosture(factor) {
    this.bodyPostureFactor = factor;
  }

  changeLegPosture(factor) {
    this.legPostureFactor = factor;
  }
}