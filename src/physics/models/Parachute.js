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
    this.momentOfInertia = options.momentOfInertia || 15; // I (kg·m²)

    this.reachedTerminalVelocity = false;
    this.hasStoppedRotation = false; // متغير جديد لمنع تكرار الرسالة
     this.wind = options.wind || new Vector3(0, 0, 0);
 }

  dynamicAirDensity() {
    const scaleHeight = 8500; // meters
    return AIR_DENSITY_SEA_LEVEL * Math.exp(-this.position.y / scaleHeight);
  }

  gravityForce() {
    return new Vector3(0, -this.mass * this.gravity, 0);
  }
dragForce() {
    // حساب السرعة النسبية (سرعة المظلي - سرعة الرياح)
    const relativeVelocity = this.velocity.subtract(this.wind);
    
    const speed = relativeVelocity.magnitude();
    const baseArea = this.isParachuteOpen ? this.openArea : this.closedArea;
    const area = baseArea * this.bodyPostureFactor * this.legPostureFactor;
    const rho = this.dynamicAirDensity();
    const dragMagnitude = 0.5 * rho * this.dragCoeff * area * speed * speed;

    const dragDirection = speed === 0
        ? new Vector3()
        : relativeVelocity.normalize().negate();

    return dragDirection.scale(dragMagnitude);
}
  tensionForce() {
    const totalTension = this.tensionLeft + this.tensionRight;
    const clamped = Math.min(totalTension, MAX_TENSION_FORCE);
    return new Vector3(0, clamped, 0);
  }

  lateralTensionDrift() {
    const diff = this.tensionLeft - this.tensionRight;
    return new Vector3(diff * 0.001, 0, diff * 0.001); // small lateral drift scaling
  }

  impactForce(deltaV) {
    const deltaT = this.computeCollisionDeltaTime();
    const magnitude = this.mass * deltaV / deltaT;
    return new Vector3(0, magnitude, 0); // للأعلى
  }

  torqueForce() {
    const tensionDiff = this.tensionLeft - this.tensionRight;
    const activeTorque = tensionDiff * this.armLength;
    const activeTorqueVector = new Vector3(0, activeTorque, 0);
    const dynamicDampingCoeff = this.yawDampingCoeff * (this.isParachuteOpen ? 3 : 1) * this.bodyPostureFactor;
    const dampingTorque = this.angularVelocity.scale(-dynamicDampingCoeff);
    const restoringTorque = -2.0 * this.orientation.y; // عزم استعادة أقوى لنقصان أسرع
    const netTorque = activeTorqueVector.add(dampingTorque).add(new Vector3(0, restoringTorque, 0));
    if (Math.abs(tensionDiff) < 1 && !this.hasStoppedRotation) {
      this.angularVelocity.y = 0; // إيقاف السرعة الزاوية
      console.log('✅ توقف الدوران بسبب شد متساوي');
      this.hasStoppedRotation = true; // منع تكرار الرسالة
    } else if (Math.abs(tensionDiff) >= 1) {
      this.hasStoppedRotation = false; // إعادة تعيين الحالة إذا تغير الشد
    }
    return netTorque;
  }

  computeAngularAcceleration(torque) {
    if (this.momentOfInertia === 0) {
      console.warn('⚠️ Moment of Inertia is zero! Setting angular acceleration to 0');
      return new Vector3(0, 0, 0);
    }
    return new Vector3(0, torque.y / this.momentOfInertia, 0);
  }

  totalForce() {
    let total = new Vector3();
    total = total.add(this.gravityForce());
    total = total.add(this.dragForce());
    total = total.add(this.tensionForce());
    total = total.add(this.lateralTensionDrift());

    if (this.position.y <= 0) {
      const deltaV = Math.abs(this.velocity.y);
      total = total.add(this.impactForce(deltaV)); 
    }

    return total;
  }

  accelerationVector() { 
    const netForce = this.totalForce();
    return netForce.scale(1 / this.mass);
  }

  computeCollisionDeltaTime() {
    switch (this.surfaceType) {
      case 'hard': return 0.05;  // أرض صلبة (زمن توقف سريع)
      case 'ice': return 0.3;   // أرض جليدية
      case 'sand': return 1.0;  // رمل (زمن توقف أبطأ)
      case 'water': return 2.0; // ماء (زمن توقف أطول)
      default: return 0.09;      // افتراضي
    }
  }

  update(dt) {
    // 1️⃣ حساب العزم (Torque)
    const torque = this.torqueForce();

    // 2️⃣ حساب التسارع الزاوي (Angular Acceleration)
    this.angularAcceleration = this.computeAngularAcceleration(torque);
    if (isNaN(this.angularAcceleration.y)) {
      console.warn('⚠️ angularAcceleration.y is NaN');
      this.angularAcceleration.y = 0;
    }

    // 3️⃣ تحديث السرعة الزاوية (Angular Velocity)
    this.angularVelocity = this.angularVelocity.add(this.angularAcceleration.scale(dt));

    // 🛑 تطبيق التخميد (احتكاك هوائي/ميكانيكي)
    const dampingFactor = 0.9; // تخميد أضعف لسلاسة أكثر
    this.angularVelocity = this.angularVelocity.scale(dampingFactor);

    // 4️⃣ تحديث الزاوية (Orientation)
    this.orientation = this.orientation.add(this.angularVelocity.scale(dt));
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
    this.velocity = this.velocity.add(this.acceleration.scale(dt));

    // 8️⃣ تحديث الموقع (Position)
    this.position = this.position.add(this.velocity.scale(dt));

    // 9️⃣ تحديث زاوية الدوران العامة (Yaw Angle)
    this.yawAngle = this.orientation.y * (180 / Math.PI) % 360;
    if (this.yawAngle < 0) this.yawAngle += 360;

    // 🔟 إذا وصلت الأرض
    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.angularVelocity = new Vector3(0, 0, 0);
      this.orientation.y = 0; // إعادة الزاوية للصفر عند الهبوط
      this.yawAngle = 0;
      this.hasStoppedRotation = false; // إعادة تعيين حالة الرسالة
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