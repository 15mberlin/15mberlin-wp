<?php get_header(); ?>
<?php include_once("head.php"); ?>
<?php include_once("theme-core/controller.php"); ?>

<div id="container">
		<div id="post_left">
	
		<a href="<?php echo $img_info[0]; ?>">
			<?php 
				if (has_post_thumbnail()) {
					the_post_thumbnail(array(200,200), array("class"=>"post-img")); 
				} else {
					echo "<img  heigth='100px' width='130px'  class='post-img' src=''/>";
				}	
			?>
		</a>
		<p class="infos">
			<span class="infos_title">Fecha Publicación:</span><br/>
			<?php echo ucfirst(get_the_date()); ?>
		</p>
		<p class="infos">
			<span class="infos_title">Autor/a:</span><br/>
			<?php echo "15m Berlin"?>
		</p>
		<p class="infos">
			<span class="infos_title">Comentarios:</span>
			<?php echo $post->comment_count; ?>
		</p>
		<p class="infos">
			<span class="infos_title">Post-type:</span>
			<?php echo $post->post_type; ?>
		</p>
		
		<div class="social_share">
			<span class="infos_title social">Socialízalo</span>
			<div class="social_bubble">
				<a href="" id="facebook_share">
					<img src="<?php bloginfo('template_directory'); ?>/img/facebook.png" alt="facebook" />
				</a>
				<a href="#twitter">
					<img src="<?php bloginfo('template_directory'); ?>/img/twitter.png" alt="facebook" />
				</a>
				<a href="#github">
					<img src="<?php bloginfo('template_directory'); ?>/img/github.png" alt="facebook" />
				</a>
			</div>
		</div>
		
		
	</div> <!-- end of left -->
	
	<div id="post_center">
		<a href="<?php echo $post->guid; ?>">
			<h2 class="post_title" id="share_title">
				<?php echo $post->post_title; ?>
			</h2>
		</a>
		<div class="post_description">
		<table>
			<tr>
				<td>Categoría</td>
				<td><?php echo ucfirst($actual_cat[0]->slug); ?></td>
			</tr>
			<tr>
				<td>Fecha</td>
				<td><?php echo $custom_info["fecha"]; ?></td>
			</tr>
			<tr>
				<td>Hora</td>
				<td><?php echo $custom_info["hora"]; ?></td>
			</tr>
			<tr>
				<td>Lugar</td>
				<td><?php echo $custom_info["lugar"]; ?><a href="#map"><span class="map_link"> ver mapa...</span></a></td>
			</tr>
		</table>
		</div>
		
		<div class="orden_del_dia">
			<h4>Orden del dia</h4>
			<p>No hay información todavía</p>
		</div>
		
		<div class="post_content">
			<?php echo $post->post_content; ?>
		</div>
		
		<div class="post_map">
			<a name="map"></a>
			<img src="http://maps.googleapis.com/maps/api/staticmap?center=<?php echo $custom_info["mapa-x"]; ?>,<?php echo $custom_info["mapa-y"];?>&zoom=13&size=800x150&sensor=false" />
		</div>
		
	</div> <!-- end of center -->
	<div id="post_loop">
		<?php 
		$my_query = new WP_Query('posts_per_page=5');
		while ($my_query->have_posts()) : $my_query->the_post();
		
		if ($post->ID !== $actual_postID) {
		
		} 
		
		$cats =  get_the_category($post->ID);
		$actual_cat = $cats[0]->slug;
		?>
		<div id="post_loop_block">
			<a href="<?php the_permalink() ?>">
			<h2>
				<div class="dots">
					<span class="<?php echo $actual_cat; ?>"></span>
				</div>
				<span><?php echo $post->post_title; ?></span>
			</h2>
			<span class="comments"><?php echo $post->comment_count; ?></span>
			</a>
		</div>
		
		<?php endwhile; ?>	
	</div>

</div>

	<pre>
	<?php 
		$author = get_the_author();
		print_r($author)
	?>
	</pre>