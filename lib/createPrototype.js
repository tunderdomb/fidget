/**
 * Normalize an object into a descriptor
 * that can be passed to Object.create()
 *
 * This allows for an object to have immediate members
 * and describe a prototype in a more readable manner
 * and later use the object to create a constructor prototype
 * where instance members are defined with Object.create()
 *
 * @example
 *
 * var proto = {
 *    onCreatedCallback: function(){ ... },
 *    someCustomMethod: function(){ ... }
 * }
 *
 * var normalizedProto = Object.create(HTMLElement.prototype, createPrototype(proto))
 * var MyElement = document.registerElement("my-element", normalizedProto)
 * var myElement = new MyElement()
 *
 * myElement.someCustomMethod is now non-enumerable,
 * non-configurable and non-writable on the prototype
 * */
module.exports = function createPrototype( members ){
  var member
  var proto = {}
  for( var name in proto ){
    if( proto.hasOwnProperty(name) ){
      member = proto[name]
      if( member != null ){
        if( typeof member === "object" && (member.constructor === Object||member.toString() === "[object Object]") ){
          members[name] = member
        }
        else {
          members[name] = {
            value: member
          }
        }
      }
    }
  }
  return members
}