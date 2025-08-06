// Vector3.js
export class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  scale(scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  }

  normalize() {
    const mag = this.magnitude();
    return mag === 0 ? new Vector3(0, 0, 0) : this.scale(1 / mag);
  }

  negate() {
    return new Vector3(-this.x, -this.y, -this.z);
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  toString() {
    return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
  }
  subtract(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);}
}
