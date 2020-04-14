<fieldset>
<?php if ( ! empty( $args['label'] ) ) : ?><legend><?php echo esc_html( $args['label'] ); ?></legend><?php endif; ?>
	<?php foreach ( $args['choices'] as $value => $checkbox_label ) : ?>
	<label><input class="wsuwp-a-metabox-<?php echo esc_attr( $args['id'] ); ?>__checkbox" type="checkbox" value="<?php echo esc_attr( $value ); ?>"><span><?php echo esc_html( $checkbox_label  ); ?></span></label>
	<?php endforeach; ?>
	<input type="hidden" id="wsuwp-a-metabox-<?php echo esc_attr( $args['id'] ); ?>__checkbox__list" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $args['current_value'] ); ?>" />
	<script>
		var wsu_field_multi_checkbox_<?php echo esc_attr( $args['id'] ); ?> = document.getElementsByClassName('wsuwp-a-metabox-<?php echo esc_attr( $args['id'] ); ?>__checkbox');
		var wsu_field_multi_checkbox_<?php echo esc_attr( $args['id'] ); ?>_on_change = function() {
			var values = [];
			for (i = 0; i < wsu_field_multi_checkbox_<?php echo esc_attr( $args['id'] ); ?>.length; i++) {
				var checkbox = wsu_field_multi_checkbox_<?php echo esc_attr( $args['id'] ); ?>[i];
				if( checkbox.checked ) {
					values.push( checkbox.value );
				}
			}
			document.getElementById('wsuwp-a-metabox-<?php echo esc_attr( $args['id'] ); ?>__checkbox__list').value = values.join(',');
		};
		for (i = 0; i < wsu_field_multi_checkbox_<?php echo esc_attr( $args['id'] ); ?>.length; i++) {
			wsu_field_multi_checkbox_<?php echo esc_attr( $args['id'] ); ?>[i].addEventListener(
			"change", function() {
				wsu_field_multi_checkbox_<?php echo esc_attr( $args['id'] ); ?>_on_change()
			});
		}
	</script>
 </fieldset>