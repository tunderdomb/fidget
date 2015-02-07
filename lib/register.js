var createPrototype = require("./createPrototype")
var createAttributes = require("./createAttributes")
var createDispatcher = require("./createDispatcher")

var widgets = {}

module.exports = function register( name, base, is, proto ){
  base = base ? base.prototype || base : window.HTMLElement
  is = is ? is : undefined
  proto = proto || {}

  var initializedCallback = proto.initializedCallback
  delete proto.initializedCallback
  var attributes = proto.attributes
  delete proto.attributes
  var events = proto.events
  delete proto.events

  createAttributes(proto, attributes)
  proto.dispatch = createDispatcher(events)
  proto = createPrototype(proto)
  proto = Object.create(base, proto)

  var Constructor = window.document.registerElement(name, {
    'extends': is,
    prototype: proto
  })

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