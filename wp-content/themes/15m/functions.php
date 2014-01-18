<?php

include_once ("theme-core/enqueue-scripts.php");
include_once ("theme-core/categories.php");
include_once ("theme-core/actas-post-type.php");

//Controlar el excerpt


//Meter imágenes

add_theme_support("post-thumbnails");

//definir clases admin
$asamblea_box = new meta_box_asamblea("asamblea", "Asamblea");
$gtrabajo_box = new meta_box_gtrabajo("gtrabajo", "Grupo de Trabajo");
$mani_box = new meta_box_mani("mani", "Movilizaciones");
$actos_box = new meta_box_actos("actos", "Actos");


//nueva cat en categories.php
add_action("add_meta_boxes", array(&$asamblea_box, "set_box"));
add_action("add_meta_boxes", array(&$gtrabajo_box, "set_box"));
add_action("add_meta_boxes", array(&$mani_box, "set_box"));
add_action("add_meta_boxes", array(&$actos_box, "set_box"));

//inicial custom post type
add_action( 'init', 'acta_post_type' );




?>