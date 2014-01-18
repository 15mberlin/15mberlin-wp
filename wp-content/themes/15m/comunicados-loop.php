<?php 
//loop comunicados

$args = array( 'post_type' => 'post', 'posts_per_page' => 10, 'category_name' => 'comunicados');
$loop = new WP_Query( $args );
while ( $loop->have_posts() ) : $loop->the_post();
?>

	<div id="acta" class="<?php echo $post->post_type ?>" data-post-number="<?php echo $post->ID ?>">
		<h1 class="acta_title"><?php echo $post->post_title; ?></h1>
		<p class="acta_excerpt"><?php echo excerpt_or_content($post, 420); ?></p>
		<p class="acta_last">Última modificación en <?php echo ucfirst(get_the_modified_date( $d,$m,$y )) ?></p>
	</div>

<?php
endwhile;
?>

<pre>
<?php

//print_r($post);


?>
</pre>