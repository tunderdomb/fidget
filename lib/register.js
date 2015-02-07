var createPrototype = require("./createPrototype")
var createAttributes = require("./createAttributes")
var createDispatcher = require("./createDispatcher")

var widgets = {}

module.exports = function register( definition ){
  var name = definition.name
  var base = definition.inherit
    ? definition.inherit.prototype || definition.inherit
    : window.HTMLElement.prototype
  var is = definition.extends ? definition.extends : undefined

  var initializedCallback = definition.initialize || definition.render
  var attributes = definition.attributes
  var events = definition.events
  var proto = definition.prototype || {}

  createAttributes(proto, attributes)
  proto.dispatch = createDispatcher(events)
  proto.initialize = initializedCallback
  proto.createdCallback = definition.createdCallback
  proto.attachedCallback = definition.attachedCallback
  proto.detachedCallback = definition.detachedCallback
  proto.attributeChangedCallback = definition.attributeChangedCallback
  proto = createPrototype(proto)
  proto = Object.create(base, proto)

  var elementDef = is
    ? {'extends': is, prototype: proto}
    : {prototype: proto}

  var Constructor = window.document.registerElement(name, elementDef)

  function render(){
    var element = window.document.createElement(name)
    if( initializedCallback ){
      initializedCallback.apply(element, arguments)
    }
    return element
  }

  Constructor.render = render
  widgets[name] = Constructor
  return Constructor
}

module.exports.render = function( name ){
  return widgets[name].render(null, [].slice.call(arguments, 1))
}