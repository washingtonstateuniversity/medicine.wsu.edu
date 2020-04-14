<?php namespace WSU\THeme\Medicine;

class Form_Fields {


	public static function multi_checkbox( $name, $args = array() ) {

		$default_args = array(
			'label' => '',
			'choices' => '',
			'current_value' => '',
			'wrapper_class' => '',
			'checkbox_class' => '',
			'id' => uniqid( 'checkbox_group_' ),
		);

		$args = array_merge( $default_args, $args );

		include __DIR__ . '/templates/field-multi-checkbox.php';

	}


	public static function select( $name, $args = array() ) {

		$default_args = array(
			'label' => '',
			'choices' => '',
			'current_value' => '',
			'wrapper_class' => '',
			'class' => '',
			'id' => uniqid( 'checkbox_group_' ),
		);

		$args = array_merge( $default_args, $args );

		include __DIR__ . '/templates/field-select.php';

	}

}