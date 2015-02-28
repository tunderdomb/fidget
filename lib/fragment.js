module.exports = function fragment( html, renderFragment ){
  return function(  ){
    var temp = window.document.createElement("div")
    temp.innerHTML = renderFragment ? renderFragment(html) : html
    var fragment = window.document.createDocumentFragment()
    while( temp.childNodes.length ){
      fragment.appendChild(temp.firstChild)
    }
    return fragment
  }
}
