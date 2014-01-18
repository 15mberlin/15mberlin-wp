<?php get_header(); ?>
<?php get_template_part('head'); ?>
<?php include_once("theme-core/controller.php"); ?>



<div id="container">

<h1 id="index_title">Novedades</h1>
	<div id="hover-area">
	<?php get_template_part("filter"); //filtro ?>
	<?php get_template_part("loop-cat"); //loop condicionado ?>
	</div>


</div><!-- end of BIG CONTAINER -->

<!--
<div id="container">
<h1 id="index_title">Actas</h1>
<?php get_template_part("actas"); //actas?>
</div>

<div id="container">
<h1 id="index_title">Comunicados</h1>
<?php get_template_part("comunicados-loop"); //actas?>
</div>

<div id="container">
<h1 id="index_title">Comunicados</h1>
<?php get_template_part("contacto"); //actas?>
</div>
-->
<?php get_footer() ?>