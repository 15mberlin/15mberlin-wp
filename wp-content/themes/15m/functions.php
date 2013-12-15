<?php

include_once ("theme-core/enqueue-scripts.php");
//include_once ("theme-core/cpf-asamblea.php");
//include_once ("theme-core/cpf-gtrabajo.php");
//include_once ("theme-core/cpf-mani.php");
include_once ("theme-core/images.php");
include_once ("theme-core/candela-chacho.php");


//Controlar el excerpt


//Meter imágenes

add_theme_support("post-thumbnails");


//para meter javascript en el admin panel

function custom_admin_js() {
    $url = get_option('siteurl');
    $url = get_bloginfo('template_directory') . '/wp-admin.js';
    echo '"<script type="text/javascript" src="'. $url . '"></script>"';
}

add_action('admin_footer', 'custom_admin_js');






?>