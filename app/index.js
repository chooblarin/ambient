import p5 from 'p5'
import {
  sketch
} from './demo'
import styles from './styles/main.css'

new p5(sketch)

const menu = Elm('div', {
  'class': 'mode-menu'
}, [
  Elm('p', {}, [Text('You can switch particles\' move patterns.')]),
  Elm('ul', {
    'class': 'mode-list'
  }, [
    Elm('li', {}, [Text('wandering - (Press \'1\' key)')]),
    Elm('li', {}, [Text('exploding - (Press \'2\' key)')]),
    Elm('li', {}, [Text('beating - (Press \'3\' key)')]),
  ])
])

document.body.appendChild(menu)

function Elm(name, attributes, children = []) {
  let elm = document.createElement(name);
  for (let attributeName in attributes) {
    let attributeValue = attributes[attributeName];
    elm.setAttribute(attributeName, attributeValue);
  }
  children.forEach(e => elm.appendChild(e))
  return elm;
}

function Text(nodeValue) {
  return document.createTextNode(nodeValue);
}
