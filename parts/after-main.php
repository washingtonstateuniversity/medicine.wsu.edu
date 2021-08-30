<?php

$medicine_footer_menu_args = array(
	'theme_location' => 'site-footer-menu',
	'menu' => 'site-footer-menu',
	'container' => false,
	'menu_class' => null,
	'menu_id' => null,
	'items_wrap' => '<ul>%3$s</ul>',
	'depth' => 3,
);

?>
<footer class="site-footer bleed-full single">
	<nav class="footer-nav">
		<?php wp_nav_menu( $medicine_footer_menu_args ); ?>
	</nav>
	<div class="wsu-signature">
		<a href="https://wsu.edu"><img src="<?php echo esc_url( get_stylesheet_directory_uri() ); ?>/images/wsu-logo-wht.svg" alt="Washington State University logo"></a>
	</div>
	<div class="footer-contact-wrapper">
		<ul class="social-media">
					<li>
				<a class="ripple facebook" href="https://facebook.com/wsumedicine">Facebook</a>
			</li>
					<li>
				<a class="ripple twitter" href="https://twitter.com/wsumedicine">Twitter</a>
			</li>
					<li>
				<a class="ripple instagram" href="https://instagram.com/wsumedicine">Instagram</a>
			</li>
			<li>
				<a class="ripple youtube" href="http://www.youtube.com/gowsuspokane">YouTube</a>
			</li>
			<li>
				<a class="ripple linkedin" href="https://www.linkedin.com/company/wsu-elson-s-floyd-college-of-medicine">LinkedIn</a>
			</li>
					<li>
				<a class="ripple back-to-top" href="#">Back to top</a>
			</li>
		</ul>
		<address class="footer-contact-info">
			<span class="dept-name address-item"><?php echo esc_html( spine_get_option( 'contact_department' ) ); ?></span>
			<span class="street-address address-item"><?php
			if ( spine_get_option( 'contact_streetAddress' ) !== '' ) {
				echo esc_html( spine_get_option( 'contact_streetAddress' ) . ' ' );
			}
			if ( spine_get_option( 'contact_addressLocality' ) !== '' ) {
				echo esc_html( spine_get_option( 'contact_addressLocality' ) . ' ' );
			}
			if ( spine_get_option( 'contact_postalCode' ) !== '' ) {
				echo esc_html( spine_get_option( 'contact_postalCode' ) );
			}
			?></span>
			<?php if ( spine_get_option( 'contact_email' ) !== '' ) { ?>
			<a class="email-address address-item" href="mailto:<?php echo esc_attr( spine_get_option( 'contact_email' ) ); ?>"><?php echo esc_html( spine_get_option( 'contact_email' ) ); ?></a>
			<?php } ?>
			<?php if ( spine_get_option( 'contact_telephone' ) !== '' ) { ?>
			<a class="telephone-number address-item" href="tel:<?php echo esc_attr( spine_get_option( 'contact_telephone' ) ); ?>"><?php echo esc_html( spine_get_option( 'contact_telephone' ) ); ?></a>
			<?php } ?>
		</address>
	</div>
	<nav class="global-links">
		<ul>
			<li><a href="https://wsu.edu">Washington State University</a></li>
			<li><a href="https://my.wsu.edu">myWSU</a></li>
			<li><a href="https://accesscenter.wsu.edu/">Accessibility</a></li>
			<li><a href="https://policies.wsu.edu/">Policies</a></li>
			<li><a href="https://ucomm.wsu.edu/wsu-copyright-policy/">&copy;</a></li>
		</ul>
	</nav>
</footer>
