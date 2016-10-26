<?php /* Template Name: Search */

$search_data = medicine_process_search_request( get_query_var( 'q' ) );

$search_results = $search_data->hits->hits;

get_header();

?>

	<main id="wsuwp-main" class="spine-sideright-template">

		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

			<?php get_template_part( 'parts/headers' ); ?>
			<?php get_template_part( 'parts/featured-images' ); ?>

			<section class="row side-right gutter pad-ends">

				<div class="column one">
					<?php
					foreach( $search_results as $search_result ) {
						?>
						<article>
							<h2><a href="<?php echo esc_url( $search_result->_source->url ); ?>"><?php echo esc_html( $search_result->_source->title ); ?></a></h2>
							<span class="visible-url"><?php echo esc_url( $search_result->_source->url ); ?></span>
							<div class="visible-content">
								<?php
								$visible_content = wpautop( $search_result->_source->content );
								$visible_content = strip_tags( $visible_content, '<p><h2><h3><h4><h5>' );
								$visible_content = substr( $visible_content, 0, 240 );
								$visible_content = force_balance_tags( $visible_content . '....' );

								echo $visible_content;
								?>
							</div>
						</article><?php
					}
					?>
				</div><!--/column-->

				<div class="column two">

				</div>

			</section>
			<?php
		endwhile;
		endif;

		get_template_part( 'parts/footers' );

		?>
	</main>
<?php get_footer();
