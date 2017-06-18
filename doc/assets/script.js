
function resizeIframe(obj) {
  obj.style.height = window.innerHeight-55+'px';
  addClickEventListener();
}

function addClickEventListener(){
  var iframe= document.getElementById("apidociframe").contentDocument;
  var anchors = iframe.getElementsByTagName("a");
  if(anchors == null || anchors.length==0)
    setTimeout(function(){    
      addClickEventListener();
    },50)
  else
    for(var i=0; i<anchors.length; i++)
      if(getHrefHashValue(anchors[i].href) != null)
        anchors[i].addEventListener("click", function(e){
          window.location.hash = e.target.hash;
        });         
}

function getHrefHashValue(href){
  if(href != null){
    href = href.split('#');
    if(href.length>0 && href[href.length-1].startsWith('api'))
      return href[href.length-1];
  }
  return null;
}
