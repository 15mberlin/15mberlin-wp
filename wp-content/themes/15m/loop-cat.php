<?php //Abrimos loop
	if(have_posts()) {
		while(have_posts()) {
			the_post(); //llama al objeto post o page, depende de la cat
?>
<?php //Saco las categorías
	$categ_array = get_the_category();
	$catName = $categ_array[0]->cat_name; //[0] porque solo hay una cat. por post
	
	if (!$catName) {
		$categ_array[0]->cat_name = "post";
	}

	if ($catName && $catName == "Documentos") {
		$catName = "post";
	}
?>


<?php 

/*==== THE SWITCH ====*/

switch ($catName) {

//switcheamos en funcion del nombre de las categorías...
//aunque en un futuro estaría bien hacerlo por ids por si alguien cambia en nombre de las cats...

case "post":
	?>
	
	<section id="post" class="<?php echo $catName; ?> <?php echo 'post-id-' . $post->ID; ?>">
		<a href="<?php the_permalink(); ?>">
		<h2>
			<div class="dots">
				<span class="cat1"></span>
				<span class="cat2"></span>
			</div>
			<span class="title"><?php the_title() ?></span>
		</h2>
		</a>
		<div id="visual">
			<?php post_thumbnail(); ?>
			<span class="visual_caption">Foto 1</span>
			<span class="visual_search"></span>
		</div>
		
		<div id="post-excerp">
			<p><?php echo excerpt_or_content ($post, 110); ?></p>
		</div>
		
		<div id="post-data">
			<p class="pub">
				Publicado por: <br/><span class="link"><a href="#"><?php echo  get_the_author_link();?></a></span>
				<div class="date">
					<span class="link date_day"><a href="#"><?php the_time('d')?></a></span>|
					<span class="link date_month"><a href="#"><?php the_time('m')?></a></span>
					<span class="link date_year"><a href="#">20<?php the_time('y')?></a></span>
				</div>
			</p>
			<p class="social">
			Socialízalo
			</p>	
		</div>
		
	</section>
	
	<?php
	break;

case "gtrabajo":
	$gtrabajo_custom = get_post_meta($post->ID, $gtrabajo_post_fields, true);

	?>
	
	<section id="post" class="gtrabajo <?php echo 'post-id-' . $post->ID; ?>">
		<a href="<?php the_permalink(); ?>">
		<h2>
			<div class="dots">
				<span class="cat4"></span>
			</div>
			<span class="title">Grupo de trabajo</span>
		</h2>	
		</a>
		<div id="asamblea-description">
			
			<h3><?php echo($gtrabajo_custom["gtrabajo-nombre"][0]); ?></h3>
			<h3>Fecha y hora</h3>
			<h4>El día <?php echo($gtrabajo_custom["gtrabajo-fecha"][0]); ?><br/>A las <?php echo($gtrabajo_custom["gtrabajo-hora"][0]); ?></h4>
			<h3>Dónde</h3>
			<h4><?php echo($gtrabajo_custom["gtrabajo-lugar"][0]); ?></h4>
		</div>
		<div id="map">
			<img src="http://maps.googleapis.com/maps/api/staticmap?center=<?php echo $gtrabajo_custom["gtrabajo-mapa-x"][0]; ?>,<?php echo $gtrabajo_custom["gtrabajo-mapa-y"][0]; ?>&zoom=13&size=200x150&sensor=false" />
		</div>
		
		<div id="post-data">
			<p class="pub">
				Publicado por: <br/><span class="link"><a href="#"><?php echo  get_the_author_link();?></a></span>
				<div class="date">
					<span class="link date_day"><a href="#"><?php the_time('d')?></a></span>|
					<span class="link date_month"><a href="#"><?php the_time('m')?></a></span>
					<span class="link date_year"><a href="#">20<?php the_time('y')?></a></span>
				</div>
			</p>
			<p class="social">
			Socialízalo
			</p>	
		</div>
		
	</section>
	
	<?php
	break;

case "mani":
	$mani_custom = get_post_meta($post->ID, $mani_post_fields, true);
	?>
	
	<section id="post" class="mani red <?php echo 'post-id-' . $post->ID; ?>">
		<a href="<?php the_permalink(); ?>">
		<h2>
			<div class="dots">
				<span class="cat5"></span>
			</div>
			<span class="title">Movilización</span>
		</h2>			
		</a>
		<div id="visual">
			<?php post_thumbnail(); ?>
		</div>
		
		<div id="asamblea-description">
			<h3>Fecha y hora</h3>
			<h4>El día <?php echo($mani_custom["mani-fecha"][0]); ?><br/>A las <?php echo($mani_custom["mani-hora"][0]); ?></h4>
			<h3>Dónde</h3>
			<h4><?php echo($mani_custom["mani-lugar"][0]); ?></h4>
		</div>
		
		<div id="post-data">
			<p class="pub">
				Publicado por: <br/><span class="link"><a href="#"><?php echo  get_the_author_link();?></a></span>
				<div class="date">
					<span class="link date_day"><a href="#"><?php the_time('d')?></a></span>|
					<span class="link date_month"><a href="#"><?php the_time('m')?></a></span>
					<span class="link date_year"><a href="#">20<?php the_time('y')?></a></span>
				</div>
			</p>
			<p class="social">
			Socialízalo
			</p>	
		</div>
		
	</section>
	
	<?php
	break;

case "asamblea":
	$asamblea_custom = get_post_meta($post->ID, $asamblea_post_fields, true);
	?>
	
	
	<section id="post" class="asamblea <?php echo 'post-id-' . $post->ID; ?>">
		<a href="<?php the_permalink(); ?>">
		<h2>
			<div class="dots">
				<span class="cat3"></span>
			</div>
			<span class="title">Asamblea</span>
		</h2>
		</a>
		<div id="asamblea-description">
			<h3>Fecha y hora</h3>
			<h4>El día <?php echo($asamblea_custom["asamblea-fecha"][0]); ?><br/>A las <?php echo($asamblea_custom["asamblea-hora"][0]); ?></h4>
			<h3>Dónde</h3>
			<h4><?php echo($asamblea_custom["asamblea-lugar"][0]); ?>
			</h4>
		</div>
		<div id="map">
			<img src="http://maps.googleapis.com/maps/api/staticmap?center=<?php echo $asamblea_custom["asamblea-mapa-x"][0]; ?>,<?php echo $asamblea_custom["asamblea-mapa-y"][0]; ?>&zoom=13&size=200x150&sensor=false" />
		</div>
		
		<div id="post-data">
			<p class="pub">
				Publicado por: <br/><span class="link"><a href="#"><?php echo  get_the_author_link();?></a></span>
				<div class="date">
					<span class="link date_day"><a href="#"><?php the_time('d')?></a></span>|
					<span class="link date_month"><a href="#"><?php the_time('m')?></a></span>
					<span class="link date_year"><a href="#">20<?php the_time('y')?></a></span>
				</div>
			</p>
			<p class="social">
			Socialízalo
			</p>	
		</div>
		
	</section>
	
	<?php
	break;

case "comunicados":
	$asamblea_custom = get_post_meta($post->ID, $asamblea_post_fields, true);
	?>
	
	
	<section id="post" class="comunicados <?php echo 'post-id-' . $post->ID; ?>">
		<a href="<?php the_permalink(); ?>">
		<h2>
			<div class="dots">
				<span class="cat1"></span>
			</div>
			<span class="title">Comunicados</span>
		</h2>
		</a>
		<div id="comunicados-description">
			<h3><?php echo $post->post_title; ?></h3>
			<h4><?php echo excerpt_or_content ($post, 70) ?></h4>
		</div>
		<div id="post-data">
			<p class="pub">
				Publicado por: <br/><span class="link"><a href="#"><?php echo  get_the_author_link();?></a></span>
				<div class="date">
					<span class="link date_day"><a href="#"><?php the_time('d')?></a></span>|
					<span class="link date_month"><a href="#"><?php the_time('m')?></a></span>
					<span class="link date_year"><a href="#">20<?php the_time('y')?></a></span>
				</div>
			</p>
			<p class="social">
			Socialízalo
			</p>	
		</div>
		
	</section>
	
	<?php	
	break;


default:
	?>
	<h2>No encontramos lo que buscas, campeón</h2>
	<?php


};


?>




<?php //Cerramos loop	

		} //cierro while
	} // cierro if
?>


<section id="post">
		<div class="fb-like-box" data-href="http://www.facebook.com/Berlin15M" data-width="210px" data-height="230px" data-colorscheme="light" data-show-faces="true" data-header="false" data-stream="false" data-show-border="true"></div>
</section>

<?php // pruebas 	


?>






