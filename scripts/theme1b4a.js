var url = window.location.href;
var pos = url.search("p=[1-6]");
var p, w, sf;
if (pos != -1) p = url.charAt(pos+2); else p = "1";
pos = url.search("w=[1-9]");
if (pos != -1) w = url.charAt(pos+2); else w = "1";
//alert("p="+p+" w="+w);

$.ajax({
type     : "GET",
url      : "data/website.xml",
dataType : "xml",
success  : function(xml){
	var title = $("title",xml).text();
	pos=title.lastIndexOf("> ");
	if (pos != -1) title=title.substring(pos+2);
	pos=title.lastIndexOf(" <");
	if (pos != -1) title=title.substring(0,pos);
	$("title").text(title);
	title = $("title",xml).text();
	$(".navbar-brand").html(title);
	$("#title").find("center").html(title);
	$("#title").show();
	var pn = "", pn2 = "";
	$("name:not(:empty)",xml).each(function(i,v){
	   pn += "<li class='nav-item'><a class='nav-link' href='?p=" + (i+1) + "'>"
	   + $(v).text() + "</a></li>";
	   pn2 += "<a href='?p=" + (i+1) + "' class='btn btn-outline-primary'>"
	   + $(v).text() + "</a>";
	});
	$(".navbar-nav").html(pn);
	$(".btn-group-vertical").prepend(pn2);
	$(".btn-group-vertical").show();
	if (w=="1") sf=xml;
},
error    : function(){
	alert("Could not retrieve XML file.");
}
 });
 
$.ajax({
type     : "GET",
url      : "data/website2.xml",
dataType : "xml",
success  : function(xml){
	var pn = "";
	$("name:not(:empty)",xml).each(function(i,v){
	   pn += "<li><a class='dropdown-item' href='?w=2&p=" + (i+1) + "'>" 
	   + $(v).text() + "</a></li>";
	});
	$(".dropdown-menu").html(pn);
	if (w=="2") sf=xml;
},
error    : function(){
	alert("Could not retrieve XML file.");
},
complete : function(){
    render();
}
 });

function render() {
    var cp = $("page:eq("+(p-1)+")",sf);
	img=cp.find("image").text();
	cnt=cp.find("contents").text();
	if (w > 1)
	   while (cnt.includes('"?p='))
	      cnt=cnt.replace('"?p=','"?w='+w+'&p=');
	$(".card").prepend("<img class='card-img-top' src='"+img+"'>");
	if (cp.attr("type")=="form") $(".form-horizontal").show();
	if (cp.attr("type")=="comments")
	   cnt = '<div id="HCB_comment_box" style="background-color: transparent;">' +
	   '<a href="https://www.htmlcommentbox.com">HTML Comment Box</a> is loading comments...</div>' +
	   '<link rel="stylesheet" type="text/css" href="https://www.htmlcommentbox.com/static/skins/default/skin.css" />' +
	   '\u003cscript type="text/javascript" language="javascript" id="hcb">' +
	   'if(!window.hcb_user){hcb_user={  };} (function(){s=document.createElement("script");s.setAttribute("type","text/javascript");s.setAttribute("src", "https://www.htmlcommentbox.com/jread?page="+escape((window.hcb_user && hcb_user.PAGE)||(""+window.location)).replace("+","%2B")+"&opts=470&num=10");' +
	   'if (typeof s!="undefined") document.getElementsByTagName("head")[0].appendChild(s);})();\u003c/script>';
	$(".card-body").prepend(cnt);
	if (w=="1") {
	   $(".navbar .nav-link:eq("+(p-1)+")").addClass("active");
	   $(".btn-group-vertical .btn:eq("+(p-1)+")").addClass("active");
	}
	if (w=="2")
       $(".dropdown-menu .dropdown-item:eq("+(p-1)+")").addClass("active");	   
    $("a").each(function(){
	   var pn =$(this).text();
	   if (pn.charAt(1)==" ") $(this).html('<i class="fa">'+pn.charAt(0)+'</i>'+pn.substring(1));
	});
}
