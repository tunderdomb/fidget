module.exports = createDispatcher

function createDispatcher( events ){
  if( !events ) return function(  ){
    return this
  }
  return function dispatch( name, arg1, arg2, arg3 ){
    if( typeof events[name] !== "function" ){
      throw new Error("'"+name+"' is not a dispatcher")
    }
    switch( true ){
      case arguments.length === 0:
        return events[name].call(this)
        break
      case arguments.length === 1:
        return events[name].call(this, arg1)
        break
      case arguments.length === 2:
        return events[name].call(this, arg1, arg2)
        break
      case arguments.length === 3:
        return events[name].call(this, arg1, arg2, arg3)
        break
      default :
        return events[name].apply(this, [].slice.call(arguments, 1))
        break
    }
  }
}