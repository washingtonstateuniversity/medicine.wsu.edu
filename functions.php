<?php

require_once __DIR__ . '/includes/class-wsu-home-youtube-embed.php';
require_once __DIR__ . '/includes/class-medicine-bar-graph-shortcode.php';
require_once __DIR__ . '/includes/content-syndicate.php';
require_once __DIR__ . '/includes/constant-contact.php';

add_filter( 'spine_child_theme_version', 'medicine_theme_version' );
function medicine_theme_version() {
	return '0.2.2';
}

add_action( 'init', 'medicine_remove_spine_wp_enqueue_scripts' );
function medicine_remove_spine_wp_enqueue_scripts() {
	remove_action( 'wp_enqueue_scripts', 'spine_wp_enqueue_scripts', 20 );
}

add_filter( 'spine_get_campus_home_url', 'medicine_spine_campus_home_url' );
function medicine_spine_campus_home_url() {
	return esc_url( spine_get_option( 'contact_url' ) );
}

add_filter( 'spine_get_campus_data', 'medicine_spine_campus_data' );
function medicine_spine_campus_data() {
	return esc_html( spine_get_option( 'contact_department' ) );
}

add_action( 'wp_enqueue_scripts', 'medicine_spine_wp_enqueue_scripts', 20 );
/**
 * Enqueue scripts and styles required for front end pageviews.
 */
