<?php

?>
<header class="main-header">
	<div class="hgroup">
		<!--<div class="main-header-name">WSU College of Medicine Style Guide</div>-->
		<h1 class="main-header-description"><?php the_title(); ?></h1>
	</div>
</header>

<?php

if ( ! is_front_page() && ! is_home() && spine_display_breadcrumbs( 'top' ) ) {
	?>
	<section class="row single breadcrumbs breadcrumbs-top gutter pad-top" typeof="BreadcrumbList" vocab="http://schema.org/">
		<div class="column one"><?php bcn_display(); ?></div>
	</section>
	<?php
}

