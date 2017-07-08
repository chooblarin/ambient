console.log('hello')

import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

const sketch = function (p) {

  let p5canvas
  let sampleSound
  let amplitude
  let fft

  p.preload = function () {
    sampleSound = p.loadSound('assets/sample.mp3')
  }

  p.setup = function () {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p5canvas.mouseClicked(togglePlay)

    amplitude = new p5.Amplitude()
    fft = new p5.FFT()

    sampleSound.setVolume(0.1)
    sampleSound.amp(0.2)
    sampleSound.play()
  }

  p.draw = function () {
    const width = p.width
    const height = p.height

    p.background(0)

    const spectrum = fft.analyze()
    p.noStroke()
    p.fill(255, 255, 40)

    spectrum.forEach((elem, i) => {
      const x = p.map(i, 0, spectrum.length, 0, width)
      const h = -height + p.map(elem, 0, 255, height, 0)
      p.rect(x, height, width / spectrum.length, h)
    })

    const waveform = fft.waveform()
    p.noFill()
    p.beginShape()
    p.stroke(255, 40, 255)
    p.strokeWeight(5)

    waveform.forEach((elem, i) => {
      const x = p.map(i, 0, waveform.length, 0, width)
      const y = p.map(elem, -1, 1, 0, height)
      p.vertex(x, y)
    })

    p.endShape()

    p.fill(255)
    const level = amplitude.getLevel()
    const size = p.map(level, 0, 1, 0, 500)
    p.ellipse(width / 2, height / 2, size, size)
  }

  let togglePlay = function () {
    if (sampleSound.isPlaying()) {
      sampleSound.pause()
    } else {
      sampleSound.play()
    }
  }
}

new p5(sketch)