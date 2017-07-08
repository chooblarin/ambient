console.log('hello')

import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

const sketch = function (p) {

  let p5canvas
  let sampleSound

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

    sampleSound.setVolume(0.1)
    sampleSound.play()
  }

  p.draw = function () {
    p.fill(0)
    p.ellipse(50, 50, 80, 80)
  }
}

new p5(sketch)