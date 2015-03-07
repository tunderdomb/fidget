/**
 * Creates a property descriptor for an HTML attribute.
 * Registers a default value on the provided hash.
 * */
module.exports = function defineAttribute( name, def, attributeManager ){
  var typeOfDef = typeof def
  var type = def.type || def
  var typeOfType = typeof type
  var getter = def.get
  var setter = def.set
  var defaultValue = typeOfDef === typeOfType ? def : def.default

  if( attributeManager ){
    if( typeof def.onchange == "function" ){
      attributeManager.addOnChangedCallback(name, def.onchange)
    }
    if( typeof defaultValue != "undefined" ){
      attributeManager.addDefaultValue(name, defaultValue)
    }
  }

  switch( true ){
    case type === "string" || type === String:
      return {
        get: getter || function(  ){
          return this.getAttribute(name)
        },
        set: setter || function( value ){
          this.setAttribute(name, ""+value)
        }
      }
    case type === "number" || type === Number || typeOfType === "number" || type instanceof Number:
      return {
        get: getter || function(  ){
          return Number(this.getAttribute(name))
        },
        set: setter || function( value ){
          this.setAttribute(name, value)
        }
      }
    case type === "boolean" || type === Boolean || typeOfType === "boolean" || type instanceof Boolean:
      return {
        get: getter || function(  ){
          return this.hasAttribute(name)
        },
        set: setter || function( value ){
          if( !!value ) this.setAttribute(name, "")
          else this.removeAttribute(name)
        }
      }
    case type === "object" || type === Object || typeOfType === "object" || type instanceof Object:
      return {
        get: getter || function(  ){
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
      get: getter || function(  ){
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