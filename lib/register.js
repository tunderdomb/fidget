var createPrototype = require("./createPrototype")
var createAttributes = require("./createAttributes")
var createDispatcher = require("./createDispatcher")
var createFragments = require("./createFragments")
var defineElements = require("./defineElements")

/** Widget registry, contains native element constructors by their tag-name */
var widgets = {}

/**
 * Register a custom element
 * */
module.exports = function register( definition ){
  if( !definition ){
    console.error("Missing element definition")
    return
  }

  // extracting reserved words

  /** the name of the custom element */
  var name = definition.name
  delete definition.name
  if( !name ){
    console.error("Missing element name")
    return
  }

  /** The super class the element inherits its prototype from */
  var inherit = definition.inherit
  delete definition.inherit
  switch( typeof inherit ){
    case "string":
      // inherit an existing custom element
      if( widgets[inherit] ){
        inherit = widgets[inherit].prototype
      }
      // inherit a native element
      else {
        inherit = "HTML"+inherit.toUpperCase()+"Element"
        inherit = window[inherit] && window[inherit].prototype
      }
      break
    case "function":
      // inherit a constructor prototype
      inherit = inherit.prototype
      break
  }
  // by default inherit from HTMLElement
  if( !inherit ) inherit = window.HTMLElement.prototype

  /** The element this custom element extends */
  var is = definition.extends ? definition.extends : undefined
  delete  definition.extends

  /** An optional function to render this custom element */
  var renderFn = definition.render
  delete definition.render

  /** Attribute shortcuts */
  var attributes = definition.attributes
  delete definition.attributes

  /** Html fragments */
  var fragments = definition.fragments
  delete definition.fragments
  /** A function to render html fragment strings */
  var renderFragment = definition.renderFragment
  delete definition.renderFragment

  /** Event definitions for dispatch */
  var events = definition.events
  delete definition.events

  /** Element getter shortcuts */
  var elements = definition.elements
  delete definition.elements

  // what's left is the prototype
  var proto = definition

  // define attributes and get an attribute manager
  var attributeManager = createAttributes(proto, attributes)

  defineElements(proto, elements)

  proto.dispatch = createDispatcher(events)
  proto.fragment = createFragments(fragments, renderFragment)

  // proxy the render function so it always returns `this`
  proto.render = function(  ){
    renderFn && renderFn.apply(this, arguments)
    return this
  }

  var createdCallback = definition.createdCallback
  proto.createdCallback = function(  ){
    // reset attribute values according to attribute definitions
    attributeManager.setDefaultValues(this)
    // call the createdCallback for this element if it's defined
    if( typeof createdCallback == "function" ){
      createdCallback.call(this)
    }
  }
  var attributeChangedCallback = definition.attributeChangedCallback
  proto.attributeChangedCallback = function( name, previousValue, value ){
    // call the handlers from the attribute definitions first
    attributeManager.callOnChangedCallback(this, name, previousValue, value)
    // then let the general default handler run if it's defined
    if( typeof attributeChangedCallback == "function" ) {
      attributeChangedCallback.apply(this, arguments)
    }
  }

  proto = createPrototype(proto)
  proto = Object.create(inherit, proto)

  // it's important that `extends` is not on the object even if it's undefined
  var elementDef = is ? {'extends': is, prototype: proto} : {prototype: proto}
  // the native element constructor
  var Constructor = window.document.registerElement(name, elementDef)
  // static render function that instantiates an element
  // and calls render with the arguments passed in
  Constructor.render = function(){
    var element = window.document.createElement(name)
    if( renderFn ){
      renderFn.apply(element, arguments)
    }
    return element
  }
  // save it in a registry
  widgets[name] = Constructor

  return Constructor
}

/**
 * Render an element from the widget registry
 * */
module.exports.render = function( name ){
  if( !widgets[name] ){
    console.error("Unregistered element:", name)
    return null
  }
  return widgets[name].render.apply(null, [].slice.call(arguments, 1))
}
