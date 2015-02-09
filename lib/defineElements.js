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
    get: function(  ){
      return this.querySelector(selector)
    }
  }
}