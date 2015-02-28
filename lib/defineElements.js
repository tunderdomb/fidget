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
      def = defineElement(elements[name])
      if( def ){
        proto[name] = def
      }
    }
  }
}

function defineElement( selector ){
  switch( typeof selector ){
    case "function":
      return {
        get: selector
      }
    case "string":
      return {
        get: function(){
          return this.querySelector(selector)
        }
      }
  }
}