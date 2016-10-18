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
	<address class="footer-contact-info">
		<span class="dept-name address-item">Elson S. Floyd College of Medicine</span> | <span class="street-address address-item">Washington State University, PO Box 1495, Spokane, WA 99210-1495</span> | <a class="email-address address-item" href="mailto:medicine@wsu.edu">medicine@wsu.edu</a> | <a class="telephone-number address-item" href="tel:5093387944"></a>509-338-7944
	</address>
	<nav class="global-links">
		<ul>
			<li><a href="https://wsu.edu">Washington State Univerity</a></li>
			<li><a href="https://my.wsu.edu">myWSU</a></li>
			<li><a href="https://accesscenter.wsu.edu/">Accessability</a></li>
			<li><a href="https://policies.wsu.edu/">Policies</a></li>
			<li><a href="https://ucomm.wsu.edu/wsu-copyright-policy/">&copy;</a></li>
		</ul>
	</nav>
</footer>