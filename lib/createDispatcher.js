module.exports = function createDispatcher( events ){
  if( !events ) return function(  ){
    return this
  }

  return function dispatch( name, arg1, arg2, arg3 ){
    var dispatcher = events[name]
    if( typeof dispatcher == "undefined" ){
      throw new Error("'"+name+"' is not a dispatcher")
    }
    if( typeof dispatcher !== "function" ){
      return this.dispatchEvent(new window.CustomEvent(name, {
        details: arg1|| {},
        'view': dispatcher.view || window,
        'bubbles': dispatcher.bubbles != undefined ? dispatcher.bubbles : true,
        'cancelable': dispatcher.cancelable != undefined ? dispatcher.cancelable : true
      }))
    }
    switch( arguments.length ){
      case 0:
        return dispatcher.call(this)
      case 1:
        return dispatcher.call(this, arg1)
      case 2:
        return dispatcher.call(this, arg1, arg2)
      case 3:
        return dispatcher.call(this, arg1, arg2, arg3)
      default :
        return dispatcher.apply(this, [].slice.call(arguments, 1))
    }
  }
}