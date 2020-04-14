<?php namespace WSU\THeme\Medicine;


class Sanitize {


	public static function sanitize_text( $value, $key ) {

		return sanitize_text_field( $value );

	}


	public static function sanitize_html( $value, $key ) {

		return wp_kses_post( $value );

	}

	public static function sanitize_array( $array, $key ) {

		if ( ! is_array( $array ) ) {

			return array();

		}

	}

}
