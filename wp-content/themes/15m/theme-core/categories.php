<?php

//4 categorias... pillo numeros
$cats = get_categories();
$cat_numbers = array(
		array($cats[0]->name, $cats[0]->term_id), //asamblea
		array($cats[1]->name, $cats[1]->term_id), //documentos
		array($cats[2]->name, $cats[2]->term_id), //gtrabajo
		array($cats[3]->name, $cats[3]->term_id), //mani
	);

$types = array (
	array ("asamblea", "Asamblea"), 
	array ("gtrabajo", "Grupo de Trabajo"),
	array ("mani", "Movilizaciones"),
	array ("actos", "Actos")
	//Datos para categorías nuevas	
);



class meta_box {

	public $nam;
	public $nice_nam;
	public $pref;
	
	//para meter parámetros por el constructor
	public function __construct($nam, $nice_nam) {
		$this->nam = $nam;
		$this->nice_nam = $nice_nam;	
	}
	
	//generar cajas
	public function set_box () {
		add_meta_box(
			$this->nam, 
			"Información de " . $this->nice_nam, 	
			array ($this, "show_box"), 
			"post", 
			"normal", 
			"high"
		);
	}
	
	//generar prefijo
	public function pref () {
		$this->pref = $this->nam;
		return $this->pref . "-";
	}
	
	public function set_name_asamblea () {
		return array (
			"title"    => "Nombre",
			"id"       => $this->pref() . "nombre",
			"desc"     => "Mete el nombre",
			"type"     => "text"
		);
	}
	
	public function set_date () {
		return array (
			"title"    => "Fecha",
			"id"       => $this->pref() . "fecha",
			"desc"     => "Mete la fecha",
			"type"     => "text"
		);
	}
	
	public function set_hour () {
		return array (
			"title"    => "Hora",
			"id"       => $this->pref() . "hora",
			"desc"     => "Mete la hora",
			"type"     => "text"
		);
	}
	
	public function set_place () {
		return array (
			"title"    => "Lugar",
			"id"       => $this->pref() . "lugar",
			"desc"     => "Mete el lugar",
			"type"     => "text"
		);
	}
	
	public function set_map () {
		$map = array (
			"title"    => "Mapa",
			"id"       => $this->pref() . "mapa",
			"desc"     => "Objeto GoogleMaps",
			"type"     => "text"
		);
		$map_x = array (
			"title"    => "Mapa-x",
			"id"       => $this->pref() . "mapa-x",
			"type"     => "hidden"
		);
		$map_y = array (
			"title"    => "Lugar",
			"id"       => $this->pref() . "mapa-y",
			"type"     => "hidden"
		);
		
		return array ($map, $map_x, $map_y);
	}
}

class meta_box_asamblea extends meta_box {
	
	public function post_fields () {
		$map = $this->set_map();
		
		return array (
			$this->set_date(),
			$this->set_hour(),
			$this->set_place(),
			$map[0],
			$map[1],
			$map[2]
		);
	}
	
	public function show_box ($post) {
		
		$dale = $this->post_fields();
		
		//<input type="hidden" id="pref-mapa-x" value="...." name="pref-mapa-x"/>
		echo '<input type="' . $dale[4]["type"] . '" id="' . $dale[4]["id"] . '" value="'. get_post_meta($post->ID, $dale[4]["id"], true) .'" name="' . $dale[4]["id"] . '"/>';
		echo '<input type="' . $dale[5]["type"] . '" id="' . $dale[5]["id"] . '" value="'. get_post_meta($post->ID, $dale[5]["id"], true) .'" name="' . $dale[5]["id"] . '"/>';
		
		$loop = count($dale) - 2;
		
		echo '<table width="100%">';
		
		for ($i = 0; $i < $loop; $i++) {
			if ($i < 1) { //en el primero le meto 2 td por que ahí va el mapa en un td tb, en el resto 1td
				
				echo "<tr>";
				
				
				echo "<td>";
				echo '<label for="'. $dale[$i]["id"] .'">'. $dale[$i]["title"] .'</label><br/>';
				echo '<input type="'. $dale[$i]["type"] .'" id="'. $dale[$i]["id"] .'" value="'. get_post_meta($post->ID, $dale[$i]["id"], true) .'" name="'. $dale[$i]["id"] .'"/>';
				echo '<br/><span class="description">'. $dale[$i]["desc"] .'</span>';
				echo "</td>";
				
				echo '<td width="400" height="218" rowspan="4">';
				echo '<div id="map-canvas-asamblea" style="width:100%; height:100%" data-map="' . get_post_meta($post->ID, $dale[3]["id"],true) . '"> </div>';
				echo "</td>";
				
				echo "</tr>";
				
			} else {
			
				echo "<tr>";
				
				echo "<td>";
				echo '<label for="'. $dale[$i]["id"] .'">'. $dale[$i]["title"] .'</label>';
				echo '<input type="'. $dale[$i]["type"] .'" id="'. $dale[$i]["id"] .'" value="'. get_post_meta($post->ID, $dale[$i]["id"], true) .'" name="'. $dale[$i]["id"] .'"/>';
				echo '<br/><span class="description">'. $dale[$i]["desc"] .'</span>';
				echo "</td>";
				
				echo "</tr>";
			}
		}
		
		echo '</table>';
		
		
	}
	
