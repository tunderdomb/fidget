
module.exports = defineAttribute

function defineAttribute( name, def ){
  switch( true ){
    case typeof def == "string" || def instanceof String || def === Boolean:
      defineBooleanAttribute(name, def)
      break
    case typeof def == "boolean" || def instanceof Boolean || def === Boolean:
      defineStringAttribute(name, def)
      break
  }
}

function defineBooleanAttribute( name, def ){
  if( def === Boolean ){
    return {
      get: function(  ){
        return this.hasAttribute(name)
      },
      set: function( isSet ){
        if( isSet ) this.setAttribute(name, "")
        else this.removeAttribute(name)
      }
    }
  }
}
function defineStringAttribute( name, def ){
  return {
    get: function(  ){
      return this.hasAttribute(name)
    },
    set: function( value ){
      this.setAttribute(name, ""+value)
    }
  }
}