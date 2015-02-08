var defineAttribute = require("./defineAttribute")

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