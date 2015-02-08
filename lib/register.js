var createPrototype = require("./createPrototype")
var createAttributes = require("./createAttributes")
var createDispatcher = require("./createDispatcher")

function createDefaultAttributeSetter( defaultAttributeValues ){
  return function(  ){
    for( var attrName in defaultAttributeValues ){
      if( defaultAttributeValues.hasOwnProperty(attrName) ){
        this.setAttribute(attrName, defaultAttributeValues[attrName])
      }
    }
  }
}

function createAttributeChangedCallback( onChangeCallbacks ){
  return function handleAttributeChange( name, previousValue, value ){
    var handler = onChangeCallbacks[name]
    if( !handler ) return
    handler.call(this, previousValue, value)
  }
}

var widgets = {}

module.exports = function register( definition ){
  var name = definition.name
  delete definition.name

  var base = definition.inherit
    ? definition.inherit.prototype || definition.inherit
    : window.HTMLElement.prototype
  delete definition.inherit

  var is = definition.extends ? definition.extends : undefined
  delete  definition.extends

  var renderFn = definition.render
  delete definition.render

  var attributes = definition.attributes
  delete definition.attributes

  var events = definition.events
  delete definition.events

  // what's left is the prototype
  var proto = definition

  var onChangeCallbacks = {}
  var defaultAttributeValues = {}
  createAttributes(proto, attributes, onChangeCallbacks, defaultAttributeValues)
  var handleAttributeChange = createAttributeChangedCallback(onChangeCallbacks)
  var setDefaultAttributeValues = createDefaultAttributeSetter(defaultAttributeValues)

  proto.dispatch = createDispatcher(events)

  proto.render = function(  ){
    renderFn.apply(this, arguments)
    return this
  }

  var createdCallback = definition.createdCallback
  proto.createdCallback = function(  ){
    setDefaultAttributeValues.call(this)
    if( typeof createdCallback == "function" ){
      createdCallback.call(this)
    }
  }
  var attributeChangedCallback = definition.attributeChangedCallback
  proto.attributeChangedCallback = function( name, previousValue, value ){
    // call the more specific handler first
    handleAttributeChange.apply(this, arguments)
    // then let the more general default handler run
    if( typeof attributeChangedCallback == "function" ) {
      attributeChangedCallback.apply(this, arguments)
    }
  }

  proto = createPrototype(proto)
  proto = Object.create(base, proto)

  var elementDef = is
    ? {'extends': is, prototype: proto}
    : {prototype: proto}
  var Constructor = window.document.registerElement(name, elementDef)
  widgets[name] = Constructor
  Constructor.render = function render(){
    var element = window.document.createElement(name)
    if( renderFn ){
      renderFn.apply(element, arguments)
    }
    return element
  }

  return Constructor
}

module.exports.render = function( name ){
  return widgets[name].render(null, [].slice.call(arguments, 1))
}