console.log('hello')

import p5 from 'p5'

const sketch = function(p) {

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = function() {
    p.fill(0)
    p.ellipse(50, 50, 80, 80)
  }
}

new p5(sketch)
