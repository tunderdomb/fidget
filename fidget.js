(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var WidggetDefinition = require("./lib/WidgetDefinition")
var createPrototype = require("./lib/util/createPrototype")
var fidget = {}

module.exports = fidget
global.fidget = fidget

var widgets = {}

function render( name ){
  var element = window.document.createElement(name)
  widgets[name].call(element, [].slice(arguments, 1))
  return element
}

fidget.register = function( name, extend, is, proto ){
  //if( typeof extend == "string" ){
  //  is = extend
  //  extend = null
  //}
  extend = extend || window.HTMLElement

  var initializedCallback = proto.initializedCallback
  delete proto.initializedCallback

  var base = extend.prototype || extend
  proto = Object.create(base, createPrototype(proto))

  // register constructor
  window.document.registerElement(name, {
    // for this: <div is="my-element">
    'extends': is ? is : undefined,
    prototype: proto
  })

  var def = new WidggetDefinition(proto)

  // TODO: decide what to return: factory function or constructor
  def.render = function(  ){
    debugger
    var element = window.document.createElement(name)
    if( initializedCallback ) {
      initializedCallback.apply(element, arguments)
    }
    return element
  }

  widgets[name] = def

  return def
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./lib/WidgetDefinition":2,"./lib/util/createPrototype":3}],2:[function(require,module,exports){
var extend = require("./util/extend")
var createPrototype = require("./util/createPrototype")

module.exports = WidgetDefinition

function WidgetDefinition( proto ){
  this._is = null
  this._inherit = null
  this._protoype = proto
  this._onInitialized = function AnonymousConstructor(  ){}
  this._onCreated = null
  this._onAttached = null
  this._onDetached = null
  this._onAttributeChanged = null
}

// lifecycle callbacks

WidgetDefinition.prototype.onInitialized = function( callback ){
  this._onInitialized = callback
  return this
}
WidgetDefinition.prototype.onCreated = function( callback ){
  this._onCreated = callback
  Object.defineProperty(this._protoype, "createdCallback", {
    value: callback
  })
  return this
}
WidgetDefinition.prototype.onAttached = function( callback ){
  this._onAttached = callback
  return this
}
WidgetDefinition.prototype.onDetached = function( callback ){
  this._onDetached = callback
  return this
}
WidgetDefinition.prototype.onAttributeChanged = function( callback ){
  this._onAttributeChanged = callback
  return this
}

// inheritance values

WidgetDefinition.prototype.is = function( isValue ){
  this._is = isValue
  return this
}
WidgetDefinition.prototype.inherit = function( inheritValue ){
  this._inherit = inheritValue
  return this
}
WidgetDefinition.prototype.proto = function( protoValue ){
  Object.defineProperties(this._protoype, createPrototype(protoValue))
  return this
}

// instance

WidgetDefinition.prototype.attribute = function( name, def ){
  Object.defineProperty(this._protoype, name, {
    get: def && def.get || function(  ){
      return this.hasAttribute(name)
    },
    set: def && def.set || function( value ){
      if( value ) this.setAttribute(name, "")
      else this.removeAttribute(name)
    }
  })
  return this
}
},{"./util/createPrototype":3,"./util/extend":4}],3:[function(require,module,exports){
module.exports = createPrototype

/**
 * Normalize an object into a descriptor
 * that can be passed to Object.create()
 *
 * This allows for an object to have immediate members
 * and describe a prototype in a more readable manner
 * and later use the object to create a constructor prototype
 * where instance members are defined with Object.create()
 *
 * @example
 *
 * var proto = {
 *    onCreatedCallback: function(){ ... },
 *    someCustomMethod: function(){ ... }
 * }
 *
 * var normalizedProto = Object.create(HTMLElement.prototype, createPrototype(proto))
 * var MyElement = document.registerElement("my-element", normalizedProto)
 * var myElement = new MyElement()
 *
 * myElement.someCustomMethod is now non-enumerable,
 * non-configurable and non-writable on the prototype
 * */
function createPrototype( proto ){
  var member
  for( var name in proto ){
    if( proto.hasOwnProperty(name) ){
      member = proto[name]
      if( typeof member == "function" || member.constructor === Object ){
        proto[name] = {
          value: member
        }
      }
    }
  }
  return proto
}
},{}],4:[function(require,module,exports){
module.exports = function( obj, ext ){
  for( var prop in ext ){
    if( ext.hasOwnProperty(prop) ){
      obj[prop] = ext[prop]
    }
  }
  return obj
}
},{}]},{},[1]);
