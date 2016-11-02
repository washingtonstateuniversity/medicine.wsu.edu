/* global YT */
( function( $, window ) {
	/**
	 * Tracks the number of videos playing at any given time.
	 *
	 * @type {number}
	 */
	var scroll_event_set = 0;

	/**
	 * Track the initial position of a video on the screen.
	 *
	 * @type {number}
	 */
	var video_off_screen_position = [];

	/**
	 * Tracks the IDs of the videos currently playing.
	 *
	 * @type {Array}
	 */
	var video_ids_playing = [];

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
		var video, video_off_screen;

		for ( var video_id in video_off_screen_position ) {
			if ( video_off_screen_position.hasOwnProperty( video_id ) ) {
				video = $( "#video-wrap-" + video_id );
				video_off_screen = ( 0 <= $( window ).scrollTop() - video_off_screen_position[ video_id ] );

				if ( video_off_screen && false === video.hasClass( "video-in-scroll" ) && true === video_ids_playing[ video_id ] ) {
					video.addClass( "video-in-scroll" );
				}

				if ( !video_off_screen && video.hasClass( "video-in-scroll" ) ) {
					video.removeClass( "video-in-scroll" );
				}
			}
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
	window.onPlayerReady = function( e ) {
		var video_id = $( e.target.h ).data( "video-id" );
		video_off_screen_position[ video_id ] = $( "#video-wrap-" + video_id ).offset().top;
		video_ids_playing[ video_id ] = false;
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

		var video_id = $( event.target.h ).data( "video-id" );

		if ( 1 === event.data && false === video_ids_playing[ video_id ] ) {
			video_ids_playing[ video_id ] = true;
		} else if ( 2 === event.data && true === video_ids_playing[ video_id ] ) {
			video_ids_playing[ video_id ] = false;
		}

		if ( 1 === event.data && 0 < scroll_event_set ) {
			scroll_event_set++;
		} else if ( 1 === event.data && 0 === scroll_event_set ) {
			$( document ).on( "scroll", handle_scroll_event );
			scroll_event_set = 1;
		} else if ( 2 === event.data && 1 < scroll_event_set ) {
			scroll_event_set--;
		} else if ( 2 === event.data && 1 === scroll_event_set ) {
			$( document ).unbind( "scroll", handle_scroll_event );
			scroll_event_set = 0;
		}
	};

	/**
	 * Fire any actions that we need to happen once the document is ready.
	 */
	$( document ).ready( function() {
		load_youtube();
	} );
}( jQuery, window ) );
