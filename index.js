module.exports.register = require("./lib/register")
module.exports.delegate = require("./lib/delegate")
module.exports.fragment = require("./lib/fragment")

// we're browserified
if( typeof global != "undefined" && typeof window != "undefined" && global == window){
  // set a global reference for dist scripts
  window.fidget = module.exports
}