	public function dale () {
		$hola = $this->post_fields();
		?>
		<pre>
		<?php print_r ($hola); ?>
		</pre>
		<?php
	}

}

class meta_box_gtrabajo extends meta_box {
	
	public function post_fields () {
	$map = $this->set_map();
		
	return array (
			$this->set_name_asamblea(),
			$this->set_date(),
			$this->set_hour(),
			$this->set_place(),
			$map[0],
			$map[1],
			$map[2]
		);
	}
	
	public function show_box ($post) {
		
		$dale = $this->post_fields();
		
		//<input type="hidden" id="pref-mapa-x" value="...." name="pref-mapa-x"/>
		echo '<input type="' . $dale[4]["type"] . '" id="' . $dale[4]["id"] . '" value="'. get_post_meta($post->ID, $dale[4]["id"], true) .'" name="' . $dale[4]["id"] . '"/>';
		echo '<input type="' . $dale[5]["type"] . '" id="' . $dale[5]["id"] . '" value="'. get_post_meta($post->ID, $dale[5]["id"], true) .'" name="' . $dale[5]["id"] . '"/>';
		
		$loop = count($dale) - 2;
		
		echo '<table>';
		
		for ($i = 0; $i < $loop; $i++) {
			if ($i < 1) { //en el primero le meto 2 td por que ahí va el mapa en un td tb, en el resto 1td
				
				echo "<tr>";
				
				
				echo "<td>";
				echo '<label for="'. $dale[$i]["id"] .'">'. $dale[$i]["title"] .'</label><br/>';
				echo '<input type="'. $dale[$i]["type"] .'" id="'. $dale[$i]["id"] .'" value="'. get_post_meta($post->ID, $dale[$i]["id"], true) .'" name="'. $dale[$i]["id"] .'"/>';
				echo '<br/><span class="description">'. $dale[$i]["desc"] .'</span>';
				echo "</td>";
				
				echo '<td width="400" height="218" rowspan="4">';
				echo '<div id="map-canvas-gtrabajo" style="width:100%; height:100%" data-map="' . get_post_meta($post->ID, $dale[3]["id"],true) . '"> </div>';
				echo "</td>";
				
				echo "</tr>";
				
			} else {
			
				echo "<tr>";
				echo "<th>";
				echo '<label for="'. $dale[$i]["id"] .'">'. $dale[$i]["title"] .'</label>';
				echo "</th>";
				
				echo "<td>";
				echo '<input type="'. $dale[$i]["type"] .'" id="'. $dale[$i]["id"] .'" value="'. get_post_meta($post->ID, $dale[$i]["id"], true) .'" name="'. $dale[$i]["id"] .'"/>';
				echo '<br/><span class="description">'. $dale[$i]["desc"] .'</span>';
				echo "</td>";
				
				echo "</tr>";
			}
		}
		
		echo '</table>';
		
		
	}

}

class meta_box_mani extends meta_box {
	
	public function post_fields () {
	$map = $this->set_map();
		
	return array (
			$this->set_date(),
			$this->set_hour(),
			$this->set_place(),
			$map[0],
			$map[1],
			$map[2]
		);
	}
	
