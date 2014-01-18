<?php 

//a darle caña al MVC...
if (is_single()) {
	//controlador de single.php

	//tomar nombre de las categorías...
	$cats = get_categories();
	$actual_cat = get_the_category();
	$actual_cat_name = "";
	$categ_name = array();
	
	for ($i = 0; $i < count($cats); $i++) {
		
		$categ_name[$i] = $cats[$i]->slug;
		
		if ($categ_name[$i] == $actual_cat[0]->slug) {
			$actual_cat_name = $actual_cat[0]->slug;		
		}
	}
	//$categ_name es el array con las cat-names
	//$actual_cat_name tiene un string con el nombre de la cat
		
		
	//hook datos metaboxes en función de categoría
	$post_meta = get_post_meta($post->ID);
	$custom_info = array(
		"fecha"   =>   $post_meta[$actual_cat_name . "-fecha"][0],
		"hora"    =>   $post_meta[$actual_cat_name . "-hora"][0],
		"lugar"   =>   $post_meta[$actual_cat_name . "-lugar"][0],
		"mapa_URL"=>   $post_meta[$actual_cat_name . "-mapa"][0],
		"mapa-x"  =>   $post_meta[$actual_cat_name . "-mapa-x"][0],
		"mapa-y"  =>   $post_meta[$actual_cat_name . "-mapa-y"][0]
	);
	
	 
	//img info
	$attachment_id = get_post_thumbnail_id($post->ID);
	$img_info = wp_get_attachment_image_src($attachment_id);
	
	function post_img () {
		if (has_post_thumbnail()) {
			the_post_thumbnail(array(200,200), array("class"=>"post-img"));
		} else {
			echo "<img  heigth='100px' width='130px'  class='post-img' src=''/>";
		}
	}
	
	//nombre de autor
	$autor_id = $post->author;
	$autor_name = get_the_author_meta("user_nicename", $autor_id);

	//function para mostrar-ocultar los diferentes elementos en funcion de categoría en el single.php
	function which_category($show_cats, $exc=null) {
		//input
		$_show_cats = $show_cats;
		$_exc = $exc;
		//get actual category
		$cat = get_the_category();
		$cat_name = $cat[0]->slug;
		

		//$show_cats puede ser un string o un array...
		if (!isset($exc)) {
			$output = false;
			if (is_array($_show_cats)) {
				for ($i = 0; $i < count($_show_cats); $i++) {
					if ($_show_cats[$i] == $cat_name) {
						return $output = true;
					} else {
						continue;
					}
				}
				return false;
			} else if (is_string($_show_cats)) {
				if ($_show_cats == $cat_name) {
					return $output = true;
				}
			} else {
				$output = false;
			}	

			return $output;

		} else if ($exc == "not") {
			$output = true;
			if (is_array($_show_cats)) {
				for ($i = 0; $i < count($_show_cats); $i++) {
					if ($_show_cats[$i] == $cat_name) {
						return $output = false;
					} else {
						continue;
					}
				}
				return true;
			} else if (is_string($_show_cats)) {
				if ($_show_cats == $cat_name) {
					return $output = false;
				}
			} else {
				$output = true;
			}	

			return $output;
		}
	}




} else if (is_home()) {
	//controlador de index.php
	
	//function show thumbnail
	function post_thumbnail() {
		$tam = array(200,150);
		if (has_post_thumbnail()) {
			the_post_thumbnail($tam);
		} else {
			echo "<img  heigth='" . $tam[1] . "' width='" . $tam[0] . "'  class='post-img' src=''/>";
		}
	}

	//calendar
	//include_once ("theme-core/calendar.php");

}

//function global que devuelve content si no hay excerpt
function excerpt_or_content (&$post, $max_num) {
	$length = $max_num;

	$exc = $post->post_excerpt;
	$cont = $post->post_content;
	$cont_mod = substr($cont, 0, $length) . '...';


	
	if($exc !== "") {
		return $exc;
	} else {
		return $cont_mod;
	}
}















?>