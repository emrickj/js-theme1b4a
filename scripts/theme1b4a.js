var url = window.location.href;
var pos = url.search("p=[1-6]");
var xml, xml2, sf, oc, btn, btn2;
if (pos != -1) p = url.charAt(pos+2); else p = "1";
pos = url.search("w=[1-9]");
if (pos != -1) w = url.charAt(pos+2); else w = "1";

$(function(){
	$.ajax({
	type      : "GET",
	url       : "data/website.xml",
	dataType  : "xml",
	beforeSend: function(){
	    oc = $(".card-body").html();
	},
	success   : function(xmlData){
		xml=xmlData;
		var title = $("title",xml).text();
		pos=title.lastIndexOf("> ");
		if (pos != -1) title=title.substring(pos+2);
		pos=title.lastIndexOf(" <");
		if (pos != -1) title=title.substring(0,pos);
		$("title").text(title);
		title = $("title",xml).text();
		$(".navbar-brand").html(title);
		$("#title").find("center").html(title);
		var stl = $("style",xml).text();
		$("style").append(stl);
		var pn = "", pn2 = "";
		$("name:not(:empty)",xml).each(function(i,v){
		   pn += "<li class='nav-item'><a class='nav-link' href='javascript:render(" + (i+1) + ",1);'>"
		   + $(v).text() + "</a></li>";
		   pn2 += "<a href='javascript:render(" + (i+1) + ",1);' class='btn btn-outline-primary'>"
		   + $(v).text() + "</a>";
		});
		$(".navbar-nav").html(pn);
		$(".btn-group-vertical").prepend(pn2);
	},
	error     : function(){
		alert("Could not retrieve XML file.");
	},
	complete  : function(){
		loadAnotherFile();
	}
	 });
});

function loadAnotherFile() {
	$.ajax({
	type      : "GET",
	url       : "data/website2.xml",
	dataType  : "xml",
	success   : function(xmlData){
		xml2=xmlData;
		var title = $("title",xml2).text();
		$(".dropdown-toggle").prepend(title);
		var pn = "";
		$("name:not(:empty)",xml2).each(function(i,v){
		   pn += "<li><a class='dropdown-item' href='javascript:render(" + (i+1) + ",2);'>" 
		   + $(v).text() + "</a></li>";
		});
		$(".dropdown-menu").html(pn);
	},
	error     : function(){
		alert("Could not retrieve XML file.");
	},
	complete  : function(){
	    btn = $(".navbar-nav").html();
		btn2 = $(".btn-group-vertical").html();
		render(p,w);
	}
	 });
}

function render(pn, ws) {
    if (ws!=1) sf=xml2; else sf=xml;
    var cp = $("page:eq("+(pn-1)+")",sf);
	img=cp.find("image").text();
	cnt=cp.find("contents").text();
    while (cnt.includes('"?p=')) {
	   cnt=cnt.replace('"?p=1','"javascript:render(1,'+ws+');');
	   cnt=cnt.replace('"?p=2','"javascript:render(2,'+ws+');');
	   cnt=cnt.replace('"?p=3','"javascript:render(3,'+ws+');');
	   cnt=cnt.replace('"?p=4','"javascript:render(4,'+ws+');');
	   cnt=cnt.replace('"?p=5','"javascript:render(5,'+ws+');');
	   cnt=cnt.replace('"?p=6','"javascript:render(6,'+ws+');');
    }
	$(".card-img-top").attr("src",img);
	if (cp.attr("type")=="comments")
	   cnt = '<div id="HCB_comment_box" style="background-color: transparent;">' +
	   '<a href="https://www.htmlcommentbox.com">HTML Comment Box</a> is loading comments...</div>' +
	   '<link rel="stylesheet" type="text/css" href="https://www.htmlcommentbox.com/static/skins/default/skin.css" />' +
	   '\u003cscript type="text/javascript" language="javascript" id="hcb">' +
	   'if(!window.hcb_user){hcb_user={  };} (function(){s=document.createElement("script");s.setAttribute("type","text/javascript");s.setAttribute("src", "https://www.htmlcommentbox.com/jread?page="+escape((window.hcb_user && hcb_user.PAGE)||(""+window.location)).replace("+","%2B")+"&opts=470&num=10");' +
	   'if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})();\u003c/script>';
	$(".card-body").html(oc);
	if (cp.attr("type")=="form") $(".form-horizontal").show();
	$(".card-body").prepend(cnt);
	$(".navbar-nav").html(btn);
	$(".btn-group-vertical").html(btn2);
	if (ws==1) {
	   $(".navbar .nav-link:eq("+(pn-1)+")").addClass("active");
	   $(".btn-group-vertical .btn:eq("+(pn-1)+")").addClass("active");
	}
	if (ws==2)
       $(".dropdown-menu .dropdown-item:eq("+(pn-1)+")").addClass("active");	   
    $("a").each(function(){
	   var pn =$(this).text();
	   if (pn.charAt(1)==" ") $(this).html('<i class="fa">'+pn.charAt(0)+'</i>'+pn.substring(1));
	});
}
