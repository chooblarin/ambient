import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

import Particle from './Particle'

export function sketch(p) {

  let p5canvas
  let particles = []

  p.setup = () => {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = () => {
    p.clear()
    p.background(0)

    let nextGeneration = []
    for (let particle of particles) {
      particle.draw(p)
      particle.update()

      if (particle.isAlive()) {
        nextGeneration.push(particle)
      }
    }
    particles = nextGeneration
  }

  p.keyPressed = () => {
    if (32 == p.keyCode) { // Space
      for (let i = 0; i < 5; i += 1) {
        const particle = spawnParticle()
        particles.push(particle)
      }
    }
  }

  let spawnParticle = () => {
    const x = p.random(p.width)
    const y = p.random(p.height)
    const pos = p.createVector(x, y)
    const vel = p5.Vector.random2D()
    const acc = p.createVector(0, 0)
    vel.normalize()
    vel.mult(5.0)
    const size = 10.0
    const col = p.color(255)
    return new Particle(pos, vel, acc, size, col)
  }

  let randomColor = () => {
    const r = 255 * Math.random()
    const g = 255 * Math.random()
    const b = 255 * Math.random()
    return p.color(r, g, b)
  }
}
