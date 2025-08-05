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


  this.isParachuteOpen = false;
  this.bodyPostureFactor = 1.0; // عامل الوضعية في البداية


  this.position = new Vector3(0, this.initialHeight, 0);
  this.velocity = new Vector3(0, 0, 0);
  this.acceleration = new Vector3(0, 0, 0);

    // قيم ديناميكية قابلة للتغيير من الكونسول
  this.gravity = GRAVITY;       // الجاذبية الأرضية
  this.airDensity = AIR_DENSITY_SEA_LEVEL;
  //this.tensionAngle = 0;        // زاوية الشد (راديان)
  this.tensionLeft = 0;          // قوة الشد
  this.tensionRight = 0;         // قوة الشد

  //للحركة الدورانية
  this.angularVelocity = new Vector3(0,0,0);         
  this.angularAcceleration = new Vector3(0,0,0);    
  this.orientation = new Vector3(0,0,0);            
  this.yawDampingCoeff = 0.1;       //معامل مقاومة الدوران
  this.armLength = 0.5;
  this.momentOfInertia = MOMENT_OF_INERTIA; // I (kg·m²)

  }

  dynamicAirDensity() {
    // simplified exponential model
    const scaleHeight = 8500; //meters
    return AIR_DENSITY_SEA_LEVEL * Math.exp(-this.position.y/scaleHeight);
  }

  gravityForce() {
    return new Vector3(0, -this.mass * this.gravity, 0);
  }


  dragForce() {
  const relativeVelocity = this.velocity;
  const speed = relativeVelocity.magnitude();
  const baseArea = this.isParachuteOpen ? this.openArea : this.closedArea;
  const area = baseArea * this.bodyPostureFactor; 
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
    // const clampedMag = Math.min(magnitude, MAX_TENSION_FORCE);
    // const tx = clampedMag * Math.cos(angle);
    // const ty = clampedMag * Math.sin(angle);
    // return new Vector3(tx, ty, 0);
  }

  lateralTensionDrift() {
    const diff = this.tensionLeft - this.tensionRight;
    return new Vector3(diff * 0.001, 0, diff * 0.001); // small lateral drift scaling
  }

  impactForce(deltaV, deltaT = COLLISION_DELTA_TIME) {
    const magnitude = this.mass * deltaV / deltaT;
    return new Vector3(0, magnitude, 0); // للأعلى
  }

  //تابع لحساب عزم الدوران الناتج عن الشد غير المتماثل
  torqueForce() {
    const tensionDiff = this.tensionLeft - this.tensionRight;
    const activeTorque = tensionDiff * this.armLength;
    const dampingTorque = -this.yawDampingCoeff * this.angularVelocity.y;
    const netTorque = activeTorque + dampingTorque;

    return new Vector3(0, netTorque, 0);
  // tensionDiff: فرق قوة الشد بين الجهتين (Newtons)
  // armLength: المسافة الأفقية بين نقطة الشد ومحور الدوران (m)
  // return axis.scale(tensionDiff * this.armLength); // Torque = F * r
  }

  //تابع لحساب التسارع الزاوي
  computeAngularAcceleration(torque) {
  return torque.scale(1/this.momentOfInertia);
  }



  totalForce() {
    let total = new Vector3();
    total = total.add(this.gravityForce());
    total = total.add(this.dragForce());
    total = total.add(this.tensionForce());
    total = total.add(this.lateralTensionDrift());

    // const totalTension = this.tensionLeft + this.tensionRight;
    // if (totalTension !== 0) {
    //   total = total.add(this.tensionForce(this.tensionAngle, totalTension));
    // }


    if (this.position.y <= 0) {
      //const deltaV = Math.abs(this.velocity.y);
     // total = total.add(this.impactForce(deltaV, COLLISION_DELTA_TIME));
      total = total.add(this.impactForce(Math.abs(this.velocity.y)));
    }

    return total;
  }

  accelerationVector() { 
    const netForce = this.totalForce();
    return netForce.scale(1 / this.mass);
  }

 
  update(dt) {

     const torque = this.torqueForce();
    this.angularAcceleration = this.computeAngularAcceleration(torque);

    this.angularVelocity = this.angularVelocity.add(this.angularAcceleration.scale(dt));
    this.orientation = this.orientation.add(this.angularVelocity.scale(dt));

    this.acceleration = this.accelerationVector();
    this.velocity = this.velocity.add(this.acceleration.scale(dt));
    this.position = this.position.add(this.velocity.scale(dt));
    this.yawAngle = this.orientation.y;



    // احسب العزم الناتج عن فرق شد الحبال (تقديرياً، كبداية سنجرب فرضياً فرق شد ثابت)
    // const tensionDiff = this.tensionLeft - this.tensionRight; // ← لاحقاً يمكن تفعيل شد غير متساوي بين اليمين واليسار
    // const torqueYew = this.torqueForce(tensionDiff, new Vector3(0,1,0)); // m (المسافة من مركز الدوران لنقطة الشد)

    // // عزم مقاومة الدوران (يعتمد على سرعة الدوران الحالية)

    // const dampingTorqueYaw = new Vector3(0, -this.yawDampingCoeff * this.angularVelocity.y, 0);
    // const netTorque = torqueYew.add(dampingTorqueYaw);
    // this.angularAcceleration = this.computeAngularAcceleration(netTorque);

    // this.angularVelocity = this.angularVelocity.add(this.angularAcceleration.scale(dt));
    // this.yawAngle += this.angularVelocity.y * dt;

    // this.orientation = this.orientation.add(this.accelerationVector().scale(dt));
    // this.acceleration = this.accelerationVector();
    // this.velocity = this.velocity.add(this.acceleration.scale(dt));
    // this.position = this.position.add(this.velocity.scale(dt));
  }


   changePosture(factor) {
    this.bodyPostureFactor = factor;
  }

}
