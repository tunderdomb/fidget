var SELECT = 1
var TARGET = 2

module.exports = function delegate( element, event, capture ){
  var handlers = []

  if( element && event ){
    element.addEventListener(event, delegator, !!capture||false)
  }

  function delegator( e ){
    var el = this
      , i = -1
      , l = handlers.length
      , args
    while( ++i < l ){
      args = handlers[i]
      var handler = args[0]
        , selector = args[1]
        , mode = args[2]
        , matches
        , handleNext

      if( !mode ) return

      switch( mode ){
        case SELECT:
          matches = delegateSelector(selector, el, e)
          if( matches ) handleNext = handler.call(el, e)
          break
        case TARGET:
          matches = delegateTarget(selector, el, e)
          if( matches ) handleNext = handler.call(el, e, matches)
          break
      }

      if( matches && handleNext === false ) {
        return handleNext
      }
    }
  }

  delegator.target = function( selector, handler ){
    handlers.push([handler, selector, TARGET])
    return delegator
  }
  delegator.matches = function( condition, handler ){
    handlers.push([handler, condition, SELECT])
  }
  return delegator
}

function delegateSelector( selector, el, e ){
  switch( typeof selector ){
    case "string":
      return e.target.matches(selector)
      break
    case "function":
      return selector(el, e.target)
      break
    default:
      return false
  }
}

function delegateTarget( selector, el, e ){
  var target = e.target
  switch( typeof selector ){
    case "string":
      while( target && target != el ){
        if( target.matches(selector) ) return target
        target = target.parentNode
      }
      break
    case "function":
      while( target && target != el ){
        if( selector(target) ) return target
        target = target.parentNode
      }
      break
    default:
      return null
  }
  return null
}