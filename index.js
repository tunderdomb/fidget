var register = require("./lib/register")
var delegate = require("./lib/delegate")
var fragment = require("./lib/fragment")

var fidget = {}
fidget.register = register
fidget.delegate = delegate
fidget.fragment = fragment

module.exports = fidget

// we're browserified
if( typeof global != "undefined" && typeof window != "undefined" && global == window){
  // set a global reference for dist scripts
  window.fidget = fidget
}