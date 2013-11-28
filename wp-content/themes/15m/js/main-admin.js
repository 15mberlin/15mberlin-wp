//admin functions
window.onload = function () {
	//truco hacky para convertir el check de las categorias en radio buttons...
	checkToRadio();
	hideBox();
	
	var mapaBox = document.getElementById("map-canvas-asamblea");
	//===== BACK END =====
	//mirar si hay mapa
	if (mapaBox) {
		
		//console.log(mapaBox.length);
		
		//centrar mapa según back end - procesa entrada
		var mapData = document.getElementById("map-canvas-asamblea").getAttribute("data-map");
		var numStart = mapData.indexOf("ll=") + 3; //+4 para que coja lo que viene despues...
		var numEnd = mapData.indexOf("&spn"); // +0 para que se quede donde esta
		
		mapData = mapData.substring(numStart, numEnd); //tomamos los datos que nos importan
		
		mapData = String.split(mapData,",");
		for (var i = 0; i < mapData.length; i++) {
			mapData[i] = parseFloat (mapData[i]);
		}
	
		//inicializar mapa según datos backend
		var map = maps_init(mapData);
		
		//modifica campo lugar al draggear el mapa, para hacer entrada dinámica
		google.maps.event.addListener(map, "dragend", function () {
		
			var campo = document.getElementById("asamblea-mapa").value;
			var campoStart = campo.indexOf("ll=") + 3;
			var campoEnd = campo.indexOf("&spn");	
			
			var x = this.getCenter().ob;
			var y = this.getCenter().pb;
			var stringPlace = x + ", " + y;
			
			campo = campo.replace(campo.substring(numStart, numEnd), stringPlace);
			document.getElementById("asamblea-mapa").value = campo;
			
			//guardar datos en database
			document.getElementById("asamblea-mapa-x").value = x;
			document.getElementById("asamblea-mapa-y").value = y;
	
		});
	}
}

//function del API del google maps
var maps_init = function (data) {
  var types = ["asamblea", "gtrabajo", "mani"];
  var myLatlng = new google.maps.LatLng(data[0], data[1]);
  var mapOptions = {
    zoom: 16,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl : false,
    noClear: true
  };
  
  var name = [];
  for (var i = 0; i < types.length; i++) {
	var name = "map-canvas-" + types[i];  
  	var map = new google.maps.Map(document.getElementById(name), mapOptions); 	
  }
  
  var marker = new google.maps.Marker({
      position: myLatlng,
      map: map,
      title: 'Asamblea aquí!'
  });
  return map;
};

var checkToRadio = function () {
	var checkbox = document.querySelectorAll("[id^='in-category-'][type = 'checkbox']");
	for (var i = 0; i < checkbox.length; i++) {
		checkbox[i].type = "radio";
	}
};

var hideBox = function () {
		var checkbox = document.querySelectorAll("[id^='in-category-'][type = 'radio']");
		var catNumber = [];
		
		//data nombre
		for (var i = 0; i < checkbox.length; i++) {
			var idName = checkbox[i].getAttribute("id");
			idName = idName.replace ("in-category-", "");
			checkbox[i].setAttribute("data-cat-id", idName);
			catNumber[i] = idName;
		}
		
		//mirar cual está encendido y ocultar todas las cajas al cargar
		var types = ["asamblea", "gtrabajo", "mani"];
		var check_on = 0;
		for (var k = 0; k < checkbox.length; k++) {
			if (checkbox[k].checked == true) {
				check_on = k;
			}
		}
		
		for (var l = 0; l < types.length; l++) {
			document.getElementById(types[l]).style.display = "none";	
		}
		
		switch (check_on) {
			case check_on = 0:
				document.getElementById(types[0]).style.display = "block";
				break;
			case check_on = 2:
				document.getElementById(types[1]).style.display = "block";
				break;
			case check_on = 3:
				document.getElementById(types[2]).style.display = "block";
				break;	
		}
		
		console.log(catNumber);//para ver los numeros de las categorias en console
		//lo mismo pero al lanzar el evento change en los radio buttons
		for (var j = 0; j < checkbox.length; j++) {
			checkbox[j].addEventListener("change", function(ev){
				
				var which_on = ev.target.getAttribute("data-cat-id");
				
				for (var l = 0; l < types.length; l++) {
					document.getElementById(types[l]).style.display = "none";	
				}
				switch (which_on) {
					case which_on = catNumber[0]: //num-cat asamblea
						document.getElementById(types[0]).style.display = "block";
						break;
					case which_on = catNumber[2]://num-cat gtrabajo
						document.getElementById(types[1]).style.display = "block";
						break;
					case which_on = catNumber[3]://num-cat mani
						document.getElementById(types[2]).style.display = "block";
						break;	
				}
			}, false);
		}
};
