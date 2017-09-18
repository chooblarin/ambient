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
  let amplitude
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
    }
  }

  let isLoading = true
  let mode = 0

  p.setup = () => {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL)

    sampleSound = p.loadSound('assets/sample.mp3',
      () => {
        isLoading = false
        sampleSound.setVolume(0.1)
        sampleSound.play()
      },
      (err) => {
        console.log(err)
      })

    amplitude = new p5.Amplitude()
    fft = new p5.FFT()
  }

  p.draw = () => {
    if (isLoading) {
      return
    }

    p.orbitControl()

    p.background(255)

    fft.analyze()
    const beats = SpectrumBeats.detect(fft)
    generate(beats)
    particles = step(beats)
  }

  p.keyPressed = () => {
    switch (p.keyCode) {
      case 49: // 1
        mode = 0
        break
      case 50: // 2
        concentrate()
        mode = 1
        break
      case 51: // 3
        mode = 2
        break
      case 67: // c
        concentrate()
        break
      case 32: // Space
        break
    }
  }

  let generate = (beats) => {
    switch (mode) {
      case 0:
        generateRandomly(beats)
        break
      case 1:
        generateCentered(beats)
        break
      case 2:
        // no generation
        break
    }
  }

  let step = (beats) => {
    let nextGeneration = []
    for (let particle of particles) {
      switch (mode) {
        case 0:
          particle.draw(p)
          particle.update()
          if (particle.isAlive()) {
            nextGeneration.push(particle)
          }
          break
        case 1:
          particle.draw(p)
          particle.update()
          if (particle.isAlive()) {
            nextGeneration.push(particle)
          }
          break
        case 2:
          const level = amplitude.getLevel()
          particle.radius = 25 * level + 2
          particle.draw(p)
          nextGeneration.push(particle)
          break
      }
    }
    return nextGeneration
  }

  let generateRandomly = (beats) => {
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

  let generateCentered = (beats) => {
    for (let b of beats) {
      const r = b.range
      const prop = pprops[r]
      const count = prop.count
      for (let i = 0; i < count; i += 1) {
        const pos = p.createVector(0, 0, 0)
        const vel = p5.Vector.random3D()
        vel.normalize()
        vel.mult(20.0 * b.level)
        const acc = p.createVector(0, 0, 0)
        const col = randomSelectedColor()
        const size = 15 * (1.0 - b.level)
        const particle = new Particle(pos, vel, acc, size, col)
        particle.resetLife(140)
        particles.push(particle)
      }
    }
  }

  let spawnParticle = (size, col) => {
    const x = p.random(-p.width / 2.0, p.width / 2.0)
    const y = p.random(-p.height / 2.0, p.height / 2.0)
    const z = p.random(100, -1000)
    const pos = p.createVector(x, y, z)
    const vel = p5.Vector.random3D()
    vel.normalize()
    vel.mult(5.0)
    const acc = p.createVector(0, 0, 0)
    return new Particle(pos, vel, acc, size, col)
  }

  let concentrate = () => {
    for (let particle of particles) {
      particle.acc = p5.Vector.mult(particle.pos, -0.05)
    }
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
