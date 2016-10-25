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
			total = parseInt( $graph.data( "total" ).replace( /,/g, "" ), 10 ),
			prefix = $graph.data( "prefix" );

		$( document ).on( "scroll", function() {
			if ( !in_viewport( $graph ) || $graph.hasClass( "animated" ) ) {
				return;
			}

			$graph.addClass( "animated" ).find( "li" ).each( function( i ) {
				var $bar = $( this ),
					value = parseInt( $bar.find( ".value" ).html().split( prefix ).pop().replace( /,/g, "" ), 10 ),
					percentage = value / total * 100;

				setTimeout( function() {
					$bar.animate( {
						width: percentage + "%"
					}, 2000 ).find( ".value" ).prop( "Counter", 0 ).animate( {
						Counter: value
						}, {
							duration: 2000,
							easing: "swing",
							step: function( now ) {
							$( this ).text( prefix + Math.ceil( now ).toLocaleString( "en" ) );
						}
					} );
				}, i * 100 );
			} );
		} );
	};

	/**
	 * Fire any actions that we need to happen once the document is ready.
	 */
	$( document ).ready( function() {
		animate_graph();
	} );
}( jQuery, window, document ) );
