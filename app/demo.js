import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

class Droplet {

  constructor(position, velocity, acceleration, size, color, life) {
    this.position = position
    this.velocity = velocity
    this.acceleration = acceleration
    this.size = size
    this.color = color

    this.mass = size

    this.startLife = life
    this.currentLife = life
  }

  applyForce(f) {
    this.acceleration.add(p5.Vector.div(f, this.mass))
  }

  applyGravity(g) {
    this.acceleration.add(g)
  }

  update() {
    this.velocity.add(this.acceleration)
    this.position.add(this.velocity)
    this.acceleration.mult(0)
    this.currentLife -= 1
  }

  render(p) {
    const lifeRate = this.currentLife / this.startLife
    const radius = this.size
    const alpha = 255 * lifeRate
    const r = p.red(this.color)
    const g = p.green(this.color)
    const b = p.blue(this.color)
    const color = p.color(r, g, b, alpha)
    p.noStroke()
    p.fill(color)
    p.ellipse(this.position.x, this.position.y, radius, radius)
  }

  isAlive() {
    return 0 < this.currentLife
  }
}

export function sketch(p) {

  let p5canvas
  let sampleSound
  let amplitude
  let fft

  let droplets = []
  let g = p.createVector(0, 0.04)

  let smoothedVolume = 0.0

  p.preload = () => {
    sampleSound = p.loadSound('assets/sample.mp3')
  }

  p.setup = () => {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p5canvas.mouseClicked(togglePlay)

    amplitude = new p5.Amplitude()
    fft = new p5.FFT()

    p.smooth(0.5)

    sampleSound.setVolume(0.1)
    sampleSound.amp(0.2)
    sampleSound.play()
  }

  p.draw = () => {
    p.background(255)

    droplets.forEach((d) => {
      d.applyGravity(g)
      d.update()
      d.render(p)
    })
    droplets = droplets.filter(d => d.isAlive())

    if (0 === p.frameCount % 20) {
      const d = generateDroplet()
      droplets.push(d)
    }
  }

  p.keyPressed = () => {
    if (32 == p.keyCode) { // Space
      console.log(smoothedVolume)

      const d = generateDroplet()
      droplets.push(d)
    }
  }

  let generateDroplet = () => {
    const x = p.width * Math.random()
    const y = p.height
    const position = p.createVector(x, y)

    const level = amplitude.getLevel()
    
    const dvy = p.map(level, 0, 1, 2, 5)
    const velocity = p.createVector(0, -(2 + dvy))
    const acceleration = p.createVector(0, 0)

    const size = p.map(level, 0, 1, 50, 100)
    const color = randomColor()
    return new Droplet(position, velocity, acceleration, size, color, 200)
  }

  let randomColor = () => {
    const r = 255 * Math.random()
    const g = 255 * Math.random()
    const b = 255 * Math.random()
    return p.color(r, g, b)
  }

  let togglePlay = () => {
    if (sampleSound.isPlaying()) {
      sampleSound.pause()
    } else {
      sampleSound.play()
    }
  }
}
