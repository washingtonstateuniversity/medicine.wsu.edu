<?php

class Medicine_Bar_Graph_Shortcode {

	/**
	 * @var string Bar graph shortcode tag.
	 */
	var $bar_graph_tag = 'medicine_bar_graph';

	/**
	 * Setup the hooks used with image shortcake.
	 */
	public function __construct() {
		add_shortcode( $this->bar_graph_tag, array( $this, 'display_medicine_bar_graph' ) );
		add_action( 'register_shortcode_ui', array( $this, 'register_medicine_bar_graph' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_graph_scripts' ) );
	}

	/**
	 * Display a bar graph that will animate once it's in the viewport.
	 *
	 * @param array $atts Shortcode attributes.
	 *
	 * @return mixed|string|void
	 */
	public function display_medicine_bar_graph( $atts ) {
		$defaults = array(
			'total' => '',
			'prefix' => '',
			'bars' => '',
		);

		$atts = shortcode_atts( $defaults, $atts );

		ob_start();
		?>
		<ul class="bargraph"
			data-total="<?php echo esc_attr( str_replace( ',', '', $atts[ 'total' ] ) ); ?>"
			data-prefix="<?php echo esc_attr( $atts[ 'prefix' ] ); ?>">
			<?php
			$bars = explode( '|', $atts['bars'] );
			if ( is_array( $bars ) ) {
				foreach ( $bars as $bar ) {
				?>
				<li>
					<?php $pair = explode( ',', $bar ); ?>
					<span class="label"><?php echo esc_html( $pair[0] ); ?></span>
					<span class="value" data-amount="<?php echo esc_attr( $pair[1] ); ?>"><?php echo esc_html( $atts[ 'prefix' ] . $pair[1] ); ?></span>
				</li>
				<?php
				}
			}
			?>
		</ul>
		<?php
		return ob_get_clean();
	}

	/**
	 * Shortcode UI setup for the bar graph shortcode.
	 */
	public function register_medicine_bar_graph() {
		$fields = array(
			array(
				'label' => 'Total',
				'description' => "The maximum value to measure the bars against.",
				'attr' => 'total',
				'type' => 'text',
			),
			array(
				'label' => 'Value prefix',
				'description' => 'A prefix for the values (optional).',
				'attr' => 'prefix',
				'type' => 'text',
			),
			array(
				'label' => 'Bars',
				'description' => 'Separate bar labels and values with a comma, and separate bar pairs with vertical pipes<br />(e.g., label,value|label,value).',
				'attr' => 'bars',
				'type' => 'text',
			),
		);

		$shortcode_ui_args = array(
			'label' => 'Animated Bar Graph',
			'listItemImage' => 'dashicons-chart-bar',
			'post_type' => array( 'post', 'page' ),
			'attrs' => $fields,
		);

		shortcode_ui_register_for_shortcode( $this->bar_graph_tag, $shortcode_ui_args );
	}

	/**
	 * Enqueue the script used on the front end.
	 */
	public function enqueue_graph_scripts() {
		$post = get_post();
		if ( isset( $post->post_content ) && has_shortcode( $post->post_content, $this->bar_graph_tag ) ) {
			wp_enqueue_script( 'medicine-bar-graph', get_stylesheet_directory_uri() . '/js/graph.min.js', array( 'jquery' ), spine_get_child_version() );
		}
	}
}

new Medicine_Bar_Graph_Shortcode();
