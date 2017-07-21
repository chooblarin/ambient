import BeatDetector from './BeatDetector'

const ranges = ['bass', 'lowMid', 'mid', 'highMid', 'treble']

const SpectrumBeats = {}

const detectors = {}

detectors['bass'] = new BeatDetector(10, 0.85, 0.65)
detectors['lowMid'] = new BeatDetector(30, 0.97, 0.40)
detectors['mid'] = new BeatDetector(20, 0.90, 0.3)
detectors['highMid'] = new BeatDetector(40, 0.97, 0.3)
detectors['treble'] = new BeatDetector(20, 0.90, 0.15)

SpectrumBeats.detect = (fft) => {

  const beats = []

  for (let i = 0; i < ranges.length; i += 1) {
    const r = ranges[i]
    const e = fft.getEnergy(r)
    const level = e / 255.0
    const beatDetector = detectors[r]
    const isBeatDetected = beatDetector.detect(level)
    if (isBeatDetected) {
      beats.push(r)
    }
  }
  return beats
}

export {SpectrumBeats, ranges}
