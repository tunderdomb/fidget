var defineAttribute = require("./defineAttribute")

module.exports = function createAttributes( proto, attributes ){
  var def
  var onChangeCallbacks = {}
  for( var name in attributes ){
    if( attributes.hasOwnProperty(name) ){
      def = attributes[name]
      proto[name] = defineAttribute(name, def)
      if( typeof def.onchange == "function" ){
        onChangeCallbacks[name] = def.onchange
      }
    }
  }
  return function handleAttributeChange( name, previousValue, value ){
    var handler = onChangeCallbacks[name]
    if( !handler ) return
    handler.call(this, previousValue, value)
  }
}