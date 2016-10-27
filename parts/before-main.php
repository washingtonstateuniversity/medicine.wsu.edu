<?php
$medicine_global_top_menu_args = array(
	'theme_location' => 'global-top-menu',
	'menu' => 'global-top-menu',
	'container' => false,
	'menu_class' => null,
	'menu_id' => null,
	'items_wrap' => '<ul>%3$s</ul>',
	'depth' => 1,
);

?>
	<div class="global-bar-wrap">
		<div class="global-bar">
			<a class="global-home" href="https://wsu.edu">Washington State University</a>
		</div>
	</div>
	<div id="contact-search" class="site-search">
		<?php wp_nav_menu( $medicine_global_top_menu_args ); ?>
	</div>
<?php

get_template_part( 'spine' );
