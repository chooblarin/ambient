import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

import Particle from './Particle'
import {
  SpectrumBeats,
  ranges
} from './SpectrumBeats'

export function sketch(p) {

  let p5canvas
  let sampleSound
  let fft
  let particles = []

  let pprops = {
    'bass': {size: 80, count: 3},
    'lowMid': {size: 40, count: 3},
    'mid': {size: 30, count: 5},
    'highMid': {size: 20, count: 5},
    'treble': {size: 5, count: 40},
  }

  p.preload = function () {
    sampleSound = p.loadSound('assets/sample.mp3')
  }

  p.setup = () => {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    fft = new p5.FFT()
    sampleSound.play()
  }

  p.draw = () => {
    p.clear()
    p.background(255)

    fft.analyze()
    const beats = SpectrumBeats.detect(fft)
    for (let b of beats) {
      const count = pprops[b].count
      for (let i = 0; i < count; i += 1) {
        const col = randomColor()
        const size = pprops[b].size
        const particle = spawnParticle(size, col)
        particles.push(particle)
      }
    }

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

  let spawnParticle = (size, col) => {
    const x = p.random(p.width)
    const y = p.random(p.height)
    const pos = p.createVector(x, y)
    const vel = p5.Vector.random2D()
    const acc = p.createVector(0, 0)
    vel.normalize()
    vel.mult(5.0)
    return new Particle(pos, vel, acc, size, col)
  }

  let randomColor = () => {
    const r = 255 * Math.random()
    const g = 255 * Math.random()
    const b = 255 * Math.random()
    return p.color(r, g, b)
  }
}
