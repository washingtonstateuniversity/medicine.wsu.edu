<?php /* Template Name: Search */

get_header();

?>

	<main class="spine-blank-template">

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
					<script async src="https://cse.google.com/cse.js?cx=013644890599324097824:kbqgwamjoxq"></script>
					<div class="gcse-searchresults-only" data-as_sitesearch="medicine.wsu.edu"></div>
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
