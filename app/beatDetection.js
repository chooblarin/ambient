import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import BeatDetector from './BeatDetector'

export function sketch(p) {

  const ranges = ['bass', 'lowMid', 'mid', 'highMid', 'treble']

  let p5canvas
  let sampleSound
  let amplitude
  let fft

  let detectors = {}

  p.preload = function () {
    sampleSound = p.loadSound('assets/sample.mp3')
  }

  p.setup = function () {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p5canvas.mouseClicked(togglePlay)

    amplitude = new p5.Amplitude()
    fft = new p5.FFT()

    sampleSound.play()

    detectors['bass'] = new BeatDetector(10, 0.85, 0.65)
    detectors['lowMid'] = new BeatDetector(30, 0.97, 0.40)
    detectors['mid'] = new BeatDetector(20, 0.90, 0.3)
    detectors['highMid'] = new BeatDetector(40, 0.97, 0.3)
    detectors['treble'] = new BeatDetector(20, 0.90, 0.15)
  }

  p.draw = function () {
    p.clear()
    p.background(0)

    fft.analyze()

    for (let i = 0; i < ranges.length; i += 1) {
      const r = ranges[i]
      const x = i * (p.width / ranges.length) + 30
      const e = fft.getEnergy(r)
      const level = e / 255.0

      const beatDetector = detectors[r]
      const isBeatDetected = beatDetector.detect(level)

      p.fill(255, 0, 0)
      drawLevelBar(x, level)

      p.fill(0, 255, 0)
      drawThreshold(x, beatDetector.cutOff)

      if (isBeatDetected) {
        p.fill(255)
        p.ellipse(x, 100, 60, 60)
      }
    }
  }

  let togglePlay = () => {
    if (sampleSound.isPlaying()) {
      sampleSound.pause()
    } else {
      sampleSound.play()
    }
  }

  let drawThreshold = (x, level) => {
    const barWidth = 60
    const maxHeight = p.height - 400
    const barHeight = p.map(level, 0, 1.0, 0, maxHeight)
    p.rect(x - 30, p.height - barHeight, barWidth, 10)
  }

  let drawLevelBar = (x, level) => {
    const barWidth = 60
    const maxHeight = p.height - 400
    const barHeight = p.map(level, 0, 1.0, 0, maxHeight)
    p.rect(x - barWidth / 2, p.height - barHeight, barWidth, barHeight)
  }
}
