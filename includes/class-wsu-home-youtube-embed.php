<?php

class WSU_Home_YouTube_Embed {
	public function __construct() {
		add_shortcode( 'wsu_feature_youtube', array( $this, 'display_feature_youtube' ) );
	}

	/**
	 * Display the custom iframe used for YouTube embeds on feature pages.
	 *
	 * [wsu_feature_youtube video_id="OmN5coh0heM" width="560" height="315"]
	 *
	 * @param $atts
	 *
	 * @return string
	 */
	public function display_feature_youtube( $atts ) {
		$defaults = array(
			'target_id' => '',
			'text_trigger' => '',
			'video_id' => '',
			'width' => '560',
			'height' => '315',
			'src' => '',
		);
		$atts = shortcode_atts( $defaults, $atts );

		ob_start();
		?>
		<!-- 1. The <iframe> (and video player) will replace this <div> tag. -->
		<div id="video-wrap-<?php echo esc_attr( $atts['video_id'] ); ?>" class="video-wrap-control">
			<div class="video-wrap-inner">
				<div class="inline-youtube-video"
					 id="youtube-video-<?php echo esc_attr( $atts['video_id'] ); ?>"
					 data-video-id="<?php echo esc_attr( $atts['video_id'] ); ?>"
					 data-video-width="<?php echo absint( $atts['width'] ); ?>"
					 data-video-height="<?php echo absint( $atts['height'] ); ?>"></div>
			</div>
		</div>
		<?php
		$content = ob_get_contents();
		ob_end_clean();

		wp_enqueue_script( 'medicine-video', get_stylesheet_directory_uri() . '/js/video.min.js', array( 'jquery' ), spine_get_child_version(), true );

		return $content;
	}

}
new WSU_Home_YouTube_Embed();
