(function e( t, n, r ){
  function s( o, u ){
    if( !n[o] ){
      if( !t[o] ){
        var a = typeof require == "function" && require;
        if( !u && a )return a(o, !0);
        if( i )return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f
      }
      var l = n[o] = {exports: {}};
      t[o][0].call(l.exports, function( e ){
        var n = t[o][1][e];
        return s(n ? n : e)
      }, l, l.exports, e, t, n, r)
    }
    return n[o].exports
  }

  var i = typeof require == "function" && require;
  for( var o = 0; o < r.length; o++ )s(r[o]);
  return s
})({
  1: [
    function( require, module, exports ){
      (function( global ){
        module.exports.register = require("./lib/register")
        module.exports.delegate = require("./lib/delegate")
        module.exports.fragment = require("./lib/fragment")

// we're browserified
        if( typeof global != "undefined" && typeof window != "undefined" && global == window ){
          // set a global reference for dist scripts
          window.fidget = module.exports
        }
      }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self
          : typeof window !== "undefined" ? window : {})
    }, {"./lib/delegate": 8, "./lib/fragment": 9, "./lib/register": 10}
  ], 2: [
    function( require, module, exports ){
      var defineAttribute = require("./defineAttribute")

      /**
       * Define attributes on a prototype
       * Register onChangeCallbacks on a hash
       * */
      module.exports = function createAttributes( proto, attributes, onChangeCallbacks, defaultAttributeValues ){
        var def
        for( var name in attributes ){
          if( attributes.hasOwnProperty(name) ){
            def = attributes[name]
            proto[name] = defineAttribute(name, def, defaultAttributeValues)
            if( typeof def.onchange == "function" ){
              onChangeCallbacks[name] = def.onchange
            }
          }
        }
      }
    }, {"./defineAttribute": 6}
  ], 3: [
    function( require, module, exports ){
      module.exports = function createDispatcher( events ){
        if( !events ) return function(){
          return this
        }

        return function dispatch( name, detail ){
          var dispatcher = events[name]
          if( typeof dispatcher == "undefined" ){
            console.error("'" + name + "' is not a dispatcher")
            return
          }
          if( typeof dispatcher !== "function" ){
            return this.dispatchEvent(new window.CustomEvent(name, {
              detail: detail || {},
              'view': dispatcher.view || window,
              'bubbles': dispatcher.bubbles != undefined ? dispatcher.bubbles : true,
              'cancelable': dispatcher.cancelable != undefined ? dispatcher.cancelable : true
            }))
          }
          return dispatcher.call(this, detail)
        }
      }
    }, {}
  ], 4: [
    function( require, module, exports ){
      var fragment = require("./fragment")

      module.exports = function createFragments( fragments, renderFragment ){
        for( var name in fragments ){
          if( fragments.hasOwnProperty(name) ){
            fragments[name] = fragment(fragments[name], renderFragment)
          }
        }

        return function( name, templateContent ){
          var template = fragments[name]
          if( !template ){
            console.warn("Unknown fragment", name)
            return null
          }
          return template(templateContent)
        }
      }
    }, {"./fragment": 9}
  ], 5: [
    function( require, module, exports ){
      /**
       * Normalize an object into a descriptor
       * that can be passed to Object.create()
       *
       * This allows for an object to have immediate members
       * and describe a prototype in a more readable manner
       * and later use the object to create a constructor prototype
       * where instance members are defined with Object.create()
       *
       * If a member value is considered a plain object, it will left untouched,
       * assuming that it's a a property descriptor already.
       *
       * @example
       *
       * var proto = {
 *    onCreatedCallback: function(){ ... },
 *    someCustomMethod: function(){ ... },
 *    someOtherMethod: {
 *      value: function(){ ... },
 *      enumerable: true,
 *      configurable: true
 *    }
 * }
       *
       * var normalizedProto = Object.create(HTMLElement.prototype, createPrototype(proto))
       * var MyElement = document.registerElement("my-element", normalizedProto)
       * var myElement = new MyElement()
       *
       * `myElement.someCustomMethod` is now non-enumerable,
       * non-configurable and non-writable on the prototype as per property descriptor defaults,
       * but `myElement.someOtherMethod` is not.
       * */
      module.exports = function createPrototype( members ){
        var member
        var proto = {}
        for( var name in members ){
          if( members.hasOwnProperty(name) ){
            member = members[name]
            if( member != null ){
              if( typeof member === "object" && (member.constructor === Object || member.toString() === "[object Object]") ){
                proto[name] = member
              }
              else{
                proto[name] = {
                  value: member
                }
              }
            }
          }
        }
        return proto
      }
    }, {}
  ], 6: [
    function( require, module, exports ){
      /**
       * Creates a property descriptor for an HTML attribute.
       * Registers a default value on the provided hash.
       * */
      module.exports = function defineAttribute( name, def, defaultAttributeValues ){
        var type = def.type || def
        var typeOfType = typeof type
        var getter = def.get
        var setter = def.set
        var defaultValue = def.default

        if( typeof defaultValue != "undefined" ){
          defaultAttributeValues[name] = defaultValue
        }

        switch( true ){
          case type === "string" || type === String || typeOfType === "string" || type instanceof String:
            return {
              get: getter || function(){
                return this.getAttribute(name)
              },
              set: setter || function( value ){
                this.setAttribute(name, "" + value)
              }
            }
          case type === "number" || type === Number || typeOfType === "number" || type instanceof Number:
            return {
              get: getter || function(){
                return Number(this.getAttribute(name))
              },
              set: setter || function( value ){
                this.setAttribute(name, value)
              }
            }
          case type === "boolean" || type === Boolean || typeOfType === "boolean" || type instanceof Boolean:
            return {
              get: getter || function(){
                return this.hasAttribute(name)
              },
              set: setter || function( value ){
                if( !!value ) this.setAttribute(name, "")
                else this.removeAttribute(name)
              }
            }
          case type === "object" || type === Object || typeOfType === "object" || type instanceof Object:
            return {
              get: getter || function(){
                try{
                  return JSON.parse(this.getAttribute(name))
                }
                catch( e ){
                  return null
                }
              },
              set: setter || function( value ){
                this.setAttribute(name, JSON.stringify(value))
              }
            }
          case type == "function" || type === Function || typeOfType == "function" || type instanceof Function:
          default:
            return {
              get: getter || function(){
                return this.getAttribute(name)
              },
              set: setter || function( value ){
                this.setAttribute(name, value)
              }
            }
        }
      }

      function createValidator( values ){
        switch( true ){
          case Array.isArray(values):
            return function( value ){
              return !!~values.indexOf(value)
            }
            break
          case typeof values === "function":
            return values
            break
        }
      }
    }, {}
  ], 7: [
    function( require, module, exports ){
      /**
       * Attach a getter to the proto object
       * that proxies a querySelector call.
       *
       * @example
       *
       * elements: {
 *  descriptionElement: ".description"
 * }
       *
       * // later..
       *
       * var customElement = document.createElement("some-thing")
       * customElement.descriptionElement.textContent = "hello"
       *
       * */
      module.exports = function defineElements( proto, elements ){
        var def
        for( var name in elements ){
          if( elements.hasOwnProperty(name) ){
            def = elements[name]
            proto[name] = defineElement(def)
          }
        }
      }

      function defineElement( selector ){
        return {
          get: function(){
            return this.querySelector(selector)
          }
        }
      }
    }, {}
  ], 8: [
    function( require, module, exports ){
      /**
       * Registers an event listener on an element
       * and returns a delegator.
       * A delegated event runs matches to find an event target,
       * then executes the handler paired with the matcher.
       * Matchers can check if an event target matches a given selector,
       * or see if an of its parents do.
       * */
      module.exports = function delegate( options ){
        var element = options.element
          , event = options.event
          , capture = !!options.capture || false
          , context = options.context || element

        if( !element ){
          console.log("Can't delegate undefined element")
          return null
        }
        if( !event ){
          console.log("Can't delegate undefined event")
          return null
        }

        var delegator = createDelegator(context)
        element.addEventListener(event, delegator, capture)

        return delegator
      }

      /**
       * Returns a delegator that can be used as an event listener.
       * The delegator has static methods which can be used to register handlers.
       * */
      function createDelegator( context ){
        var matchers = []

        function delegator( e ){
          var l = matchers.length
          if( !l ){
            return true
          }

          var el = this
            , i = -1
            , handler
            , selector
            , findTarget
            , delegateElement
            , stopPropagation
            , args

          while( ++i < l ){
            args = matchers[i]
            handler = args[0]
            selector = args[1]
            findTarget = args[2]

            delegateElement = findTarget(selector, el, e)
            if( delegateElement ){
              stopPropagation = false === handler.call(context, e, delegateElement)
              if( stopPropagation ){
                return false
              }
            }
          }

          return true
        }

        /**
         * Registers a handler with a target matcher logic
         * */
        delegator.target = function( condition, handler ){
          matchers.push([handler, condition, targetMatchesSelector])
          return delegator
        }
        /**
         * Registers a handler with a target finder logic
         * */
        delegator.contains = function( selector, handler ){
          matchers.push([handler, selector, findParent])
          return delegator
        }

        return delegator
      }

      /**
       * Check if the target matches a selector
       * */
      function targetMatchesSelector( selector, el, e ){
        switch( typeof selector ){
          case "string":
            return e.target.matches(selector) ? e.target : false
            break
          case "function":
            return selector.call(el, e.target) ? e.target : false
            break
          default:
            return false
        }
      }

      /**
       * Check if the target or any of its parent matches a selector
       * */
      function findParent( selector, el, e ){
        var target = e.target
        switch( typeof selector ){
          case "string":
            while( target && target != el ){
              if( target.matches(selector) ) return target
              target = target.parentNode
            }
            break
          case "function":
            while( target && target != el ){
              if( selector.call(el, target) ) return target
              target = target.parentNode
            }
            break
          default:
            return null
        }
        return null
      }
    }, {}
  ], 9: [
    function( require, module, exports ){
      module.exports = function fragment( html, renderFragment ){
        return function(){
          var temp = window.document.createElement("div")
          temp.innerHTML = renderFragment ? renderFragment(html) : html
          var fragment = window.document.createDocumentFragment()
          while( temp.childNodes.length ){
            fragment.appendChild(temp.firstChild)
          }
          return fragment
        }
      }

    }, {}
  ], 10: [
    function( require, module, exports ){
      var createPrototype = require("./createPrototype")
      var createAttributes = require("./createAttributes")
      var createDispatcher = require("./createDispatcher")
      var createFragments = require("./createFragments")
      var defineElements = require("./defineElements")

      function createDefaultAttributeSetter( defaultAttributeValues ){
        return function(){
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
        var base = definition.inherit
          ? definition.inherit.prototype || definition.inherit
          : window.HTMLElement.prototype
        delete definition.inherit

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

        var onChangeCallbacks = {}
        var defaultAttributeValues = {}
        createAttributes(proto, attributes, onChangeCallbacks, defaultAttributeValues)
        /** Create a function that handles onAttributeChangeCallbacks defined in attribute definitions */
        var handleAttributeChange = createAttributeChangedCallback(onChangeCallbacks)
        /** Create a function that resets attributes on an element according to attribute definitions */
        var setDefaultAttributeValues = createDefaultAttributeSetter(defaultAttributeValues)

        defineElements(proto, elements)

        proto.dispatch = createDispatcher(events)
        proto.fragment = createFragments(fragments, renderFragment)

        // proxy the render function so it always returns `this`
        proto.render = function(){
          renderFn && renderFn.apply(this, arguments)
          return this
        }

        var createdCallback = definition.createdCallback
        proto.createdCallback = function(){
          // reset attribute values according to attribute definitions
          setDefaultAttributeValues.call(this)
          // call the createdCallback for this element if it's defined
          if( typeof createdCallback == "function" ){
            createdCallback.call(this)
          }
        }
        var attributeChangedCallback = definition.attributeChangedCallback
        proto.attributeChangedCallback = function( name, previousValue, value ){
          // call the handlers from the attribute definitions first
          handleAttributeChange.apply(this, arguments)
          // then let the general default handler run if it's defined
          if( typeof attributeChangedCallback == "function" ){
            attributeChangedCallback.apply(this, arguments)
          }
        }

        proto = createPrototype(proto)
        proto = Object.create(base, proto)

        // it's important that `extends` is not on the object even if it's undefined
        var elementDef = is ? {'extends': is, prototype: proto} : {prototype: proto}
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
        widgets[name] = Constructor

        return Constructor
      }

      module.exports.render = function( name ){
        if( !widgets[name] ){
          console.error("Unregistered element:", name)
          return null
        }
        return widgets[name].render.apply(null, [].slice.call(arguments, 1))
      }
    }, {
      "./createAttributes": 2,
      "./createDispatcher": 3,
      "./createFragments": 4,
      "./createPrototype": 5,
      "./defineElements": 7
    }
  ]
}, {}, [1]);
