<?php
// If a featured image is assigned, apply it as an inline style to the header.
if ( spine_has_featured_image() && is_page() ) {
	$featured_image_src = spine_get_featured_image_src( 'full' );
	$featured_image_position = get_post_meta( get_the_ID(), '_featured_image_position', true );

	if ( ! $featured_image_position || sanitize_html_class( $featured_image_position ) !== $featured_image_position ) {
		$featured_image_position = '';
	}

	$medicine_header_style = 'style="background-image: url(' . esc_url( $featured_image_src ) . ');"';
} else {
	$featured_image_position = '';
	$medicine_header_style = '';
}

$main_header_elements = medicine_get_main_header();

if ( class_exists( 'bcn_breadcrumb' ) ) {
	$breadcrumb_display = apply_filters( 'medicine_filter_breadcrumb', bcn_display( true ) );
}

/**
 * @codingStandardsIgnoreStart
 *
 * `$featured_image_position` and `$medicine_header_style` are already escaped
 * above, but will throw a warning here if we do not ignore code standards.
 */
?>
<header class="main-header <?php echo $featured_image_position; ?>" <?php echo $medicine_header_style; ?>>
	<div class="hgroup">
		<h1 class="main-header-description"><?php echo esc_html( $main_header_elements['description'] ); ?></h1>
	</div>
</header>
<?php

if ( ! is_front_page() && ! is_home() && spine_display_breadcrumbs( 'top' ) ) {
	?>
	<section class="row single breadcrumbs breadcrumbs-top gutter pad-top" typeof="BreadcrumbList" vocab="http://schema.org/">
		<div class="column one"><?php echo $breadcrumb_display; ?></div>
	</section>
	<?php
}

// @codingStandardsIgnoreEnd
