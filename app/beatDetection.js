import p5 from 'p5'
import 'p5/lib/addons/p5.sound'

export function sketch(p) {

  let p5canvas
  let sampleSound
  let amplitude
  let fft

  const ranges = ['bass', 'lowMid', 'mid', 'highMid', 'treble']

  p.preload = function () {
    sampleSound = p.loadSound('assets/sample.mp3')
  }

  p.setup = function () {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p5canvas.mouseClicked(togglePlay)

    amplitude = new p5.Amplitude()
    fft = new p5.FFT()

    sampleSound.play()
  }

  p.draw = function () {
    p.clear()
    p.background(0)

    const width = p.width
    const height = p.height

    const _ = fft.analyze()

    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i]
      const e = fft.getEnergy(r)
      const x = (width / ranges.length * i) + 30
      drawLevelBar(x, e)
    }
  }

  let togglePlay = () => {
    if (sampleSound.isPlaying()) {
      sampleSound.pause()
    } else {
      sampleSound.play()
    }
  }

  let drawLevelBar = (x, level) => {
    const barWidth = 60
    const barHeight = p.map(level, 0, 255, 0, p.height)
    p.fill(255)
    p.rect(x - barWidth / 2, p.height - barHeight, barWidth, barHeight)
  }
}
