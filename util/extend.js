module.exports = function extend( obj, extension ){
  for( var name in obj ){
    if( obj.hasOwnProperty(name) ) obj[name] = extension[name]
  }
  return obj
}