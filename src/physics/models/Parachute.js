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
    this.hasStoppedRotation = false; // متغير لمنع تكرار الرسالة
    this.wind = options.wind || new Vector3(0, 0, 0);
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
    return new Vector3(diff * 0.0001, 0, diff * 0.0001); // قلل العامل من 0.002 إلى 0.0001
  }

  impactForce(deltaV) {
    const deltaT = this.computeCollisionDeltaTime();
    const magnitude = this.mass * deltaV / deltaT;
    return new Vector3(0, magnitude, 0);
  }

  torqueForce() {
    const tensionDiff = this.tensionLeft - this.tensionRight;

    const activeTorqueY = tensionDiff * this.armLength * 0.0005;

    const rollTorque = tensionDiff * 0.01;
    const pitchTorque = tensionDiff * 0.005;

    const dynamicDampingCoeff = this.yawDampingCoeff * (this.isParachuteOpen ? 3 : 1) * this.bodyPostureFactor;
    const dampingTorque = this.angularVelocity.scale(-dynamicDampingCoeff);

    const restoringTorqueX = -1.0 * this.orientation.x; // زيادة من -0.5 إلى -1.0
    const restoringTorqueY = -5.0 * this.orientation.y;
    const restoringTorqueZ = -1.0 * this.orientation.z; // زيادة من -0.5 إلى -1.0

    const netTorque = new Vector3(
      rollTorque + restoringTorqueX + dampingTorque.x,
      activeTorqueY + restoringTorqueY + dampingTorque.y,
      pitchTorque + restoringTorqueZ + dampingTorque.z
    );

    if (Math.abs(tensionDiff) < 0.05 && !this.hasStoppedRotation) {
      this.angularVelocity = new Vector3(0, 0, 0);
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
      Math.sin(this.orientation.x) * 0.005 * this.mass, // قلل من 0.05 إلى 0.005
      0,
      Math.sin(this.orientation.z) * 0.005 * this.mass // قلل من 0.05 إلى 0.005
    );

    lateralFromTilt.x = Math.max(Math.min(lateralFromTilt.x, 1), -1); // قلل الحد من 10 إلى 1
    lateralFromTilt.z = Math.max(Math.min(lateralFromTilt.z, 1), -1); // قلل الحد من 10 إلى 1

    total = total.add(lateralFromTilt);

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
      case 'hard': return 0.05;
      case 'ice': return 0.3;
      case 'sand': return 1.0;
      case 'water': return 2.0;
      default: return 0.09;
    }
  }

  update(dt) {
    const cappedDt = Math.min(dt, 0.1);

    const torque = this.torqueForce();

    const tensionDiff = this.tensionLeft - this.tensionRight;

    this.angularAcceleration = this.computeAngularAcceleration(torque);
    if (isNaN(this.angularAcceleration.y)) {
      console.warn('⚠️ angularAcceleration.y is NaN');
      this.angularAcceleration.y = 0;
    }

    this.angularVelocity = this.angularVelocity.add(this.angularAcceleration.scale(cappedDt));

    const maxAngularVelocity = 0.1;
    if (Math.abs(this.angularVelocity.y) > maxAngularVelocity) {
      this.angularVelocity.y = Math.sign(this.angularVelocity.y) * maxAngularVelocity;
    }

    const dampingFactor = 0.999;
    this.angularVelocity = this.angularVelocity.scale(dampingFactor);

    if (this.angularVelocity.magnitude() < 0.0005 && Math.abs(tensionDiff) < 0.05) {
      this.angularVelocity = new Vector3(0, 0, 0);
    }

    this.orientation = this.orientation.add(this.angularVelocity.scale(cappedDt));

    if (Math.abs(this.orientation.y) < 0.01 && Math.abs(tensionDiff) < 0.05) {
      this.orientation.y = 0;
    }
    this.orientation.y = (this.orientation.y + Math.PI * 2) % (Math.PI * 2);

    this.acceleration = this.accelerationVector();

    const accelerationMagnitude = this.acceleration.magnitude();
    if (!this.reachedTerminalVelocity && accelerationMagnitude < 0.01) {
      console.log('✅ تم الوصول للسرعة الحدية');
      this.reachedTerminalVelocity = true;
    }

    this.velocity = this.velocity.add(this.acceleration.scale(cappedDt));

    // إضافة تخميد للسرعة الأفقية (x وz)
    this.velocity.x *= 0.99;
    this.velocity.z *= 0.99;

    // إيقاف السرعة الأفقية تمامًا لما الشد متساوي وصغير
    if (Math.abs(tensionDiff) < 0.05) {
      this.velocity.x *= 0.95; // تخميد أقوى
      this.velocity.z *= 0.95;
      if (Math.abs(this.velocity.x) < 0.001) this.velocity.x = 0;
      if (Math.abs(this.velocity.z) < 0.001) this.velocity.z = 0;
    }

    this.position = this.position.add(this.velocity.scale(cappedDt));

    this.yawAngle = this.orientation.y * (180 / Math.PI) % 360;
    if (this.yawAngle < 0) this.yawAngle += 360;

    if (this.position.y <= 0) {
      this.position.y = 0;
      this.velocity.y = 0;
      this.angularVelocity = new Vector3(0, 0, 0);
      this.orientation = new Vector3(0, 0, 0);
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