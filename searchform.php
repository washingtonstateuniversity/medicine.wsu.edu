<?php

?>
<form role="search" method="get" class="search-form" action="<?php echo esc_url( home_url( '/search/' ) ); ?>">
	<label>
		<span class="screen-reader-text">Search for:</span>
		<input type="search" class="search-field" placeholder="Search" value="<?php echo esc_attr( get_query_var( 'q' ) ); ?>" name="q" />
	</label>
	<input type="submit" class="search-submit" value="Search" />
</form>
