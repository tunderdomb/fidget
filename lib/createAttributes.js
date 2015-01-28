var defineAttribute = require("./defineAttribute")

module.exports = function( proto, attributes ){
  for( var name in attributes ){
    if( attributes.hasOwnProperty(name) ){
      proto[name] = defineAttribute(name, attributes[name])
    }
  }
}