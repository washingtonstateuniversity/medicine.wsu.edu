( function( $, window, document ) {

	/**
	 * Check if at least half of the element to be animated is in the viewport.
	 */
	function inViewport( element ) {
		if ( element instanceof jQuery ) {
			element = element[ 0 ];
		}

		var rect = element.getBoundingClientRect();

		return rect.bottom > 0 &&
			rect.right > 0 &&
			rect.left < ( window.innerWidth || document.documentElement.clientWidth ) &&
			rect.top + rect.height / 2 < ( window.innerHeight || document.documentElement.clientHeight );
	}

	/**
	 * When an element to be animated is scrolled into the viewport, remove the `animate`
	 * class from it and add the `animated` class to its list items at short intervals.
	 */
	function animateElement() {
		var $elementsToAnimate = $( ".animate" );

		$elementsToAnimate.each( function() {
			var $element = $( this ),
				interval = ( $element.hasClass( "flowchart" ) ) ? 600 : 200;

			// For timelines, wrap the contents of each list item in two divs.
			// (This is kind of silly and exclusively for styling purposes.)
			if ( $element.hasClass( "timeline" ) ) {
				$element.children( "li" ).each( function() {
					$( this ).wrapInner( "<div><div></div></div>" );
				} );
			}

			$( document ).on( "scroll", function() {
				if ( !inViewport( $element ) ) {
					return;
				}

				$element.removeClass( "animate" ).children( "li" ).each( function( i ) {
					var $item = $( this );

					setTimeout( function() {
						$item.addClass( "animated" );
					}, i * interval );
				} );
			} );
		} );
	}

	/**
	 * Fire any actions that we need to happen once the document is ready.
	 */
	$( document ).ready( function() {
		animateElement();
	} );
}( jQuery, window, document ) );

//# sourceMappingURL=animated-list.js.map