function medicine_spine_wp_enqueue_scripts() {

	$spine_version = spine_get_option( 'spine_version' );
	// This may be an unnecessary check, but we don't want to screw this up.
	if ( 'develop' !== $spine_version && 0 === absint( $spine_version ) ) {
		$spine_version = 1;
	}

	// Much relies on the main stylesheet provided by the WSU Spine.
	wp_enqueue_style( 'wsu-spine', 'https://repo.wsu.edu/spine/' . $spine_version . '/spine.min.css', array(), spine_get_script_version() );
	wp_enqueue_style( 'spine-theme', get_template_directory_uri() . '/style.css', array( 'wsu-spine' ), spine_get_script_version() );
	wp_enqueue_style( 'spine-theme-child', get_stylesheet_directory_uri() . '/style.css', array( 'wsu-spine' ), spine_get_child_version() );
	wp_enqueue_style( 'spine-theme-print', get_template_directory_uri() . '/css/print.css', array(), spine_get_script_version(), 'print' );

	// All theme styles have been output at this time. Plugins and other themes should print styles here, before blocking
	// Javascript resources are output.
	do_action( 'spine_enqueue_styles' );

	$google_font_css_url = '//fonts.googleapis.com/css?family=';
	$count = 0;
	$spine_open_sans = spine_get_open_sans_options();

	// Build the URL used to pull additional Open Sans font weights and styles from Google.
	if ( ! empty( $spine_open_sans ) ) {
		$build_open_sans_css = '';
		foreach ( $spine_open_sans as $font_option ) {
			if ( 0 === $count ) {
				$build_open_sans_css = 'Open+Sans%3A' . $font_option;
			} else {
				$build_open_sans_css .= '%2C' . $font_option;
			}

			$count++;
		}

		if ( 0 !== $count ) {
			$google_font_css_url .= $build_open_sans_css;
		} else {
			$google_font_css_url = '';
		}
	} else {
		$google_font_css_url = '';
	}

	$spine_open_sans_condensed = spine_get_open_sans_condensed_options();

	$condensed_count = 0;
	if ( ! empty( $spine_open_sans_condensed ) ) {
		if ( 0 !== $count ) {
			$build_open_sans_cond_css = '|Open+Sans+Condensed%3A';
		} else {
			$build_open_sans_cond_css = 'Open+Sans+Condensed%3A';
		}

		foreach ( $spine_open_sans_condensed as $font_option ) {
			if ( 0 === $condensed_count ) {
				$build_open_sans_cond_css .= $font_option;
			} else {
				$build_open_sans_cond_css .= '%2C' . $font_option;
			}

			$count++;
			$condensed_count++;
		}

		$google_font_css_url .= $build_open_sans_cond_css;
	}

	// Only enqueue a custom Google Fonts URL if extra options have been selected for Open Sans.
	if ( '' !== $google_font_css_url ) {
		$google_font_css_url .= '&subset=latin,latin-ext';

		// Deregister the default Open Sans URL provided by WordPress core and instead provide our own.
		wp_deregister_style( 'open-sans' );
		wp_enqueue_style( 'open-sans', $google_font_css_url, array(), false );
	}

	// WordPress core provides much of jQuery UI, but not in a nice enough package to enqueue all at once.
	// For this reason, we'll pull the entire package from the Google CDN.
	wp_enqueue_script( 'wsu-jquery-ui-full', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js', array( 'jquery' ) );

	// Much relies on the main Javascript provided by the WSU Spine.
	wp_enqueue_script( 'wsu-spine', get_stylesheet_directory_uri() . '/js/spine.min.js', array( 'wsu-jquery-ui-full' ), spine_get_child_version(), false );

	// Override default options in the WSU Spine.
	$twitter_text = ( is_front_page() ) ? get_option( 'blogname' ) : trim( wp_title( '', false ) );
	$spineoptions = array(
		'social' => array(
			'share_text' => esc_js( spine_get_title() ),
			'twitter_text' => esc_js( $twitter_text ),
			'twitter_handle' => 'wsupullman',
		),
	);
	// If a Twitter account has been added in the Customizer, use that for the via handle.
	$spine_social_options = spine_social_options();
	if ( isset( $spine_social_options['twitter'] ) ) {
		$twitter_array = array_filter( explode( '/', $spine_social_options['twitter'] ) );
		$twitter_handle = array_pop( $twitter_array );
		$spineoptions['social']['twitter_handle'] = esc_js( $twitter_handle );
	}
	wp_localize_script( 'wsu-spine', 'spineoptions', $spineoptions );

	// Enqueue jQuery Cycle2 and Genericons when a page builder template is used.
	if ( is_page_template( 'template-builder.php' ) ) {
		$has_builder_banner = get_post_meta( get_the_ID(), '_has_builder_banner', true );

		if ( $has_builder_banner ) {
			// Enqueue the compilation of jQuery Cycle2 scripts required for the slider
			wp_enqueue_script( 'wsu-cycle', get_template_directory_uri() . '/js/cycle2/jquery.cycle2.min.js', array( 'jquery' ), spine_get_script_version(), true );
			wp_enqueue_style( 'genericons', get_template_directory_uri() . '/styles/genericons/genericons.css', array(), spine_get_script_version() );
		}
	}

	// Enqueue scripting for the entire parent theme.
	wp_enqueue_script( 'wsu-spine-theme-js', get_template_directory_uri() . '/js/spine-theme.js', array( 'jquery' ), spine_get_script_version(), true );

	// Dequeue TablePress stylesheet.
	wp_dequeue_style( 'tablepress-default' );

	// Enqueue script for animating lists on posts with content containing `animate`.
	$post = get_post();
	if ( isset( $post->post_content ) && strpos( $post->post_content, 'animate' ) !== false ) {
		wp_enqueue_script( 'medicine-animated-list', get_stylesheet_directory_uri() . '/js/animated-list.min.js', array( 'jquery' ), spine_get_child_version() );
	}
}

add_filter( 'nav_menu_link_attributes', 'medicine_nav_menu_link_attributes', 20, 3 );
/**
 * Alters the anchor HREF on section label pages to output as # when building
 * a site navigation.
 *
 * @param array   $atts
 * @param object  $item
 * @param array   $args
 *
 * @return mixed
 */
function medicine_nav_menu_link_attributes( $atts, $item, $args ) {
	if ( 'site' !== $args->menu ) {
		return $atts;
	}

	if ( 'page' === $item->object && 'post_type' === $item->type ) {
		$slug = get_page_template_slug( $item->object_id );

		if ( 'templates/section-label.php' === $slug ) {
			$atts['href'] = '#';
		}
	}

	return $atts;
}
add_filter( 'nav_menu_css_class', 'medicine_nav_menu_css_class', 20, 3 );
/**
 * Assign a class of `.non-anchor` to any menu items that are custom links
 * with an href of #.
 *
 * @param $classes
 * @param $item
 * @param $args
 *
 * @return array
 */
function medicine_nav_menu_css_class( $classes, $item, $args ) {
	if ( 'site' !== $args->menu ) {
		return $classes;
	}

	if ( 'page' === $item->object && 'post_type' === $item->type ) {
		$slug = get_page_template_slug( $item->object_id );

		if ( 'templates/section-label.php' === $slug ) {
			$classes[] = 'non-anchor';
		}
	}

	if ( 'custom' === $item->object && 'custom' === $item->type && '#' === $item->url ) {
		$classes[] = 'non-anchor';
	}

	return $classes;
}

add_filter( 'nav_menu_item_id', 'medicine_nav_menu_id', 20 );
/**
 * Strips menu item IDs as navigation is built.
 *
 * @param string $id
 *
 * @return bool
 */
function medicine_nav_menu_id( $id ) {
	return false;
}

add_filter( 'wp_nav_menu_items', 'medicine_add_search_form_to_global_top_menu', 10, 2 );
/**
 * Filters the nav items attached to the global navigation and appends a
 * search form.
 *
 * @param $items
 * @param $args
 *
 * @return string
 */
function medicine_add_search_form_to_global_top_menu( $items, $args ) {
	if ( 'global-top-menu' !== $args->theme_location ) {
		return $items;
	}

	return $items . '<li class="search">' . get_search_form( false ) . '</li>';
}

add_action( 'after_setup_theme', 'medicine_nav_menu_register' );
/**
 * Register additional menus used by the theme.
 */
function medicine_nav_menu_register() {
	register_nav_menu( 'global-top-menu', 'Global Top Menu' );
	register_nav_menu( 'site-footer-menu', 'Footer Menu' );

	add_theme_support( 'html5', array( 'search-form' ) );
}

add_filter( 'medicine_filter_breadcrumb', 'medicine_modify_breadcrumb_options', 10 );
/**
 * Filters the breadcrumb divider to be an SVG image.
 *
 * This requires that the text `%svgdivider%` is entered in the BreadCrumb NavXT options.
 *
 * @param string $display
 *
 * @return string
 */
function medicine_modify_breadcrumb_options( $display ) {
	$svg_divider = '<img src="' . esc_url( get_stylesheet_directory_uri() . '/images/ico-breadcrumb-arrow-sharp.svg' ) . '">';

	return str_replace( '%svgdivide%', $svg_divider, $display );
}

add_filter( 'bcn_breadcrumb_url', 'medicine_modify_breadcrumb_url', 10, 3 );
/**
 * Removes the URL from pages that are assigned the section label template.
 *
 * @param string $url
 * @param array  $type
 * @param int    $id
 *
 * @return string|null null if a section label template, untouched URL string if not.
 */
function medicine_modify_breadcrumb_url( $url, $type, $id ) {
	if ( 1 < count( $type ) && 'post-page' === $type[1] ) {
		$slug = get_page_template_slug( $id );

		if ( 'templates/section-label.php' === $slug ) {
			return null;
		}
	}

	return $url;
}

add_filter( 'spine_default_section_classes', 'medicine_filter_section_classes', 10 );
/**
 * Filters the default classes attached to a section.
 *
 * @return string
 */
function medicine_filter_section_classes() {
	return 'pad-top';
}

add_filter( 'query_vars', 'medicine_search_query_vars_filter' );
/**
 * Adds `q` as our search query variable.
 *
 * @param $vars
 *
 * @return array
 */
function medicine_search_query_vars_filter( $vars ) {
	$vars[] = 'q';
	return $vars;
}

/**
 * Processes a search request by passing to the WSU ES server.
 *
 * @param string $var
 *
 * @return array
 */
function medicine_process_search_request( $var ) {
	$search_key = md5( 'search' . $var );
	$results = wp_cache_get( $search_key, 'search' );

	if ( $results ) {
		return $results;
	}

	$request_url = 'https://elastic.wsu.edu/wsu-web/_search?q=%2bhostname:medicine.wsu.edu%20%2b' . rawurlencode( $var );

	$response = wp_remote_get( $request_url );

	if ( is_wp_error( $response ) ) {
		return array();
	}

	if ( 200 !== wp_remote_retrieve_response_code( $response ) ) {
		return array();
	}

	$response = wp_remote_retrieve_body( $response );
	$response = json_decode( $response );

	if ( isset( $response->hits ) && isset( $response->hits->total ) && 0 === $response->hits->total ) {
		return array(); // no results found.
	}

	$search_results = $response->hits->hits;

	wp_cache_set( $search_key, $search_results, 'search', 3600 );

	return $search_results;
}

/**
 * Filters the content returned by Elastic Search for display in a search
 * results page.
 *
 * @param string $visible_content
 *
 * @return mixed|string
 */
function medicine_process_search_visible_content( $visible_content ) {
	$visible_content = preg_replace( '/[\r\n]+/', "\n", $visible_content );
	$visible_content = preg_replace( '/[ \t]+/', ' ', $visible_content );
	$visible_content = strip_tags( $visible_content, '<p><strong><em>' );
	$visible_content = trim( $visible_content );
	$visible_content = substr( $visible_content, 0, 260 );
	$visible_content = force_balance_tags( $visible_content . '....' );
	$visible_content = wpautop( $visible_content, false );

	return $visible_content;
}

add_action( 'template_redirect', 'medicine_redirect_old_search_requests' );
/**
 * Redirect old search URL requests to the new search URL.
 */
function medicine_redirect_old_search_requests() {
	if ( is_search() ) {
		wp_redirect( home_url( '/search/?q=' . get_query_var( 's' ) ) );
		exit;
	}
}

/**
 * Determine what should be displayed in the spine's main header area for the
 * sub and sub sections.
 *
 * @return array List of elements for output in main header.
 */
function medicine_get_main_header() {
	$main_header = array(
		'name' => '',
		'description' => '',
	);

	// Top level pages show their title. Sub pages show their parent's title.
	if ( is_page() ) {
		$_post = get_post();

		if ( $_post->post_parent ) {
			$main_header['description'] = get_the_title( $_post->post_parent );
		} else {
			$main_header['description'] = get_the_title();
		}
	} elseif ( is_singular( 'post' ) ) {
		$main_header['description'] = 'News';
	} elseif ( is_singular( 'tribe_events' ) ) {
		$main_header['description'] = 'Events';
	} elseif ( is_archive() ) {
		if ( is_category() ) {
			$main_header['description'] = 'Category: ' . single_cat_title( '', false );
		} elseif ( is_tag() ) {
			$main_header['description'] = 'Tag: ' . single_tag_title( '', false );
		} elseif ( is_day() ) {
			$month_object = DateTime::createFromFormat( '!m', get_query_var( 'monthnum' ) );
			$month_name = $month_object->format( 'F' );
			$main_header['description'] = 'Archive: ' . $month_name . ' ' . get_query_var( 'day' ) . ', ' . get_query_var( 'year' );
		} elseif ( is_month() ) {
			$month_object = DateTime::createFromFormat( '!m', get_query_var( 'monthnum' ) );
			$month_name = $month_object->format( 'F' );
			$main_header['description'] = 'Archive: ' . $month_name . ' ' . get_query_var( 'year' );
		} elseif ( is_year() ) {
			$main_header['description'] = 'Archive: ' . get_query_var( 'year' );
		} elseif ( is_author() ) {
			$main_header['description'] = get_the_author();
		} elseif ( is_post_type_archive( 'tribe_events' ) ) {
			$main_header['description'] = 'Events';
		} else {
			$main_header['description'] = 'Archives';
		}
	} elseif ( is_404() ) {
		$main_header['description'] = 'Page not found';
	}

	if ( is_search() ) {
		$main_header['description'] = 'Search';
	}

	if ( is_home() ) {
		$page_for_posts = absint( get_option( 'page_for_posts', 0 ) );
		$main_header['description'] = get_the_title( $page_for_posts );
	}

	return $main_header;
}

add_filter( 'wsuwp_search_public_status', 'medicine_search_public_status' );
/**
 * Adds support for search indexing while also set as a private site.
 *
 * @return int
 */
function medicine_search_public_status() {
	return 1;
}

add_action( 'wp_footer', 'medicine_seattle_times_javascript' );
/**
 * Adds the tracking script required by Seattle Times
 */
function medicine_seattle_times_javascript() {
	?>
	<script type="text/javascript">
		(function () {
			var tagjs = document.createElement("script");
			var s = document.getElementsByTagName("script")[0];
			tagjs.async = true;
			tagjs.src = "https://s.btstatic.com/tag.js#site=tjFVGKS";
			s.parentNode.insertBefore(tagjs, s);
		}());
	</script>
	<noscript>
		<iframe src="https://s.thebrighttag.com/iframe?c=tjFVGKS" width="1" height="1"
				frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
	</noscript>
	<?php
}
