module.exports = fragment

function fragment( html, renderFn ){
  return function( templateData ){
    var temp = window.document.createElement("div")
    temp.innerHTML = renderFn ? renderFn(html, templateData) : html
    var fragment = window.document.createDocumentFragment()
    while( temp.childNodes.length ){
      fragment.appendChild(temp.firstChild)
    }
    return fragment
  }
}
fragment.render = function( html, templateData ){
  return fragment(html)(templateData)
}