
//admin functions


window.onload = function () {
	//compruebo si estoy en admin o no...
	if(document.getElementById("asamblea")) { //esta id sólo existe en admin-post.php
		//metaBox_admin.init();
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
		
		for (var i = 0; i < types.length; i++) {
			document.getElementById(types[i] + "-mapa").addEventListener("change", insertMapURL, false);
		}
		//<=<=<=<=<=<=<=<=<=<=<=<= al meter change, cambiar mapa...
		
		
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

	//que mapa ha sido draggeado
	var selfId = this.b.getAttribute("id"); 
	var selfId_name = selfId.replace("map-canvas-", "");
	
	//variables del centro después de draggear
	var x = this.getCenter().ob; //API maps
	var y = this.getCenter().pb; //API maps
	var stringPlace = x + "," + y;
	
	//comprobar si el campo está vacío o no...
	var campo = document.getElementById(selfId_name + "-mapa").value;
	
	if(campo !== "") {
		var campoStart = campo.indexOf("ll=") + 3;
		var campoEnd = campo.indexOf("&spn");	
		campo = campo.replace(campo.substring(campoStart, campoEnd), stringPlace);
	} else {
		//string de maps
		campo = "https://maps.google.de/?ll=" +  stringPlace + "&spn=0.009125,0.022724&t=m&z=16";		
	}
	
	//meter el string en el campo del formulario
	document.getElementById(selfId_name + "-mapa").value = campo;

	
	//meter x y y en el hidden para mandarlo a la database
	document.getElementById(selfId_name + "-mapa-x").value = x;
	document.getElementById(selfId_name + "-mapa-y").value = y;
	
	//mensaje de victoria!! :)
	console.log ("He draggeado " + selfId);				
}

var insertMapURL = function (ev) {
	//validar dato de entrada desde Clientside
	//http://stackoverflow.com/questions/14729191/google-maps-link-validation-using-regex
	
	var campo = this.value;
	
	/*var regexp_maps = new RegExp ("(https|http):\/\/(www\.|)google\.[a-z]+\/maps");
	var URL_validation = regexp_maps.exec(campo);
	
	if (URL_validation) {
		console.log("vale");
		console.log(campo);
	} else {
		console.log("no vale");
		console.log(campo);
	}*/
	
	var mapa = this.getAttribute("id");
	

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


