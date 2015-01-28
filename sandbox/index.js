var fidget = require("../index")

fidget.register("custom-element", function( def ){

})

var customElement = fidget.register("custom-element")
  .is("input")
  .inherit(HTMLInputElement)
  .proto({
    createdCallback: {value: function(){}},
    attachedCallback: {value: function(){}},
    detachedCallback: {value: function(){}},
    attributeChangedCallback: {value: function( name, previousValue, value ){}}
  })

  .onCreated(function(){

  })
  .onAttached(function(){

  })
  .onDetached(function(){

  })
  .onAttributeChanged(function(){

  })
  .onInitialized(function(){

  })
  .attribute("name", {
    get: function(){

    },
    set: function(){

    }
  })
  .attribute("name", null, function get(){

  }, function set(){

  })
  .static("stat", [])
  .static({})

customElement(1, "...")
customElement.Constructor
customElement.stat