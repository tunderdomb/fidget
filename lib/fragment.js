module.exports = function fragment( html ){
  var temp = document.createElement("div")
  temp.innerHTML = html
  var fragment = document.createDocumentFragment()
  while( temp.childNodes.length ){
    fragment.appendChild(temp.firstChild)
  }
  return fragment
}