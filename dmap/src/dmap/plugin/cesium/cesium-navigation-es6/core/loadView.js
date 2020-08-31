/* eslint-disable no-unused-vars */
import Cesium from  require('cesium/Cesium')
import createFragmentFromTemplate from './createFragmentFromTemplate'
var getElement = Cesium.getElement
var Knockout = Cesium.knockout

var loadView = function (htmlString, container, viewModel) {
  container = getElement(container)

  var fragment = createFragmentFromTemplate(htmlString)

  // Sadly, fragment.childNodes doesn't have a slice function.
  // This code could be replaced with Array.prototype.slice.call(fragment.childNodes)
  // but that seems slightly error prone.
  var nodes = []

  var i
  for (i = 0; i < fragment.childNodes.length; ++i) {
    nodes.push(fragment.childNodes[i])
  }

  container.appendChild(fragment)

  for (i = 0; i < nodes.length; ++i) {
    var node = nodes[i]
    console.log(node);
    if (node.nodeType === 1 || node.nodeType === 8) {
      Knockout.applyBindings(viewModel, node)
    }
  }

  return nodes
}

export default loadView
