<?php $post_share_placement = spine_get_option( 'post_social_placement' ); ?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

	<?php
	if ( ! is_singular() ) {
		if ( spine_has_thumbnail_image() ) {
			?><figure class="article-thumbnail"><a href="<?php the_permalink(); ?>"><?php spine_the_thumbnail_image(); ?></a></figure><?php
		} elseif ( spine_has_featured_image() ) {
			?><figure class="article-thumbnail"><a href="<?php the_permalink(); ?>"><?php the_post_thumbnail( 'spine-thumbnail_size' ); ?></a></figure><?php
		}
	}
	?>

	<header class="article-header">
		<hgroup>
		<?php if ( is_single() ) : ?>
			<?php if ( true === spine_get_option( 'articletitle_show' ) ) : ?>
				<h1 class="article-title"><?php the_title(); ?></h1>
			<?php endif; ?>
		<?php else : ?>
			<h2 class="article-title">
				<a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a>
			</h2>
		<?php endif; ?>
		</hgroup>
		<hgroup class="source">
			<time class="article-date" datetime="<?php echo get_the_date( 'c' ); ?>"><?php echo get_the_date(); ?></time>
			<cite class="article-author">
				<?php
				if ( '1' === spine_get_option( 'show_author_page' ) ) {
					the_author_posts_link();
				} else {
					echo esc_html( get_the_author() );
				}
				?>
			</cite>
		</hgroup>

		<?php
		if ( is_singular() && in_array( $post_share_placement, array( 'top', 'both' ), true ) ) {
			get_template_part( 'parts/share-tools' );
		}
		?>
	</header>

	<?php if ( ! is_singular() ) : ?>

		<div class="article-summary">
			<?php
			// If a manual excerpt is available, default to that. If `<!--more-->` exists in content, default
			// to that. If an option is set specifically to display excerpts, default to that. Otherwise show
			// full content.
			if ( $post->post_excerpt ) {
				echo wp_kses_post( wpautop( get_the_excerpt() ) ) . ' <a href="' . esc_url( get_permalink() ) . '"><span class="excerpt-more-default">&raquo; More ...</span></a>';
			} elseif ( strstr( $post->post_content, '<!--more-->' ) ) {
				the_content( '<span class="content-more-default">&raquo; More ...</span>' );
			} elseif ( 'excerpt' === spine_get_option( 'archive_content_display' ) ) {
				the_excerpt();
			} else {
				the_content();
			}

			?>
		</div><!-- .article-summary -->
	<?php else : ?>
		<div class="article-body">
			<?php
			if ( spine_has_featured_image() ) {
				$featured_image_src = spine_get_featured_image_src();
				?>
				<figure class="featured-image">
					<?php spine_the_featured_image(); ?>
				</figure>
				<?php
			}

			the_content();

			wp_link_pages( array(
				'before' => '<div class="page-links">' . __( 'Pages:', 'spine' ),
				'after' => '</div>',
			) );
			?>
		</div>
	<?php endif; ?>

	<footer class="article-footer">
		<?php
		if ( is_singular() && in_array( $post_share_placement, array( 'bottom', 'both' ), true ) ) {
			get_template_part( 'parts/share-tools' );
		}
		?>
	<?php
	// Display site level categories attached to the post.
	if ( has_category() ) {
		echo '<dl class="categorized">';
		echo '<dt><span class="categorized-default">Categorized</span></dt>';
		foreach ( get_the_category() as $category ) {
			echo '<dd><a href="' . esc_url( get_category_link( $category->cat_ID ) ) . '">' . esc_html( $category->cat_name ) . '</a></dd>';
		}
		echo '</dl>';
	}

	// Display University categories attached to the post.
	if ( taxonomy_exists( 'wsuwp_university_category' ) && has_term( '', 'wsuwp_university_category' ) ) {
		$university_category_terms = get_the_terms( get_the_ID(), 'wsuwp_university_category' );
		if ( ! is_wp_error( $university_category_terms ) ) {
			echo '<dl class="university-categorized">';
			echo '<dt><span class="university-categorized-default">Categorized</span></dt>';

			foreach ( $university_category_terms as $term ) {
				$term_link = get_term_link( $term->term_id, 'wsuwp_university_category' );
				if ( ! is_wp_error( $term_link ) ) {
					echo '<dd><a href="' . esc_url( $term_link ) . '">' . esc_html( $term->name ) . '</a></dd>';
				}
			}
			echo '</dl>';
		}
	}

	// Display University tags attached to the post.
	if ( has_tag() ) {
		echo '<dl class="tagged">';
		echo '<dt><span class="tagged-default">Tagged</span></dt>';
		foreach ( get_the_tags() as $tag ) {
			echo '<dd><a href="' . esc_url( get_tag_link( $tag->term_id ) ) . '">' . esc_html( $tag->name ) . '</a></dd>';
		}
		echo '</dl>';
	}

	// Display University locations attached to the post.
	if ( taxonomy_exists( 'wsuwp_university_location' ) && has_term( '', 'wsuwp_university_location' ) ) {
		$university_location_terms = get_the_terms( get_the_ID(), 'wsuwp_university_location' );
		if ( ! is_wp_error( $university_location_terms ) ) {
			echo '<dl class="university-location">';
			echo '<dt><span class="university-location-default">Location</span></dt>';

			foreach ( $university_location_terms as $term ) {
				$term_link = get_term_link( $term->term_id, 'wsuwp_university_location' );
				if ( ! is_wp_error( $term_link ) ) {
					echo '<dd><a href="' . esc_url( $term_link ) . '">' . esc_html( $term->name ) . '</a></dd>';
				}
			}
			echo '</dl>';
		}
	}
	?>
	</footer><!-- .entry-meta -->

</article>
