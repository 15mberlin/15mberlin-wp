//admin functions
window.onload = function () {
	//compruebo si estoy en admin o no...
	if(document.getElementById("asamblea")) { //esta id sólo existe en admin-post.php
		//funciones para ocultar y ordenar boxes según categoría marcada
		//true es cuando tienen caja, false cuando no... para que sea escalable...
		var types = [["actos", true], ["asamblea", true], ["comunicados", false],["documentos", false], ["gtrabajo", true], ["mani", true]]; 
		//hacer un sort según nombres de categorías...


		//metabox funciona, está definido en el objeto metabox más abajo...
		metaBox_admin.init(types);		
		
		//inicializo mapas. Ver Objeto map_box
		map_box.init(types);
	}
};


//MANEJO DE MAPAS EN OBJETO
var map_box = {
	_baiz: [52.528376, 13.410015], //para los Nan... :)
	mapaBox : function (types) {
		var a = [];
		for (var i = 0; i < types.length; i++) {
			if(document.getElementById("map-canvas-" +  types[i]) !== null) {
				a[i] = document.getElementById("map-canvas-" +  types[i]);
			}
		}
		return a;
	},
	//toma las URL de Maps que lanza el Backend.
	mapData : function (types) {
		var b = [];
		var a = [];
		
		for (var j = 0; j < types.length; j++) {
			a[j] = types[j][0];
		}
		var mapaBox = this.mapaBox(a);
		for (var i = 0; i < types.length; i++) {
			
			if (types[i][1] == true) {

				b[i] = mapaBox[i].getAttribute("data-map");			
				//proceso los string de las URL para sacar las coordenadas
				var numStart = b[i].indexOf("ll=") + 3; //+4 para que coja lo que viene despues...
				var numEnd = b[i].indexOf("&spn"); // +0 para que se quede donde esta
				b[i] = b[i].substring(numStart, numEnd);

				//hago del string un array con la coord-x y coord-y
				b[i] = String.split(b[i], ",");
				for (var j = 0; j < b[i].length; j++) {
						b[i][j] = parseFloat(b[i][j]);
				}
			}
		}
		//retorno un array con todas las coord de todos los mapas
		return b;
	},
	//uso Maps-API para dibujar mapas
	draw_maps : function (data, types){
		
		var myLatlng = [], name = [], map = []; //cargo las var, que si no se enfadan
		

		console.log(types);
		console.log(data);

		for (var i = 0; i < types.length; i++) {

			if (types[i][1] == true) {
			//si no hay datos guardados es NaN y no se produce el mapa lo pongo en el Baiz
					if (isNaN(data[i][0]) || isNaN(data[i][1])) {
						data[i][0] = this._baiz[0];
						data[i][1] = this._baiz[1];
					}

					myLatlng[i] = new google.maps.LatLng(data[i][0], data[i][1]);
					var mapOptions = {
						zoom: 16,
						center: myLatlng[i],
						mapTypeId: google.maps.MapTypeId.ROADMAP,
						zoomControl : false,
						noClear: true
					};
					name[i] = "map-canvas-" + types[i][0];  
					map[i] = new google.maps.Map(document.getElementById(name[i]), mapOptions);	
				}	
		}
		return map;
	},
	mapDrag: function (types) {
		//que mapa ha sido draggeado
		var selfId = this.b.getAttribute("id"); 
		var selfId_name = selfId.replace("map-canvas-", "");
		
		//variables del centro después de draggear
		var x = this.getCenter().lat(); //API maps
		var y = this.getCenter().lng(); //API maps
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
	},

	insertURL: function() {
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
	},

	init: function (types){
		//var types cntiene informacion de mapa y caja, var a, sólo el nombre de los divs...
		var a= [];

		for (var i = 0; i < types.length; i++) {
			a[i] = types[i][0];
		}

		var maps_array = this.mapData(types);
		var map = this.draw_maps(maps_array, types);

		//meter listener para mapDrag
		for (var i = 0; i < map.length; i++) {
			google.maps.event.addListener(map[i], "dragend", this.mapDrag, a[i]);
		}

		//meter listener para insertURL
		for (var i = 0; i < a.length; i++) {
			document.getElementById(a[i] + "-mapa").addEventListener("change", this.insertURL, false);
		}
	}
};



var metaBox_admin = {
	
	//toma los checkbox de la caja de categorías
	checkbox: function (){
		var a = document.querySelectorAll("[id^='in-category-'][type = 'checkbox']");
		return a;
	},
	//toma los radios de la caja de categorías
	cat_radio: function () {
		var a = document.querySelectorAll("[id^='in-category-'][type = 'radio']");
		return a;
	},
	//convierte checkbuttons en radios (por si no funciona el plugin)
	checkToRadio: function() { 
		var c = this.cat_radio();
		for (var i = 0; i < c.length; i++) {
			c[i].type = "radio";
		}
	},
	//oculta todas las cajas
	hideBox: function(types) {
		
		for (var i = 0; i < types.length; i++) {
			if(document.getElementById(types[i]) !== null) 
			document.getElementById(types[i]).style.display = "none";	
		}
	},
	//pilla los números de ID que corresponden a las categorías
	get_CatNumber: function () {
		var a = this.cat_radio(), catNumber = [];
		for (var i = 0; i < a.length; i++) {
			var idName = a[i].getAttribute("id");
			idName = idName.replace ("in-category-", "");
			a[i].setAttribute("data-cat-id", idName);
			catNumber[i] = idName; 
		}
		return catNumber;
	},
	//saber qué radio está encendido al cargar -> qué cat está activa
	get_cat_on: function () {
		var check_on = 0, a = this.cat_radio();
		for (var i = 0; i < a.length; i++) {
			if (a[i].checked) {
				check_on = i;
			};
		}
		return check_on;
	},
	//en funcion de la cat activa mostrar cajas
	show_metabox: function (a, types) {
		var boxes = [];
		for (var i = 0; i < types.length; i++){
			boxes[i] = document.getElementById(types[i][0]);
		}
		if (boxes[a] !== null) {
			boxes[a].style.display = "block";
		}
	},
	//en funcion de la cat activa tras evento mostrar caja nueva
	change_metabox: function (types) {
		var a = this.cat_radio();				
		for(var i = 0; i < a.length; i++){
			a[i].addEventListener("change", function(ev){
				metaBox_admin.evHandler(types);
			}, false);
		}	
	},
	//la función que se dispara trs los eventos de change_metabox
	evHandler: function (types) {
		var a= [];
		for (var i = 0; i < types.length; i++) {
			a[i] = types[i][0];
		}

		metaBox_admin.hideBox(a); //ocultar las cajas
		metaBox_admin.get_CatNumber(); //dar un data-cat-id para tener a mano las id de las categorías.
		var cat_activa = metaBox_admin.get_cat_on(); //saber qué categoría está activa
		metaBox_admin.show_metabox(cat_activa, types);
	},
	//inicia las funciones del objeto
	init: function (types) {
		var a= [];
		for (var i = 0; i < types.length; i++) {
			a[i] = types[i][0];
		}

		this.checkToRadio(); //checkbox en radio
		this.hideBox(a); //ocultar las cajas

		this.get_CatNumber(); //dar un data-cat-id para tener a mano las id de las categorías.
		var cat_activa = this.get_cat_on(); //saber qué categoría está activa
		this.show_metabox(cat_activa, types);
		this.change_metabox(types); //poner EventListener
	}

};


