<div class="wsu-a-form-field__wrapper wsu-a-form-field__select">
	<?php if ( ! empty( $args['label'] ) ) : ?><legend><?php echo esc_html( $args['label'] ); ?></legend><?php endif; ?>
	<select name="<?php echo esc_attr( $name ); ?>"">
		<option value="">Select...</option>
		<?php foreach ( $args['choices'] as $value => $field_label ) : ?>
		<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $value, $args['current_value'] ); ?> )><?php echo esc_html( $field_label  ); ?></option>
		<?php endforeach; ?>
	</select>
</div>
 