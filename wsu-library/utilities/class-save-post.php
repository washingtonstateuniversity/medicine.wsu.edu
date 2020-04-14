<?php namespace WSU\THeme\Medicine;

/**
 * Use this class as a base for saving post data. The save-post method should be called using
 * the save_post_{posttype} hook.
 *
 * @version: 2.0.0
 * @package https://github.com/washingtonstateuniversity/wsuwp-code-library/blob/master/post/class-save-post.php
 */

class Save_Post {


	protected $args = array(
		'nonce'        => false, // Nonce name to use when validating.
		'nonce_action' => false, // Nonce action to use when validating.
		'only_update'  => true, // Only do save action on update post (not create post).
		'on_autosave'  => false, // Save on autosave - probably not a good idea
	);

	/**
	 * Array of settings to save.
	 * @var array $save_options_array. Options array supports the following settings.
	 *  option_key => save_options - see $save_options_defaults for options and defaults
	 * @since 0.0.1
	 */
	protected $settings = array();

	/**
	 * Set up the Save_Post class.
	 * @since 0.0.1
	 *
	 * @param false|array  $options        Save options with the structure of $save_options_array
	 */
	public function __construct( $settings = array(), $args = array() ) {

		array_walk( $settings, array( $this, 'parse_setting' ) );

		$this->settings     = $settings;
		$this->args         = array_merge( $this->args, $args );  

	} // End __construct


	protected function parse_setting( &$setting_args, $key ) {

		$default_setting_args = array(
			'sanitize_type'     => 'text',  // Type of content to sanitize (optional)
			'sanitize_callback' => false,  // Custom callback to use to sanitize the value (optional).
			'save_default'      => false,  // Save default value if input field is empty (optional).
			'default_value'     => '',     // Default value to save if save_default is true (optional).
		);

		$setting_args = array_merge( $default_setting_args, $setting_args );

	}


	/**
	 * Sanitize the value using the given method.
	 * @since 0.0.1
	 *
	 * @param variable $value              Value to sanitize.
	 * @param string   $type               Type of sanitation to use.
	 * @param variable $sanitize_callback  Custom function to sanitize value.
	 */
	public function sanitize_value( $value, $key, $sanitize_callback = false ) {

		// Check if it has a sanitize callback that works
		if ( ! empty( $sanitize_callback ) && is_callable( $sanitize_callback ) ) {

			return call_user_func( $sanitize_callback, $value );

		} else {

			return sanitize_text_field( $value );
			
		} // End if

	} // End sanitize_value


	/**
	 * Method to save post data
	 * @since 0.0.1
	 *
	 * @param int      $post_id  ID of the post being saved.
	 * @param WP_Post  $post     WP_Post object of the post being saved.
	 * @param bool     $update   Is this a post being updated or created.
	 */
	public function save_post( $post_id, $post, $update ) {

		if ( true === $this->check_can_save( $post_id, $post, $update ) ) {

			//OK, lets save something
			$settings = $this->settings;

			// Loop through all the save options
			foreach ( $settings as $key => $settings_args ) {

				// Check if the key has been sent
				if ( isset( $_REQUEST[ $key ] ) ) {

					$value = $_REQUEST[ $key ];

					$save_value = $this->sanitize_value(
						$value,
						$key,
						$settings_args['sanitize_callback']
					);

					if ( ! is_wp_error( $save_value ) ) {

						// Save
						update_post_meta( $post_id, $key, $save_value );

					} // End if
				} // End if
			} // End foreach
		} // End if
	} // End save_post


	/**
	 * Check if the data can or should be saved.
	 * @since 0.0.1
	 *
	 * @param int      $post_id  ID of the post being saved.
	 * @param WP_Post  $post     WP_Post object of the post being saved.
	 * @param bool     $update   Is this a post being updated or created.
	 *
	 * @return bool True if save is OK.
	 */
	public function check_can_save( $post_id, $post, $update ) {

		// Check if save on update
		if ( $this->args['only_update'] && ! $update ) {

			return false;

		} // End if

		// Check if doing autosave
		if ( ! $this->args['on_autosave'] && defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {

			return false;

		} // End if

		// If this is a revision, abort
		if ( wp_is_post_revision( $post_id ) ) {

			return false;

		} // End if

		// Verify the nonce before proceeding.
		if ( ! isset( $_REQUEST[ $this->args['nonce'] ] ) || ! wp_verify_nonce( $_REQUEST[ $this->args['nonce'] ], $this->args['nonce_action'] ) ) {

			return false;

		} // End if

		// Check if the current user has permission to edit the post.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {

			return false;

		} // End if

		return true;

	} // End check_can_save

}
