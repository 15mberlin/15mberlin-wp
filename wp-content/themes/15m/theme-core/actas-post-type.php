<?php
function acta_post_type() {
	$labels = array(
		'name' => __( 'Actas' ),
		'singular_name' => __( 'Actas' ),
		'add_new' => __( 'Añade acta nueva' ),
		'all_items' => __( 'Todas las actas' ),
		'add_new_item' => __( 'Añade nueva acta' ),
		'edit_item' => __( 'Edita acta' ),
		'new_item' => __( 'Nueva acta' ),
		'view_item' => __( 'Ver acta' ),
		'search_items' => __( 'Buscar actas' ),
		'not_found' => __( 'Acta no encontrada' ),
		'not_found_in_trash' => __( 'Acta no encontrada en la papelera' ),
		'parent_item_colon' => __( 'Acta parent' )
		//'menu_name' => default to 'name'
	);
	$args = array(
		'labels' => $labels,
		'public' => true,
		'has_archive' => true,
		'publicly_queryable' => true,
		'query_var' => true,
		'rewrite' => true,
		'capability_type' => 'post',
		'hierarchical' => false,
		'supports' => array(
			'title',
			'editor',
			'excerpt',
			'thumbnail',
			//'author',
			//'trackbacks',
			//'custom-fields',
			//'comments',
			'revisions',
			//'page-attributes', // (menu order, hierarchical must be true to show Parent option)
			//'post-formats',
		),
		'taxonomies' => array('acta_category'), // add default post categories and tags
		'menu_position' => 5,
		//'register_meta_box_cb' => 'quote_add_post_type_metabox'
	);

	register_post_type( 'acta', $args );

	register_taxonomy( 
		'acta_category',
		'acta',// register custom taxonomy - quote category
		array( 
			'hierarchical'  => true,
			'label' 		=> "Acta-Categorías",
			"rewrite" 	    => array ("slug" => "Asamblea"),
			"query_var"		=> true
		)
	);
}

//para el query

