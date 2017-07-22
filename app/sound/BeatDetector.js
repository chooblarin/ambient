class BeatDetector {

  constructor(holdTime, decayRate, minLevel) {
    this.holdTime = holdTime // the number of frames to hold a beat
    this.decayRate = decayRate
    this.minLevel = minLevel // a volume less than this is no beat

    this.cutOff = 0.0
    this.time = 0
  }

  detect(level) {
    const val = level || 0.0

    if (this.minLevel < val && this.cutOff < val) {
      this.cutOff = val * 1.1
      this.time = 0

      return true

    } else {
      if (this.time <= this.holdTime) {
        this.time += 1
      } else {
        const decayed = this.cutOff * this.decayRate
        this.cutOff = Math.max(decayed, this.minLevel)
      }
      return false
    }
  }
}

export default BeatDetector
