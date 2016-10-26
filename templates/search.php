<?php /* Template Name: Search */ ?>

<?php get_header(); ?>

	<main id="wsuwp-main" class="spine-sideright-template">

		<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

			<?php get_template_part( 'parts/headers' ); ?>
			<?php get_template_part( 'parts/featured-images' ); ?>

			<section class="row side-right gutter pad-ends">

				<div class="column one">

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
