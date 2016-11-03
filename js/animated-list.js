( function( $, window, document ) {

	/**
	 * Check if the element to be animated is in the viewport.
	 */
	function inViewport( element ) {
		if ( element instanceof jQuery ) {
			element = element[ 0 ];
		}

		var rect = element.getBoundingClientRect();

		return rect.bottom > 0 &&
			rect.right > 0 &&
			rect.left < ( window.innerWidth || document.documentElement.clientWidth ) &&
			rect.top < ( window.innerHeight || document.documentElement.clientHeight );
	}

	/**
	 * Animate items.
	 */
	function animateElements( element, interval ) {
		element.removeClass( "animate" ).children( "li" ).each( function( i ) {
			var $item = $( this );

			setTimeout( function() {

				// Individual items in a list with the `items` class
				// should only animate once they are in the viewport.
				if (  element.hasClass( "items" ) && !inViewport( $item ) ) {
					return;
				}

				$item.addClass( "animated" );
			}, i * interval );
		} );
	}

	/**
	 * Handle animation triggering.
	 */
	function triggerAnimation() {
		var $elementsToAnimate = $( ".animate" );

		$elementsToAnimate.each( function() {
			var $element = $( this ),
				interval = ( $element.hasClass( "flowchart" ) ) ? 300 : 200;

			// For timelines, wrap the contents of each list item in two divs.
			// (This is kind of silly and exclusively for styling purposes.)
			if ( $element.hasClass( "timeline" ) ) {
				$element.children( "li" ).each( function() {
					$( this ).wrapInner( "<div><div></div></div>" );
				} );
			}

			// Trigger animation if the element is in the viewport on page load.
			if ( inViewport( $element ) ) {
				animateElements( $element, interval );
			}

			// Trigger animation if the element it scrolled into the viewport.
			$( document ).on( "scroll", function() {

				// Set the interval to 0 for lists with the `items` class.
				interval = ( $element.hasClass( "items" ) ) ? 0 : interval;

				if ( inViewport( $element ) ) {
					animateElements( $element, interval );
				}
			} );
		} );
	}

	/**
	 * Fire any actions that we need to happen once the document is ready.
	 */
	$( document ).ready( function() {
		triggerAnimation();
	} );
}( jQuery, window, document ) );

//# sourceMappingURL=animated-list.js.map