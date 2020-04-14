<?php namespace WSU\Theme\Medicine;

class Side_Menu {


	public function __construct() {

		if ( is_admin() ) {

			require_once get_stylesheet_directory() . '/wsu-library/forms/form-fields/form-fields.php';

		}
	

	}


	public function init() {

		add_action( 'add_meta_boxes', __CLASS__ . '::register_metabox' );

		add_action( 'save_post', __CLASS__ . '::save', 10, 3 );

		add_action( 'spine_theme_template_before_main', __CLASS__ . '::add_nav', 10, 1 );

	}


	public static function add_nav( $template ) {

		if ( is_singular( 'page' ) ) {

			$current_value = get_post_meta( get_the_ID(), 'wsuwp_medicine_side_nav', true );

			include get_stylesheet_directory() . '/parts/site-nav-vertical.php';

		}

	}


	public static function register_metabox() {

		$screens = array( 'page' );

		foreach ( $screens as $screen ) {

			add_meta_box(
				'wsuwp_theme_medicine_side_nav',
				'Side Navigation',
				__CLASS__ . '::the_metabox',
				$screen,
				'side'
			);
		}

	}

	public static function the_metabox( $post ) {

		$current_value = get_post_meta( $post->ID, 'wsuwp_medicine_side_nav', true );

		wp_nonce_field( 'medicine_nav_save', 'medicine_nav' );

		$menus = get_terms( 'nav_menu' );

		$choices = array();

		foreach ( $menus as $menu ) {

			$choices[ $menu->term_id ] = $menu->name;

		}

		Form_Fields::select(
			'wsuwp_medicine_side_nav',
			array(
				'choices'       => $choices,
				'current_value' => $current_value,
			)
		);

	}


	public static function save( $post_id, $post, $update ) {

		require_once get_stylesheet_directory() . '/wsu-library/utilities/class-save-post.php';

		$save_settings = array(
			'wsuwp_medicine_side_nav' => array(),
		);

		$save_args = array(
			'nonce' => 'medicine_nav',
			'nonce_action' => 'medicine_nav_save',
		);

		$save = new Save_Post( $save_settings, $save_args );
		$save->save_post( $post_id, $post, $update );

	}


}

(new Side_Menu)->init();
