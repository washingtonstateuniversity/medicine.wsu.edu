 /*!
 *
 * Depends:
 *		jquery.ui.v.js
 */
/*jshint multistr: true */
( function( $ ) {
	$.extend( $.ui.spine.prototype, {
		/**
		 * Initialize the Spine framework. Fired automatically in `$.s`, found
		 * in ui.spine.js.
		 *
		 * @param {object} options
		 */
		framework_init: function( options ) {
			$.extend( this.framework_options, options );
			this._set_globals( this.framework_globals );
			this.framework_create();
		},

		/**
		 * Global framework options for the Spine framework.
		 */
		framework_options: {
			equalizer_filter: ".skip*",
			contact_template: "<address itemscope itemtype='http://schema.org/Organization' class='hcard'>" +
								"<% if (typeof(this.department) != 'undefined') { %><div class='organization-unit fn org'>" +
									"<% if (typeof(this.url) != 'undefined') { %><a href='<%this.url%>' class='url'><% } %>" +
										"<%this.department%>" +
									"<% if (typeof(this.url) != 'undefined') { %></a><% } %>" +
								"</div><% } %> " +
								"<% if (typeof(this.name) != 'undefined') { %><div class='organization-name'><%this.name%></div><% } %>" +
								"<div class='address'>" +
									"<% if (typeof(this.streetAddress) != 'undefined') { %><div class='street-address'><%this.streetAddress%></div><% } %>" +
									"<% if (typeof(this.addressLocality) != 'undefined' || typeof(this.postalCode) != 'undefined') { %><div class='locality'>" +
										"<% if (typeof(this.addressLocality) != 'undefined' ) { %><%this.addressLocality%><% } %>" +
										"<% if (typeof(this.addressRegion) != 'undefined' ) { %>, <%this.addressRegion%><% } %>" +
										"<% if (typeof(this.postalCode) != 'undefined' ) { %><span class='postalcode'><%this.postalCode%></span><% } %>" +
									"</div><% } %>" +
								"</div>" +
								"<% if (typeof(this.telephone) != 'undefined' ) { %><div class='tel'><%this.telephone%></div><% } %>" +
								"<% if (typeof(this.email) != 'undefined' ) { %><div class='email' rel='email'><a href='mailto:<%this.email%>'>Email us</a></div><% } %>" +
								"<% if (typeof(this.ContactPoint) != 'undefined' && typeof(this.ContactPointTitle) != 'undefined') { %>" +
									"<div class='more'><a href='<%this.ContactPoint%>'><%this.ContactPointTitle%></a></div>" +
								"<% } %>" +
								"</address>"
		},

		/**
		 * Global objects that are part of the Spine framework.
		 */
		framework_globals: {
			spine: $( "#spine" ),
			glue: $( "#glue" ),
			main: $( "main" ),
			wsu_actions: $( "#wsu-actions" )
		},

		/**
		 * Data on the current state of navigation for use when calculating
		 * sizes and placement of other elements.
		 */
		nav_state:{
			viewport_ht: 0,
			scroll_dif: 0,
			positionLock: 0,
			scroll_top: 0,
			spine_ht: 0,
			glue_ht: 0,
			height_dif: 0
		},

		/**
		 * Setup a scroll container for use with iOS.
		 */
		setup_nav_scroll: function() {
			$( "#glue" ).wrapInner( "<div id='scroll'>" );
			$( "#spine header" ).insertBefore( $( "#glue" ) );
		},

		/**
		 * Determine if the page view is in a mobile state, defined as less than 990px;
		 */
		is_mobile_view: function() {
			if ( window.matchMedia ) {
				return window.matchMedia( "(max-width: 989px)" ).matches;
			} else if ( window.styleMedia ) {

				// Fallback for IE 9. IE 8 and below do not support media queries anyway.
				return window.styleMedia.matchMedium( "(max-width: 989px)" );
			}

			return false;
		},

		/**
		 * Set the Spine to a given state, mobile or full.
		 *
		 * @param {string} state The state of the Spine to set.
		 */
		set_spine_state: function( state ) {
			if ( "mobile" === state ) {
				$( "html" ).removeClass( "spine-full" ).addClass( "ios spine-mobile" );
				this.setup_nav_scroll();
			} else {
				$( "html" ).removeClass( "ios spine-mobile spine-mobile-open" ).addClass( "spine-full" );
				if ( $( "#scroll" ).length ) {
					$( "#wsu-actions" ).unwrap();
					$( "#spine header" ).prependTo( "#glue" );
				}
			}
		},

		/**
		 * Determine if the Spine is already in a mobile state.
		 *
		 * @returns {boolean}
		 */
		has_mobile_state: function() {
			if ( $( "html" ).hasClass( "spine-mobile" ) ) {
				return true;
			}

			return false;
		},

		/**
		 * On a resize event, adjust pieces of the Spine framework accordingly.
		 */
		framework_adjust_on_resize: function() {
			var self, spine, glue, main;

			self = this;

			// Refresh data for global elements.
			spine = self._get_globals( "spine" ).refresh();
			glue = self._get_globals( "glue" ).refresh();
			main = self._get_globals( "main" ).refresh();

			if ( self.is_mobile_view() && !self.has_mobile_state() ) {
				self.set_spine_state( "mobile" );
			} else if ( !self.is_mobile_view() && self.has_mobile_state() ) {
				self.set_spine_state( "full" );
			}

			if ( self.is_mobile_view() ) {
				self.mainheight();
			}
		},

		/**
		 * Create the Spine framework and setup basic events based on information present in the DOM.
		 */
		framework_create: function() {
			var self, contactHtml, propmap = {}, svg_imgs;

			self = this; // Preserve scope.

			// Generate the contact section.
			if ( !$( "#wsu-contact" ).length ) {
				contactHtml = "<section id='wsu-contact' class='spine-contact spine-action closed'>";
				propmap = {};

				$.each( $( "[itemtype='http://schema.org/Organization']" ), function() {
					var tar = this;
					$.each( $( tar ).find( "[itemprop]" ), function( i, v ) {
						var tmp = {};
						tmp[ $( v ).attr( "itemprop" ) ] = $( v ).attr( "content" );
						$.extend( propmap, tmp );
					} );
					contactHtml += $.runTemplate( self.framework_options.contact_template, propmap );
				} );
				contactHtml += "</section>";
				self.setup_tabs( "contact", contactHtml );
			}

			self.setup_nav();

			// Set the initial state of the Spine on page load. Mobile is defined as less than 990px.
			if ( self.is_mobile_view() ) {
				self.set_spine_state( "mobile" );
			} else {
				$( "html" ).addClass( "spine-full" );
			}

			// If SVG is not supported, add a class and replace Spine SVG files with PNG equivalents.
			if ( !$.svg_enabled() ) {
				$( "html" ).addClass( "nosvg" );
				svg_imgs = $( "img[src$='.svg']" );

				if ( svg_imgs.length ) {
					$.each( svg_imgs, function() {
						$( this ).attr( "src", $( this ).attr( "src" ).replace( ".svg", ".png" ) );
					} );
				}
			}

			self.setup_spine();
			self.setup_printing();

			$( window ).on( "resize orientationchange", function() { self.framework_adjust_on_resize(); } ).trigger( "resize" );
		},

		/**
		 * Apply a minimum height to the `main` element.
		 */
		mainheight: function() {
			var main, window_height, main_height;

			main = this._get_globals( "main" ).refresh();

			if ( main.offset() ) {
				window_height = $( window ).height();
				main_height = window_height;
				if ( $( "#binder" ).is( ".size-lt-large" ) ) {
					main_height -= 50;
				}
				$( "main:not(.height-auto)" ).css( "min-height", main_height );
			}
		},

		/**
		 * Toggle the display and removal of the mobile navigation.
		 *
		 * @param e
		 */
		toggle_mobile_nav: function( e ) {
			var html, body, spine, glue, transitionEnd;

			if ( typeof e !== "undefined" ) {
				e.preventDefault();
			}

			html = $( "html" );
			body = $( "body" );
			spine = $.ui.spine.prototype._get_globals( "spine" ).refresh();
			glue = $.ui.spine.prototype._get_globals( "glue" ).refresh();

			/* Cross browser support for CSS "transition end" event */
			transitionEnd = "transitionend webkitTransitionEnd otransitionend MSTransitionEnd";

			// Whether opening or closing, the Spine will be animating from this point forward.
			body.addClass( "spine-animating" );

			// Tell the browser and stylesheet what direction the Spine is animating.
			if ( html.hasClass( "spine-mobile-open" ) ) {
				body.addClass( "spine-move-left" );
			} else {
				body.addClass( "spine-move-right" );
			}

			glue.on( transitionEnd, function() {
				body.removeClass( "spine-animating spine-move-left spine-move-right" );

				if ( html.hasClass( "spine-mobile-open" ) ) {
					html.removeClass( "spine-mobile-open" );

					$( "#scroll" ).off( "touchstart" );
					$( document ).off( "touchmove touchend touchstart" );
				} else {
					html.addClass( "spine-mobile-open" );

					var scroll_element = document.querySelector( "#scroll" );

					scroll_element.addEventListener( "touchstart", function() {
						var top = scroll_element.scrollTop, totalScroll = scroll_element.scrollHeight, currentScroll = top + scroll_element.offsetHeight;

						if ( top === 0 ) {
							scroll_element.scrollTop = 1;
						} else if ( currentScroll === totalScroll ) {
							scroll_element.scrollTop = top - 1;
						}
					} );

					// Prevent scrolling on mobile outside of `#scroll` while the mobile menu is open.
					$( document ).on( "touchmove touchend touchstart", function( evt ) {
						if ( $( evt.target ).parents( "#scroll" ).length > 0 || $( evt.target ).is( "#scroll" ) ) {
							return true;
						}

						evt.stopPropagation();
						evt.preventDefault();
					} );
				}
				glue.off( transitionEnd );
			} );
		},

		/**
		 * Sets up the spine area
		 */
		setup_spine: function() {
			var self, spine, glue, main;

			$( "#spine .spine-header" ).prepend( "<button id='shelve' type='button' />" );

			self = this;

			spine = self._get_globals( "spine" ).refresh();
			glue = self._get_globals( "glue" ).refresh();
			main = self._get_globals( "main" ).refresh();

			self.nav_state.scroll_top = 0;
			self.nav_state.scroll_dif = 0;
			self.nav_state.positionLock = 0;

			// The menu button should always trigger a toggle of the mobile navigation.
			$( "header button" ).on( "click touchend", self.toggle_mobile_nav );

			// Tapping anything outside of the Spine should trigger a toggle if the menu is open.
			main.on( "click", function( e ) {
				if ( $( "html" ).hasClass( "spine-mobile-open" ) ) {
					self.toggle_mobile_nav( e );
				}
			} );

			/**
			 * When the navigation area is shorter than the available window, add a margin to the
			 * Spine footer so that the scroll container becomes active. This avoids issues on
			 * mobile devices when overflow is not applied.
			 */
			if ( self.is_mobile_view() ) {
				var nav_height = $( ".spine-header" ).height() + $( "#wsu-actions" ).height() + $( "#spine-navigation" ).height();
				var spine_footer = $( ".spine-footer" );
				var footer_height = spine_footer.height();
				if ( window.innerHeight - nav_height >= footer_height ) {
					var margin = window.innerHeight - nav_height - footer_height;
					spine_footer.css( "margin-top", margin );
				}
			}
		},

		/**
		 * Toggle a Spine action item and the data associated with it between an
		 * open and closed state on touch.
		 *
		 * @param evt
		 * @private
		 */
		_toggle_spine_action_item: function( evt ) {
			var tab, action_ht;

			evt.preventDefault();

			tab = $( evt.target ).parent( "li" ).attr( "id" ).split( "-" )[ 1 ];

			$( "#wsu-actions" ).find( "*.opened, #wsu-" + tab + ", #wsu-" + tab + "-tab" ).toggleClass( "opened closed" );

			action_ht = window.innerHeight - $( ".spine-header" ).outerHeight() - $( "#wsu-actions-tabs" ).outerHeight();

			$( ".spine-action.opened" ).css( "min-height", action_ht );
			$( evt.target ).off( "mouseup touchend", $.ui.spine.prototype._toggle_spine_action_item );
		},

		/**
		 * Process a WSU action tab (mail, sharing, etc...) and setup the
		 * structure accordingly.
		 */
		setup_tabs: function( tab, html ) {
			var self, wsu_actions, action_ht;

			html = html || "";
			self = this;

			wsu_actions = self._get_globals( "wsu_actions" ).refresh();
			wsu_actions.append( html );

			if ( self.is_mobile_view() ) {
				$( "#wsu-" + tab + "-tab button" ).on( "mousedown touchstart", function( e ) {
					$( e.target ).on( "mouseup touchend", $.ui.spine.prototype._toggle_spine_action_item );
					$( e.target ).on( "mousemove touchmove", function( e ) {
						$( e.target ).off( "mouseup touchend", $.ui.spine.prototype._toggle_spine_action_item );
					} );
				} );
			} else {
				$( "#wsu-" + tab + "-tab button" ).on( "click", function( e ) {
					e.preventDefault();
					wsu_actions.find( "*.opened,#wsu-" + tab + ",#wsu-" + tab + "-tab" ).toggleClass( "opened closed" );

					action_ht = window.innerHeight - $( ".spine-header" ).outerHeight() - $( "#wsu-actions-tabs" ).outerHeight();

					$( ".spine-action.opened" ).css( "min-height", action_ht );
				} );
			}
		},

		/**
		 * Toggle a parent list item and its children between an open
		 * and closed state on touch.
		 *
		 * @param evt
		 * @private
		 */
		_toggle_spine_nav_list: function( evt ) {
			var target = $( evt.target );

			evt.preventDefault();
			target.closest( "li" ).toggleClass( "opened" );

			// Remove the toggle event, as it will be added again on the next touchstart.
			target.off( "mouseup touchend", $.ui.spine.prototype._toggle_spine_nav_list );
		},

		/**
		 * Sets up navigation system
		 */
		setup_nav: function() {
			var self = this;

			// Apply the `parent` class to each parent list item of an unordered list in the navigation.
			$( "#spine nav ul, #spine ul" ).parents( "li" ).addClass( "parent" );

			var couplets = $( "#spine nav li.parent > a" );

			// Assign active elements a class of dogeared unless those elements contain other active elements.
			$( "#spine .active:not(:has(.active))" ).addClass( "dogeared" );

			/**
			 * Walk through each of the anchor elements in the navigation to establish when "Overview"
			 * items should be added and what the text should read.
			 */
			couplets.each( function() {
				var tar, title, url;
				tar = $( this );
				url = tar.attr( "href" );

				// "Overview" anchors are only added for parents with URLs.
				if ( "#" === url ) {
					return;
				}

				var classes = "overview";

				// If a generated overview's parent is marked as dogeared, do the same with the overview.
				if ( tar.closest( ".parent" ).is( ".dogeared" ) ) {
					classes += " dogeared";
				}

				title = ( tar.is( "[title]" )  ) ? tar.attr( "title" ) : "Overview";
				title = ( tar.is( "[data-overview]" ) ) ? tar.data( "overview" ) : title;
				title = title.length > 0 ? title : "Overview"; // This is just triple checking that a value made it here.

				tar.parent( "li" ).children( "ul" ).prepend( "<li class='" + classes + "'></li>" );
				tar.clone( true, true ).appendTo( tar.parent( "li" ).find( "ul .overview:first" ) );
				tar.parent( "li" ).find( "ul .overview:first a" ).html( title );

				// When the overview page is active, that area of the navigation should be opened.
				if ( tar.parent( "li" ).hasClass( "active" ) ) {
					tar.parents( "li" ).removeClass( "active" ).addClass( "opened dogeared" );
				}
			} );

			/**
			 * Account for historical markup in the WSU ecosystem and add the `active` and `dogeared` classes
			 * to any list items that already have classes similar to `current` or `active`. Also apply the
			 * `opened` and `dogeared` classes to any parent list items of these active elements.
			 *
			 * `active` and `dogeared` are both used for the styling of active menu items in the navigation.
			 */
			$( "#spine nav li[class*=current], #spine nav li[class*=active]" ).addClass( "active dogeared" ).parents( "li" ).addClass( "opened dogeared" );

			/**
			 * Also look for any anchor elements using a similar method and apply `active` and `dogeared` classes to
			 * all parent list items.
			 */
			$( "#spine nav li a[class*=current], #spine nav li a[class*=active]" ).parents( "li" ).addClass( "active dogeared" );

			/**
			 * Setup navigation events depending on what the screen size is when the document first
			 * loads. If mobile, we use touch events for navigation. If not mobile, we rely on
			 * standard click events.
			 *
			 * Some additional handling is necessary on mobile to properly handle the sequence of
			 * touchstart, touchmove, and touchend without confusion.
			 */
			if ( self.is_mobile_view() ) {
				couplets.on( "mousedown touchstart", function( e ) {
					$( e.target ).on( "mouseup touchend", $.ui.spine.prototype._toggle_spine_nav_list );
					$( e.target ).on( "mousemove touchmove", function( e ) {
						$( e.target ).off( "mouseup touchend", $.ui.spine.prototype._toggle_spine_nav_list );
					} );
				} );
			} else {

				// Disclosure
				couplets.on( "click", function( e ) {
					e.preventDefault();
					$( e.target ).closest( "li" ).toggleClass( "opened" );
				} );
			}

			// Mark external URLs in the nav menu.
			$( ".spine-navigation a[href^='http']:not([href*='://" + window.location.hostname + "'])" ).addClass( "external" );
		},

		/**
		 * Handle printing action when selected in the Spine.
		 */
		setup_printing: function() {
			var self, spine, wsu_actions, print_controls;

			self = this;
			spine = self._get_globals( "spine" ).refresh();
			wsu_actions = self._get_globals( "wsu_actions" ).refresh();

			// Print & Print View
			print_controls = "<span class='print-controls'><button id='print-invoke'>Print</button><button id='print-cancel'>Cancel</button></span>";

			function printPage() {
				window.print();
			}

			function print_cancel() {
				$( "html" ).toggleClass( "print" );
				$( ".print-controls" ).remove();
			}

			function print( e ) {
				if ( undefined !== e ) {
					e.preventDefault();
				}
				wsu_actions.find( ".opened" ).toggleClass( "opened closed" );
				$( "html" ).toggleClass( "print" );
				spine.find( "header" ).prepend( print_controls );
				$( ".unshelved" ).removeClass( "unshelved" ).addClass( "shelved" );
				$( "#print-invoke" ).on( "click", function() { window.print(); } );
				$( "#print-cancel" ).on( "click", print_cancel );
				window.setTimeout( function() { printPage(); }, 400 );
			}
			$( "#wsu-print-tab button" ).click( print );

			// Shut a tool section
			$( "button.shut" ).on( "click touchend", function( e ) {
				e.preventDefault();
				wsu_actions.find( ".opened" ).toggleClass( "opened closed" );
			} );
		}
	} );
}( jQuery ) );
