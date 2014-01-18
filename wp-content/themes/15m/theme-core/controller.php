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
	
	//nombre de autor
	$autor_id = $post->author;
	$autor_name = get_the_author_meta("user_nicename", $autor_id);



} else if (is_home()) {
//controlador de index.php

}
?>