<?php /* Template Name: Search */

$search_results = medicine_process_search_request( get_query_var( 'q' ) );

get_header();

?>

	<main id="wsuwp-main" class="spine-sideright-template">

		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

			<?php get_template_part( 'parts/headers' ); ?>
			<?php get_template_part( 'parts/featured-images' ); ?>

			<section class="row single gutter pad-ends">
				<div class="column one">
					<?php get_search_form(); ?>
				</div>
			</section>
			<section class="row side-right gutter pad-ends">

				<div class="column one">
					<?php

					if ( empty( $search_results ) ) {
						?><h2>No search results found.</h2><?php
					}
					foreach ( $search_results as $search_result ) {
						?>
						<article>
							<h2><a href="<?php echo esc_url( $search_result->_source->url ); ?>"><?php echo esc_html( $search_result->_source->title ); ?></a></h2>
							<span class="visible-url"><?php echo esc_url( $search_result->_source->url ); ?></span>
							<div class="visible-content">
								<?php
								$visible_content = medicine_process_search_visible_content( $search_result->_source->content );

								echo wp_kses_post( $visible_content );
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
