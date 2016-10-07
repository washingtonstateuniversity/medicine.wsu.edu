/* global YT */
( function( $, window ) {
	/**
	 * Track whether a scroll event has been set.
	 *
	 * @type {boolean}
	 */
	var scroll_event_set = false;

	/**
	 * Track the initial position of a video on the screen.
	 *
	 * @type {number}
	 */
	var video_off_screen_position = 0;

	/**
	 * Create a script element to load in the YouTube iFrame API and insert it
	 * into the document.
	 */
	var load_youtube = function() {
		var tag = document.createElement( "script" );

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName( "script" )[ 0 ];
		firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );
	};

	/**
	 * Place a playing video into an on-page or off-page state depending on
	 * its location in the page when scrolling.
	 */
	var handle_scroll_event = function() {
		var video = $( ".video-wrap-control" );
		var video_off_screen = ( 0 <= $( window ).scrollTop() - video_off_screen_position );

		if ( video_off_screen && !video.hasClass( "video-in-scroll" ) ) {
			video.addClass( "video-in-scroll" );
		}

		if ( !video_off_screen && video.hasClass( "video-in-scroll" ) ) {
			video.removeClass( "video-in-scroll" );
		}
	};

	/**
	 * Callback function expected by the YouTube Iframe API. Without a function
	 * with this name available in the global space, our use of the YouTube API
	 * does not work.
	 *
	 * Loop through each of the inline YouTube Videos, gather the video information,
	 * and set up objects representing the videos.
	 */
	window.onYouTubeIframeAPIReady = function() {
		$( ".inline-youtube-video" ).each( function() {
			var video_id = $( this ).data( "video-id" ),
				video_height = $( this ).data( "video-height" ),
				video_width = $( this ).data( "video-width" );

			new YT.Player( "youtube-video-" + video_id, {
				height: video_height,
				width: video_width,
				videoId: video_id,
				playerVars: {
					modestbranding: 1,
					showinfo: 0,
					controls: 1,
					rel: 0
				},
				events: {
					"onReady": window.onPlayerReady,
					"onStateChange": window.onPlayerStateChange
				}
			} );
		} );
	};

	/**
	 * Callback function expected by the YouTube iFrame API based on our specification
	 * in the events data above. We use this to attach a click event to any text with
	 * a class of `start-{video_id}`. This allows initial interaction with the video to
	 * begin inside the document.
	 *
	 * @param event
	 */
	window.onPlayerReady = function( ) {
		video_off_screen_position = $( ".video-wrap-control" ).offset().top;
	};

	/**
	 * Bind and unbind the scrolling event when the state of a video changes
	 * between play and anything else.
	 *
	 * @param event
	 */
	window.onPlayerStateChange = function( event ) {
		if ( "undefined" === typeof event ) {
			return;
		}

		if ( 1 === event.data && false === scroll_event_set ) {
			$( document ).on( "scroll", handle_scroll_event );
			scroll_event_set = true;
		}

		if ( 1 !== event.data && true === scroll_event_set ) {
			$( document ).unbind( "scroll", handle_scroll_event );
			scroll_event_set = false;
		}
	};

	/**
	 * Fire any actions that we need to happen once the document is ready.
	 */
	$( document ).ready( function() {
		load_youtube();
	} );
}( jQuery, window ) );

//# sourceMappingURL=video.js.map