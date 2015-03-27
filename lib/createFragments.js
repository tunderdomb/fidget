var fragment = require("./fragment")

module.exports = function createFragments( fragments, renderFragment ){
  for( var name in fragments ){
    if( fragments.hasOwnProperty(name) ){
      fragments[name] = fragment(fragments[name], renderFragment)
    }
  }

  return function( name, templateData ){
    var template = fragments[name]
    if( !template ) {
      console.warn("Unknown fragment", name)
      return null
    }
    return template(templateData)
  }
}