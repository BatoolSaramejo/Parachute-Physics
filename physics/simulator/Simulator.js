// export class Simulator {
//   constructor(parachute, dt = 0.1) {
//     this.parachute = parachute;
//     this.dt = dt;
//   }

//   run(totalTime = 120, forceOptions = {}) {
//     const maxSteps = Math.floor(totalTime / this.dt);
//     let steps = 0;

//     // رؤوس الأعمدة
//     console.log(
//       "Time(s)".padEnd(10) +
//       "Y-Pos(m)".padEnd(12) +
//       "Y-Velocity(m/s)".padEnd(18) +
//       "Parachute Open"
//     );

//     for (let i = 0; i < maxSteps; i++) {
//       const currentTime = i * this.dt;

//       // فتح المظلة بعد 5 ثوانٍ
//       if (currentTime >= 5 && !this.parachute.isParachuteOpen) {
//         this.parachute.isParachuteOpen = true;
//         console.log(`\n🪂 Parachute opened at t = ${currentTime.toFixed(1)}s`);
//       }

//       // تحديث حالة المظلي
//       this.parachute.update(this.dt, forceOptions);

//       // طباعة القيم الزمنية
//       console.log(
//         currentTime.toFixed(1).padEnd(10) +
//         this.parachute.position.y.toFixed(2).padEnd(12) +
//         this.parachute.velocity.y.toFixed(2).padEnd(18) +
//         (this.parachute.isParachuteOpen ? "Yes" : "No")
//       );

//       steps++;

//       // التوقف عند الوصول للأرض (بهوامش رقمية صغيرة)
//       if (this.parachute.position.y <= 0.1) {
//         console.log(`\n✅ Parachuter reached the ground at t = ${currentTime.toFixed(1)}s`);
//         return;
//       }
//     }

//     // إذا انتهى الوقت ولم يصل للأرض
//     console.log(`\n⏹️ Simulation ended after ${steps * this.dt}s. Final altitude: ${this.parachute.position.y.toFixed(2)} m`);
//   }
// }
export class Simulator {
  constructor(parachute, dt = 0.1) {
    this.parachute = parachute;
    this.dt = dt;
  }

  run(totalTime = 120, forceOptions = {}) {
    const maxSteps = Math.floor(totalTime / this.dt);
    let steps = 0;

    for (let i = 0; i < maxSteps; i++) {
      const currentTime = i * this.dt;

      // فتح المظلة بعد 5 ثوانٍ
      if (currentTime >= 5 && !this.parachute.isParachuteOpen) {
        this.parachute.isParachuteOpen = true;
        console.log(`\n🪂 Parachute opened at t = ${currentTime.toFixed(1)}s`);
      }

      // تحديث حالة المظلي
      this.parachute.update(this.dt, forceOptions);

      // طباعة الموضع والسرعة كـشعاع
      console.log(
        `Time: ${currentTime.toFixed(1)}s | ` +
        `Position: ${this.parachute.position.toString()} | ` +
        `Velocity: ${this.parachute.velocity.toString()} | ` +
        `Parachute Open: ${this.parachute.isParachuteOpen ? "Yes" : "No"}`
      );

      steps++;

      // التوقف عند الوصول للأرض
      if (this.parachute.position.y <= 0.1) {
        console.log(`\n✅ Parachuter reached the ground at t = ${currentTime.toFixed(1)}s`);
        return;
      }
    }

    console.log(`\n⏹️ Simulation ended after ${steps * this.dt}s. Final altitude: ${this.parachute.position.y.toFixed(2)} m`);
  }
}
