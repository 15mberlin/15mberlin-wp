<?php get_header(); ?>
<?php get_template_part('head'); ?>
<?php include_once("theme-core/controller.php"); ?>

<div id="container">

<?php get_template_part("filter"); //filtro ?>
<?php get_template_part("loop-cat"); //loop condicionado ?>

</div><!-- end of BIG CONTAINER -->
<?php get_footer() ?>