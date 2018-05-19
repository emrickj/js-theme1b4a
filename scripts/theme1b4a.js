var url = window.location.href;
var pos = url.search("p=[1-6]");
var xml, xml2, sf, oc, btn, btn2;
if (pos != -1) p = url.charAt(pos+2); else p = "1";
pos = url.search("w=[1-9]");
if (pos != -1) w = url.charAt(pos+2); else w = "1";

function loadFile(url,cFunction) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) cFunction(this);
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

function ml_display(xhttp) {
	xml = xhttp.responseXML;
	var x = xml.getElementsByTagName("title")[0].childNodes[0];
	if (x) var title = x.nodeValue; else title = "";
	pos=title.lastIndexOf("> ");
	if (pos != -1) title=title.substring(pos+2);
	pos=title.lastIndexOf(" <");
	if (pos != -1) title=title.substring(0,pos);
	document.getElementsByTagName("title")[0].innerText=title;
	if (x) title = x.nodeValue; else title = "";
	document.getElementById("nbtitle").innerHTML=title;
	document.getElementById("title").innerHTML = "<b><h2><center>" + title + "</center></h2></b>";
	var x = xml.getElementsByTagName("style")[0].childNodes[0];
	if (x) var stl = x.nodeValue; else stl = "";
	var ist = document.getElementsByTagName("style")[0].innerText;
	document.getElementsByTagName("style")[0].innerText = ist + stl;
	var pn = "", pn2 = "";
	var pnames = xml.evaluate("/website/page/name[.!='']", xml, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	for ( var i=0 ; i < pnames.snapshotLength; i++ ) {
	   pn += "<li class='nav-item'><a class='nav-link' href='javascript:render(" + (i+1) + ",1);'>"
	   + pnames.snapshotItem(i).textContent + "</a></li>";
	   pn2 += "<a href='javascript:render(" + (i+1) + ",1);' class='btn btn-outline-primary'>"
	   + pnames.snapshotItem(i).textContent + "</a>";
	}
	document.getElementById("myNavbar").firstElementChild.innerHTML = pn;
	document.getElementById("btngrp").insertAdjacentHTML("afterbegin",pn2);
	loadFile("data/website2.xml",dd_display);
}

function dd_display(xhttp) {
	xml2 = xhttp.responseXML;
	var x = xml2.getElementsByTagName("title")[0].childNodes[0];
	var title = x.nodeValue;
	document.getElementById("btngrp").lastElementChild.insertAdjacentHTML("afterbegin",title);
	var pn = "";
	var pnames = xml2.evaluate("/website/page/name[.!='']", xml2, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
	for ( var i=0 ; i < pnames.snapshotLength; i++ ) {
	   pn += "<li><a class='dropdown-item' href='javascript:render(" + (i+1) + ",2);'>" 
	   + pnames.snapshotItem(i).textContent + "</a></li>";
	}
	document.getElementById("ddmenu").innerHTML = pn;
	btn = document.getElementById("myNavbar").firstElementChild.innerHTML;
	btn2 = document.getElementById("btngrp").innerHTML;
	render(p,w);
}

function render(pn, ws) {
    if (ws!=1) sf=xml2; else sf=xml;
	var img = sf.evaluate('/website/page['+pn+']/image', sf, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
	var contents = sf.evaluate('/website/page['+pn+']/contents', sf, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
	var cnt = contents.singleNodeValue.textContent;
    while (cnt.includes('"?p=')) {
	   cnt=cnt.replace('"?p=1','"javascript:render(1,'+ws+');');
	   cnt=cnt.replace('"?p=2','"javascript:render(2,'+ws+');');
	   cnt=cnt.replace('"?p=3','"javascript:render(3,'+ws+');');
	   cnt=cnt.replace('"?p=4','"javascript:render(4,'+ws+');');
	   cnt=cnt.replace('"?p=5','"javascript:render(5,'+ws+');');
	   cnt=cnt.replace('"?p=6','"javascript:render(6,'+ws+');');
    }
	document.getElementById("pimage").setAttribute("src", img.singleNodeValue.textContent);
	var attr = sf.evaluate('/website/page['+pn+']/@type', sf, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null );
	document.getElementById("pbody").innerHTML = cnt;
	if (attr.singleNodeValue.textContent=="form")
		document.getElementById("ctform").style.display = "block";
	else document.getElementById("ctform").style.display = "none";
	if (attr.singleNodeValue.textContent=="comments") 
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
