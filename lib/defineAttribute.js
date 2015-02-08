module.exports = function defineAttribute( name, def, defaultAttributeValues ){
  var type = def.type || def
  var typeOfType = typeof type
  var getter = def.get
  var setter = def.set
  var defaultValue = def.default

  if( typeof defaultValue != "undefined" ){
    defaultAttributeValues[name] =  defaultValue
  }

  switch( true ){
    case type === "string" || type === String || typeOfType === "string" || type instanceof String:
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