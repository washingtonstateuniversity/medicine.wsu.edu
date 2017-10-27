<?php

namespace WSU\Medicine\Content_Syndicate;

add_filter( 'wsuwp_content_syndicate_json_output', 'WSU\Medicine\Content_Syndicate\wsuwp_json_output', 10, 3 );

/**
 * Provide fallback URLs if thumbnail sizes have not been generated
 * for a post pulled in with content syndicate.
 *
 * @since 0.1.11
 *
 * @param \stdClass $content
 * @param array     $atts    Array of attributes passed to the shortcode.
 *
 * @return string
 */
function get_image_url( $content, $atts = array() ) {
	// Use the full thumbnail if not pulling from the internal news site.
	if ( ! in_array( $atts['host'], array( 'medicine.wsu.edu/internal-news/', 'medicine.wsu.edu/internal-news' ), true ) ) {
		return $content->thumbnail;
	}

	// If no embedded featured media exists, use the full thumbnail.
	if ( ! isset( $content->featured_media )
		|| ! isset( $content->featured_media->media_details )
		|| ! isset( $content->featured_media->media_details->sizes ) ) {
		return $content->thumbnail;
	}

	$sizes = $content->featured_media->media_details->sizes;

	if ( isset( $sizes->{'spine-large_size'} ) ) {
		return $sizes->{'spine-large_size'}->source_url;
	}

	if ( isset( $sizes->{'spine-medium_size'} ) ) {
		return $sizes->{'spine-medium_size'}->source_url;
	}
	if ( isset( $sizes->{'spine-small_size'} ) ) {
		return $sizes->{'spine-small_size'}->source_url;
	}

	if ( isset( $sizes->{'full'} ) ) {
		return $sizes->{'full'}->source_url;
	}

	return $content->thumbnail;
}

/**
 * Provide custom output for the wsuwp_json shortcode.
 *
 * @param string $content
 * @param array  $data
 * @param array  $atts
 *
 * @return string
 */
function wsuwp_json_output( $content, $data, $atts ) {
	// Provide a default output for when no `output` attribute is included.
	if ( 'json' === $atts['output'] ) {
		ob_start();
		?>
		<div class="deck">
			<?php
			$offset_x = 0;
			foreach ( $data as $content ) {
				if ( $offset_x < absint( $atts['offset'] ) ) {
					$offset_x++;
					continue;
				}

				if ( ! empty( $content->thumbnail ) ) {
					$classes = 'card--has-image';
				} else {
					$classes = '';
				}
				?>
				<article class="card card--news <?php echo esc_attr( $classes ); ?>">
					<?php if ( ! empty( $content->thumbnail ) ) : ?>
					<?php $image_url = get_image_url( $content, $atts ); ?>
					<figure class="card-image">
						<a href="<?php echo esc_url( $content->link ); ?>"><img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $content->featured_media->alt_text ); ?>"></a>
					</figure>
					<?php endif; ?>
					<header class="card-title">
						<a href="<?php echo esc_url( $content->link ); ?>"><?php echo esc_html( $content->title ); ?></a>
					</header>
					<div class="card-date"><?php echo esc_html( date( $atts['date_format'], strtotime( $content->date ) ) ); ?></div>
					<div class="card-excerpt">
						<?php echo wp_kses_post( $content->excerpt ); ?>
					</div>
				</article>
				<?php
			}
			?>
		</div>
		<?php
		$content = ob_get_contents();
		ob_end_clean();
	}
	return $content;
}
