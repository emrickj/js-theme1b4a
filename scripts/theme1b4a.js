var url = window.location.href;
var pos = url.search("p=[1-6]");
var dom = [], oc, btn, btn2;
if (pos != -1) p = url.charAt(pos+2); else p = "1";
pos = url.search("w=[1-9]");
if (pos != -1) w = url.charAt(pos+2); else w = "1";
loadFile("data/website.xml",ml_display);

function loadFile(url,cFunction) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) cFunction(this);
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function ml_display(xhttp) {
	dom.push(xhttp.responseXML);
	var x = dom[0].getElementsByTagName("title")[0].childNodes[0];
	if (x) var title = x.nodeValue; else title = "";
	pos=title.lastIndexOf("> ");
	if (pos != -1) title=title.substring(pos+2);
	pos=title.lastIndexOf(" <");
	if (pos != -1) title=title.substring(0,pos);
	document.getElementsByTagName("title")[0].innerText=title;
	if (x) title = x.nodeValue; else title = "";
	document.getElementById("nbtitle").innerHTML=title;
	document.getElementById("title").innerHTML = "<b><h2><center>" + title + "</center></h2></b>";
	var x = dom[0].getElementsByTagName("style")[0].childNodes[0];
	if (x) var stl = x.nodeValue; else stl = "";
	var ist = document.getElementsByTagName("style")[0].innerText;
	document.getElementsByTagName("style")[0].innerText = ist + stl;
	var pn = "", pn2 = "";
	//var pnames = dom[0].evaluate("/website/page/name[.!='']", dom[0], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
  var pnames = dom[0].querySelectorAll("name:not(:empty)");
	for ( var i=0 ; i < pnames.length; i++ ) {
	   pn += "<li class='nav-item'><a class='nav-link' href='javascript:render(" + (i+1) + ",1);'>"
	   + pnames[i].textContent + "</a></li>";
	   pn2 += "<a href='javascript:render(" + (i+1) + ",1);' class='btn btn-outline-primary'>"
	   + pnames[i].textContent + "</a>";
	}
	document.getElementById("myNavbar").firstElementChild.innerHTML = pn;
	document.getElementById("btngrp").insertAdjacentHTML("afterbegin",pn2);
	loadFile("data/website2.xml",dd_display);
}

function dd_display(xhttp) {
	dom.push(xhttp.responseXML);
	var x = dom[1].getElementsByTagName("title")[0].childNodes[0];
	var title = x.nodeValue;
	document.getElementById("btngrp").lastElementChild.insertAdjacentHTML("afterbegin",title);
	var pn = "";
	//var pnames = dom[1].evaluate("/website/page/name[.!='']", dom[1], null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	var pnames = dom[1].querySelectorAll("name:not(:empty)");
	for ( var i=0 ; i < pnames.length; i++ ) {
	   pn += "<li><a class='dropdown-item' href='javascript:render(" + (i+1) + ",2);'>" 
	   + pnames[i].textContent + "</a></li>";
	}
	document.getElementById("ddmenu").innerHTML = pn;
	btn = document.getElementById("myNavbar").firstElementChild.innerHTML;
	btn2 = document.getElementById("btngrp").innerHTML;
	render(p,w);
}

function render(pn, ws) {
  //var cp = dom[ws-1].querySelector("page:nth-of-type("+pn+")");
  var cp = dom[ws-1].getElementsByTagName("page")[pn-1];
	var img = cp.querySelector("image").textContent;
	var cnt = cp.querySelector("contents").textContent;
  while (cnt.indexOf('"?p=')!=-1) {
	   cnt=cnt.replace('"?p=1','"javascript:render(1,'+ws+');');
	   cnt=cnt.replace('"?p=2','"javascript:render(2,'+ws+');');
	   cnt=cnt.replace('"?p=3','"javascript:render(3,'+ws+');');
	   cnt=cnt.replace('"?p=4','"javascript:render(4,'+ws+');');
	   cnt=cnt.replace('"?p=5','"javascript:render(5,'+ws+');');
	   cnt=cnt.replace('"?p=6','"javascript:render(6,'+ws+');');
  }
	document.getElementById("pimage").setAttribute("src", img);
	if (img.length > 4)
	  document.getElementById("pimage").style.display = "block";
	else document.getElementById("pimage").style.display = "none";
	document.getElementById("pbody").innerHTML = cnt;
  var attr = cp.attributes.getNamedItem("type").textContent;
	if (attr=="form")
		document.getElementById("ctform").style.display = "block";
	else document.getElementById("ctform").style.display = "none";
	if (attr=="comments") 
		document.getElementById("pcmts").style.display = "block";
	else document.getElementById("pcmts").style.display = "none";
	document.getElementById("myNavbar").firstElementChild.innerHTML = btn;
	document.getElementById("btngrp").innerHTML = btn2;
	if (ws==1) {
	   var x = document.getElementById("myNavbar");
	   x.getElementsByTagName("a")[pn-1].className += " active";
	   x = document.getElementById("btngrp");
	   x.getElementsByTagName("a")[pn-1].className += " active";
	}
	if (ws==2) {
	   var x = document.getElementById("ddmenu");
	   x.getElementsByTagName("a")[pn-1].className += " active";
	}
	var nl = document.getElementsByTagName("a").length;
	for (var i=0;i<nl;i++) {
	   var pn = document.getElementsByTagName("a")[i].innerText;
	   if (pn.charAt(1)==" ") document.getElementsByTagName("a")[i].innerHTML = '<i class="fa">'+pn.charAt(0)+'</i>'+pn.substring(1);
	}
}