	public function show_box ($post) {
		
		$dale = $this->post_fields();
		
		//<input type="hidden" id="pref-mapa-x" value="...." name="pref-mapa-x"/>
		echo '<input type="' . $dale[4]["type"] . '" id="' . $dale[4]["id"] . '" value="'. get_post_meta($post->ID, $dale[4]["id"], true) .'" name="' . $dale[4]["id"] . '"/>';
		echo '<input type="' . $dale[5]["type"] . '" id="' . $dale[5]["id"] . '" value="'. get_post_meta($post->ID, $dale[5]["id"], true) .'" name="' . $dale[5]["id"] . '"/>';
		
		$loop = count($dale) - 2;
		
		echo '<table>';
		
		for ($i = 0; $i < $loop; $i++) {
			if ($i < 1) { //en el primero le meto 2 td por que ahí va el mapa en un td tb, en el resto 1td
				
				echo "<tr>";
				
				
				echo "<td>";
				echo '<label for="'. $dale[$i]["id"] .'">'. $dale[$i]["title"] .'</label><br/>';
				echo '<input type="'. $dale[$i]["type"] .'" id="'. $dale[$i]["id"] .'" value="'. get_post_meta($post->ID, $dale[$i]["id"], true) .'" name="'. $dale[$i]["id"] .'"/>';
				echo '<br/><span class="description">'. $dale[$i]["desc"] .'</span>';
				echo "</td>";
				
				echo '<td width="400" height="218" rowspan="4">';
				echo '<div id="map-canvas-mani" style="width:100%; height:100%" data-map="' . get_post_meta($post->ID, $dale[3]["id"],true) . '"> </div>';
				echo "</td>";
				
				echo "</tr>";
				
			} else {
			
				echo "<tr>";
				echo "<th>";
				echo "</th>";
				
				echo "<td>";
				echo '<label for="'. $dale[$i]["id"] .'">'. $dale[$i]["title"] .'</label><br/>';
				echo '<input type="'. $dale[$i]["type"] .'" id="'. $dale[$i]["id"] .'" value="'. get_post_meta($post->ID, $dale[$i]["id"], true) .'" name="'. $dale[$i]["id"] .'"/>';
				echo '<br/><span class="description">'. $dale[$i]["desc"] .'</span>';
				echo "</td>";
				
				echo "</tr>";
			}
		}
		
		echo '</table>';
		
		
	}

}



//CLASE PARA CATEGORÍAS NUEVAS

class meta_box_actos extends meta_box {
	
	public function post_fields () {
	//mapa
	$map = $this->set_map();
	
	//post-fields donde se deciden los inputs
	return array (
			$this->set_date(),
			$this->set_hour(),
			$this->set_place(),
			$map[0],
			$map[1],
			$map[2]
		);
	}
	
	//dibujar la UI
	public function show_box ($post) {
		
		$dale = $this->post_fields();
		
		//<input type="hidden" id="pref-mapa-x" value="...." name="pref-mapa-x"/>
		echo '<input type="' . $dale[4]["type"] . '" id="' . $dale[4]["id"] . '" value="'. get_post_meta($post->ID, $dale[4]["id"], true) .'" name="' . $dale[4]["id"] . '"/>';
		echo '<input type="' . $dale[5]["type"] . '" id="' . $dale[5]["id"] . '" value="'. get_post_meta($post->ID, $dale[5]["id"], true) .'" name="' . $dale[5]["id"] . '"/>';
		
		$loop = count($dale) - 2;
		
		echo '<table width="100%">';
		
		for ($i = 0; $i < $loop; $i++) {
			if ($i < 1) { //en el primero le meto 2 td por que ahí va el mapa en un td tb, en el resto 1td
				
				echo "<tr>";
				
				
				echo "<td>";
				echo '<label for="'. $dale[$i]["id"] .'">'. $dale[$i]["title"] .'</label><br/>';
				echo '<input type="'. $dale[$i]["type"] .'" id="'. $dale[$i]["id"] .'" value="'. get_post_meta($post->ID, $dale[$i]["id"], true) .'" name="'. $dale[$i]["id"] .'"/>';
				echo '<br/><span class="description">'. $dale[$i]["desc"] .'</span>';
				echo "</td>";
				
				echo '<td width="400" height="218" rowspan="4">';
				echo '<div id="map-canvas-actos" style="width:100%; height:100%" data-map="' . get_post_meta($post->ID, $dale[3]["id"],true) . '"> </div>';
				echo "</td>";
				
				echo "</tr>";
				
			} else {
			
				echo "<tr>";
				echo "<td>";

				echo '<label for="'. $dale[$i]["id"] .'">'. $dale[$i]["title"] .'</label><br/>';
								
				echo '<input type="'. $dale[$i]["type"] .'" id="'. $dale[$i]["id"] .'" value="'. get_post_meta($post->ID, $dale[$i]["id"], true) .'" name="'. $dale[$i]["id"] .'"/>';
				echo '<br/><span class="description">'. $dale[$i]["desc"] .'</span>';
				echo "</td>";
				
				echo "</tr>";
			}
		}
		
		echo '</table>';
		
		
	}

}




?>