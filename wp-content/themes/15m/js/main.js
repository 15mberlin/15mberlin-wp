//a ver que tal se me da...
//jQueryficamos

//Menu fade effect
$(function(){

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
	
});

















