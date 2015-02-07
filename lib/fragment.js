module.exports = function fragment( html ){
  var temp = window.document.createElement("div")
  temp.innerHTML = html
  var fragment = window.document.createDocumentFragment()
  while( temp.childNodes.length ){
    fragment.appendChild(temp.firstChild)
  }
  return fragment
}