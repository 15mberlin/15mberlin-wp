<?php


//wp_enqueue_script('jquery-ui-datepicker');
//wp_enqueue_style('jquery-ui-custom', get_template_directory_uri().'/ui-lightness/jquery-ui-1.10.3.custom.css');
wp_enqueue_script("googlemaps_api", "https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false");
wp_enqueue_script("jquery", "http://code.jquery.com/jquery-1.9.1.js");
wp_enqueue_script("main-admin", get_template_directory_uri().'/js/main-admin.js');
//wp_enqueue_script("main-admin-obj", get_template_directory_uri().'/js/main-admin-obj.js');


function pw_load_scripts($hook) {
 
	if( $hook = 'edit.php' || $hook = 'post.php' || $hook = 'post-new.php' ) 
		
		return;
 
	 wp_enqueue_script( 'custom-js', plugins_url( 'js/main.js' , dirname(__FILE__) ) );
}
add_action('admin_enqueue_scripts', 'pw_load_scripts');

?>