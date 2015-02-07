var register = require("./lib/register")
var delegate = require("./lib/delegate")
var fragment = require("./lib/fragment")

var fidget = {}

fidget.register = register
fidget.delegate = delegate
fidget.fragment = fragment

module.exports = fidget
global.fidget = fidget
