<?php

if ( class_exists( 'bcn_breadcrumb' ) ) {
	$breadcrumb_display = apply_filters( 'medicine_filter_breadcrumb', bcn_display( true ) );
}

// @codingStandardsIgnoreStart
if ( ! is_front_page() && ! is_home() && spine_display_breadcrumbs( 'bottom' ) ) {
	?><section class="row single breadcrumbs breadcrumbs-bottom gutter pad-top" typeof="BreadcrumbList" vocab="http://schema.org/">
	<div class="column one"><?php echo $breadcrumb_display; ?></div>
	</section><?php
}
// @codingStandardsIgnoreEnd
