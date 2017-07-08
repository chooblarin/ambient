console.log('hello')

import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

const sketch = function (p) {

  let p5canvas
  let sampleSound
  let amplitude

  p.preload = function () {
    sampleSound = p.loadSound('assets/sample.mp3')
  }

  p.setup = function () {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p5canvas.mouseClicked(() => {
      if (sampleSound.isPlaying()) {
        sampleSound.pause()
      } else {
        sampleSound.play()
      }
    })

    amplitude = new p5.Amplitude()

    sampleSound.setVolume(0.1)
    sampleSound.play()
  }

  p.draw = function () {
    p.background(0)
    p.fill(255)
    const level = amplitude.getLevel()
    const size = p.map(level, 0, 1, 0, 500)
    p.ellipse(p.width / 2, p.height / 2, size, size)
  }
}

new p5(sketch)