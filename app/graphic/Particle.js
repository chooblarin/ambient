import p5 from 'p5'

class Particle {

  constructor(pos, vel, acc, size, color) {
    this.pos = pos
    this.vel = vel
    this.acc = acc
    this.size = size
    this.color = color

    this.radius = size / 2.0
    this.mass = size / 10.0
    this.decayRate = 0.95
    this.life = 200
    this.maxLife = 200
  }

  applyForce(f) {
    this.acc.add(p5.Vector.div(f, m))
  }

  isAlive() {
    return 0 < this.life
  }

  update() {
    this.vel.add(this.acc)
    this.pos.add(this.vel)

    this.life -= 2
    this.vel.mult(this.decayRate)
    this.acc.mult(0)
  }

  draw($) {
    const colR = $.red(this.color)
    const colG = $.green(this.color)
    const colB = $.blue(this.color)
    const colA = 255 * this.life / this.maxLife
    const col = $.color(colR, colG, colB, colA)
    $.fill(col)
    $.push()
    $.translate(- $.width / 2.0, - $.height / 2.0)
    $.translate(this.pos.x, this.pos.y, this.pos.z)
    $.sphere(this.radius)
    $.pop()
  }
}

export default Particle
