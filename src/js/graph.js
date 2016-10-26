( function( $, window, document ) {

	/**
	 * Check if the graph is in the viewport.
	 */
	var in_viewport = function( graph ) {
		if ( graph instanceof jQuery ) {
			graph = graph[ 0 ];
		}

		var rect = graph.getBoundingClientRect();

		return rect.bottom > 0 &&
			rect.right > 0 &&
			rect.left < ( window.innerWidth || document.documentElement.clientWidth ) &&
			rect.top < ( window.innerHeight || document.documentElement.clientHeight );
	};

	/**
	 * Animate the graph when it is scrolled into the viewport.
	 */
	var animate_graph = function() {
		var $graph = $( ".bargraph" ),
			total = $graph.data( "total" ),
			prefix = $graph.data( "prefix" );

		$( document ).on( "scroll", function() {
			if ( !in_viewport( $graph ) || $graph.hasClass( "animated" ) ) {
				return;
			}

			$graph.addClass( "animated" ).find( "li" ).each( function( i ) {
				var $bar = $( this ),
					$value = $bar.find( ".value" ),
					amount = $value.data( "amount" ),
					percentage = amount / total * 100;

				// Fire each animation at short intervals.
				setTimeout( function() {

					// Animate the bar's width to it's final percentage.
					$bar.css( "width", percentage + "%" );

					// Animate the element's value from x to y:
					$( { currentAmount: 0 } ).animate( { currentAmount: amount }, {
						duration: 1500,
						easing: "swing",
						step: function() {
							$value.text( prefix + commaSeparateNumber( Math.round( this.currentAmount ) ) );
						}
					} );
				}, i * 150 );
			} );
		} );
	};

	/**
	 * Returns a comma separated number.
	 *
	 * Sourced from http://stackoverflow.com/questions/16227858/jquery-increment-number-using-animate-with-comma
	 *
	 * @param val
	 * @returns {*}
	 */
	function commaSeparateNumber( val ) {
		while ( /(\d+)(\d{3})/.test( val.toString() ) ) {
			val = val.toString().replace( /(\d)(?=(\d\d\d)+(?!\d))/g, "$1," );
		}
		return val;
	}

	/**
	 * Fire any actions that we need to happen once the document is ready.
	 */
	$( document ).ready( function() {
		animate_graph();
	} );
}( jQuery, window, document ) );
