import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

import Particle from './graphic/Particle'
import {
  SpectrumBeats,
  ranges
} from './sound/SpectrumBeats'

export function sketch(p) {

  let p5canvas
  let sampleSound
  let fft
  let particles = []

  let pprops = {
    'bass': {
      size: 80,
      count: 3
    },
    'lowMid': {
      size: 40,
      count: 5
    },
    'mid': {
      size: 30,
      count: 10
    },
    'highMid': {
      size: 20,
      count: 10
    },
    'treble': {
      size: 10,
      count: 30
    },
  }

  p.preload = function () {
    sampleSound = p.loadSound('assets/sample.mp3')
  }

  p.setup = () => {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)
    fft = new p5.FFT()
    sampleSound.play()
  }

  p.draw = () => {
    p.orbitControl()

    p.background(255)

    fft.analyze()
    const beats = SpectrumBeats.detect(fft)

    drawRandomly(beats)

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
    }
  }

  let drawRandomly = (beats) => {
    for (let b of beats) {
      const r = b.range
      const prop = pprops[r]
      const count = prop.count
      for (let i = 0; i < count; i += 1) {
        const col = randomSelectedColor()
        const size = prop.size
        const particle = spawnParticle(size, col)
        particles.push(particle)
      }
    }
  }

  let spawnParticle = (size, col) => {
    const x = p.random(p.width)
    const y = p.random(p.height)
    const z = p.random(100, -1000)
    const pos = p.createVector(x, y, z)
    const vel = p5.Vector.random3D()
    vel.normalize()
    vel.mult(5.0)
    const acc = p.createVector(0, 0)
    return new Particle(pos, vel, acc, size, col)
  }

  let randomColor = () => {
    const r = 255 * Math.random()
    const g = 255 * Math.random()
    const b = 255 * Math.random()
    return p.color(r, g, b)
  }

  let randomSelectedColor = () => {
    const c = colors[Math.floor(Math.random() * colors.length)]
    return p.color(c)
  }

  const colors = [
    'rgb( 25,  68, 133)',
    'rgb( 30,  53, 141)',
    'rgb( 69,   2, 115)',
    'rgb(109,  18,  78)',
    'rgb(102,  22,  90)',
    'rgb( 99,  57, 147)',
    'rgb( 193,  62, 254)',
    'rgb(242, 159, 183)',
    'rgb(221, 115, 167)',
    'rgb(218,   0, 109)',
    'rgb(225,  51,  35)',
    'rgb(226,  77,  76)',
    'rgb(238, 140,  38)',
    'rgb(249, 196,   9)',
    'rgb(243, 213,  34)',
    'rgb(253, 243,  10)',
    'rgb(168, 204,   7)',
    'rgb( 33, 178,  80)',
    'rgb( 30, 135,  40)',
    'rgb( 18, 143, 150)',
    'rgb(105, 210, 231)',
    'rgb(167, 219, 216)',
    'rgb(224, 228, 204)',
    'rgb( 26, 146, 166)',
    'rgb( 17, 140, 226)',
    'rgb(  0,  71, 255)'
  ]
}
