//admin functions


window.onload = function () {
	//compruebo si estoy en admin o no...
	if(document.getElementById("asamblea")) { //esta id sólo existe en admin-post.php
		
		//funciones para ocultar y ordenar boxes según categoría marcada
		checkToRadio();
		hideBox();
		
		
		//inicializamos ahora todos los calculos de mapas
		
		//hasta ahora las categorías que tomamos
		var types = ["asamblea", "gtrabajo", "mani"]; 
		
		
		//pillo los frames mapas
		var mapaBox = [];
		var mapData = [];
		
		for (var i = 0; i < types.length; i++) {
			
			mapaBox[i] = document.getElementById("map-canvas-" + types[i]);
			
			//centrar mapa según back end - procesa entrada
		
			mapData[i] = mapaBox[i].getAttribute("data-map");
			
			var numStart = mapData[i].indexOf("ll=") + 3; //+4 para que coja lo que viene despues...
			var numEnd = mapData[i].indexOf("&spn"); // +0 para que se quede donde esta
			
			mapData[i] = mapData[i].substring(numStart, numEnd); //tomamos los datos que nos importan
			
			mapData[i] = String.split(mapData[i],",");
			for (var j = 0; j < mapData[i].length; j++) {
				mapData[i][j] = parseFloat (mapData[i][j]);
			}
		}
		console.log(mapData);
	
		//inicializar mapas según datos backend
		var map = maps_init(mapData, types);
		
		//modifica campo lugar al draggear el mapa, para hacer entrada dinámica
		for (var i = 0; i < map.length; i++) {
			google.maps.event.addListener(map[i], "dragend", mapDrag, types[i]);
		}
	}
};




//function del API del google maps
var maps_init = function (data,types) {
	
	var _baiz = [52.528376, 13.410015];
	var myLatlng = [], name = [], map = []; //cargo las var, que si no se enfadan
	
	for (var i = 0; i < types.length; i++) {
		
		//si no hay datos guardados es NaN y no se produce el mapa lo pongo en el Baiz
		if (isNaN(data[i][0]) || isNaN(data[i][1])) {
			data[i][0] = _baiz[0];
			data[i][1] = _baiz[1];
		}
		myLatlng[i] = new google.maps.LatLng(data[i][0], data[i][1]);
		var mapOptions = {
			zoom: 16,
			center: myLatlng[i],
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl : false,
			noClear: true
		};
		
		name[i] = "map-canvas-" + types[i];  
		map[i] = new google.maps.Map(document.getElementById(name[i]), mapOptions); 	
				
	}
	return map;
	
};

var mapDrag = function (types) {

	var selfId = this.b.getAttribute("id"); 
	//para no volver a hacer un for loop, hago algo un poco triki...
	var selfId_name = selfId.replace("map-canvas-", "");
	
	
	
	var campo = document.getElementById(selfId_name + "-mapa").value;
	var campoStart = campo.indexOf("ll=") + 3;
	var campoEnd = campo.indexOf("&spn");	
	
	var x = this.getCenter().ob; //API maps
	var y = this.getCenter().pb; //API maps
	var stringPlace = x + ", " + y;
	
	campo = campo.replace(campo.substring(campoStart, campoEnd), stringPlace);
	document.getElementById(selfId_name + "-mapa").value = campo;
	
	//guardar datos en database
	document.getElementById(selfId_name + "-mapa-x").value = x;
	document.getElementById(selfId_name + "-mapa-y").value = y;
	
	console.log ("He draggeado " + selfId);				
}

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
