import p5 from 'p5'
import 'p5/lib/addons/p5.sound'
import BeatDetector from './BeatDetector'

export function sketch(p) {

  const ranges = ['bass', 'lowMid', 'mid', 'highMid', 'treble']

  let p5canvas
  let sampleSound
  let amplitude
  let fft

  let beatDetector

  p.preload = function () {
    sampleSound = p.loadSound('assets/sample.mp3')
  }

  p.setup = function () {
    p5canvas = p.createCanvas(p.windowWidth, p.windowHeight)
    p5canvas.mouseClicked(togglePlay)

    amplitude = new p5.Amplitude()
    fft = new p5.FFT()

    sampleSound.play()
    sampleSound.pause()

    beatDetector = new BeatDetector(20, 0.9, 0.15)
  }

  p.draw = function () {
    p.clear()
    p.background(0)

    const level = amplitude.getLevel()
    const isBeatDetected = beatDetector.detect(level)

    const x = p.width / 2
    drawLevelBar(x, level)

    const th = p.map(beatDetector.cutOff, 0, 0.7, 0, p.height)
    p.fill(0, 255, 0)
    p.rect(x - 30, p.height - th, 60, 10)

    let circleSize
    if (isBeatDetected) {
      p.fill(255)
      circleSize = 60
      p.ellipse(x, 100, circleSize, circleSize)
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
    const maxHeight = p.height - 200
    const barHeight = p.map(level, 0, 0.7, 0, maxHeight)
    p.rect(x - barWidth / 2, p.height - barHeight, barWidth, barHeight)
  }
}
