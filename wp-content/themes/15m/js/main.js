//a ver que tal se me da...
//jQueryficamos



$(function(){

//Menu fade effect
$("li.icon").on("click", function(ev){
	//los hermanos del icono se muestran y esconden en toggle
	$(ev.target).siblings().fadeToggle(300, function(w){
		window.setTimeout(function(w){
			$(w).fadeOut();
		}, 3000);
	});
});



//Accordion effect en el filtro de categorías
//declaro elementos
var button = $("#post.filter ul li:nth-child(1)");
var button_row = $("#post.filter ul li:nth-child(1):after");
var cats = $("#post.filter ul.subcat-list");
var gradient = $("#post.filter #pocket");


//para checkear si está abierto o no
button.data("open", false);

//evento condicionado
button.on("click", function(e) {
	
	if($(e.target).data("open") == false) {
		cats.slideDown(200);
		$(e.target).data("open", true);
		
		//animar background pocket
		
		gradient.delay(200).css({
							"background": "linear-gradient(to top, #B0B0B0 90%, #EFEFEF 100%) no-repeat scroll 20% 362px transparent",
							"background-attatchment": "bottom"
						});
		
	} else {
		cats.slideUp(200);
		$(e.target).data("open", false);
		
		//animar background pocket
		
		gradient.delay(400).css({
							"background": "none",
							"background-attatchment": "bottom"
						});
	}

})
	

//isotope effect para filtrar los resultados
//posteriormente en JSNativo
var filters = ["post","asamblea", "gtrabajo", "mani", "comunicados"] //filtros según categorías
var container = $("#container");
var show_class = "show";
var hide_class = "hide";

$("#pocket ul").children().each(function(id, el){
	//un poco de aritmética cutre para que filters coincida y 
	if (id < filters.length + 1) {
		if (id < 1) {
			$(el).data("filter", filters[id]);
		} else if (id > 1) {
			$(el).data("filter", filters[id - 1]);
		}
	}
});


$("#pocket ul").children().each(function(id, el){
	$(this).on("click", function(ev){
		var selector = $(this).data("filter"); //obj con microdatas
		var elements = $("section#post").each(function(id,el) {
			if($(el).hasClass(selector)) {	
				$(el).removeClass(hide_class)
					 .on("animationend", function () {
					 	console.log("dale");
					 	$(this).addClass(show_class);
					 });
					 
			} else {
				$(el).removeClass(show_class)
					 .on("animationend", function(){
					 	console.log("primo");
					 	$(el).addClass(hide_class);
					 });			 
			}
		});
		console.log(selector);
		return false;
	});
});

//reset filtro (posteriormente show button animado)
$("#post.filter h2").on("click", function(){
	$("section#post").each(function(){
		$(this).removeClass(hide_class);
		if(!$(this).hasClass(show_class)) {
			$(this).addClass(show_class);
		}
	});
});







var shares = {
	actualURL: document.URL,
	share_title: document.getElementById("share_title"),
	post_title: share_title.innerHTML,
	
	facebook: function () {
		var URL = "http://www.facebook.com/sharer.php?u=" + this.actualURL + "&t=" + this.post_title;
		return URL;
	}, 
	
	proof: function () {
		console.table ({a:[this.actualURL, this.share_title, this.post_title], b:[this.facebook()]});
	}
}.proof();



});//fin de jQuery



