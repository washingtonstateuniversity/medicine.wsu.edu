/*
	TermTemplate:"<strong> <%this.term%> </strong>",
	this.options.relatedHeader

	termTemplate
	autoSearchObj.options.provider.termTemplate
*/

/* jshint onevar: false */
( function( $ ) {
	"use strict";
	$.widget( "ui.autosearch", $.ui.autocomplete, {
		_renderMenu: function( ul, items ) {
			var that	= this;
			var related	= $.grep( items, function( obj ) {//, item) {
				return obj.related !== "false";
			} );
			var unrelated = $.grep( items, function( obj ) {//, item) {
				return obj.related === "false";
			} );
			$.each( unrelated, function( i, item ) {
				that._renderItemData( ul, item );
			} );

			if ( this.options.showRelated && related.length ) {
				if ( this.options.relatedHeader ) {
					that._renderHeader( ul, this.options.relatedHeader );
				}
				$.each( related, function( i, item ) {
					that._renderItemData( ul, item );
				} );
			}
		},
		_renderItemData: function( ul, item ) {
			return this._renderItem( ul, item ).data( "ui-autocomplete-item", item );
		},
		_renderItem: function( ul, item ) {
			var text	= item.label;

			return $( "<li></li>" ).data( "item.autocomplete", item ).append( text ).appendTo( ul );
		},
		_renderHeader: function( ul, text ) {
			return $( "<li></li>" ).append( "<a href=''>" + text + "</a>" ).appendTo( ul );
		}
	} );
} )( jQuery );

/** Intended usage is
*	$.spine({
*		"option":"value"
*	});
**/
/*jshint -W054 */
;( function( $, window, document, undefined ) {
	/**
	 * Strip one or more classes from a class attribute matching a given prefix.
	 *
	 * @param {string} partialMatch The class partial to match against, like `btn-` to match `btn-danger btn-active`, but not `btn`.
	 * @param {string} endOrBegin   Omit to match the beginning. Provide a truthy value to only find classes ending with a match.
	 * @returns {jQuery}
	 */
	$.fn.stripClass = function( partialMatch, endOrBegin ) {
		var x;
		x = new RegExp( ( !endOrBegin ? "\\b" : "\\S+" ) + partialMatch + "\\S*", "g" );

		// http://stackoverflow.com/a/2644364/1037948
		this.attr( "class", function( i, c ) {
			if ( !c ) {
				return; // Protect against no class
			}
			return c.replace( x, "" );
		} );
		return this;
	};

	/**
	 * Refresh a snapshot of stored jQuery selector data.
	 *
	 * Not all stored object properties would normally be reflected when
	 * the original selector is modified. This ensures we capture the
	 * latest version.
	 *
	 * @returns {*}
	 */
	$.fn.refresh = function() {
		var elems;
		elems = $( this.selector );
		this.splice( 0, this.length );

		try {
			this.push.apply( this, elems );
		}
		catch ( err ) {
			if ( $( this.selector ).html() !== "" ) {
				return $( this.selector );
			}else {
				return $( "<div>" );
			}
		}
		return this;
	};

	/**
	 * A small templating engine for processing HTML with given data.
	 *
	 * @see TemplateEngine via MIT Licensed https://github.com/krasimir/absurd/
	 *
	 * @param {string} html
	 * @param {Object} options
	 * @returns {*}
	 */
	$.runTemplate = function( html, options ) {
		var re, add, match, cursor, code, reExp, result;

		re = /<%(.+?)%>/g;
		reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g;
		code = "var r=[];\n";
		cursor = 0;

		add = function( line, js ) {
			if ( js ) {
				code += line.match( reExp ) ? line + "\n" : "r.push(" + line + ");\n";
			}else {
				code += line !== "" ? "r.push('" + line.replace( /'/g, "\"" ) + "');\n" : "";
			}
			return add;
		};

		while ( ( match = re.exec( html ) ) ) {
			add( html.slice( cursor, match.index ) )( match[ 1 ], true );
			cursor = match.index + match[ 0 ].length;
		}

		add( html.substr( cursor, html.length - cursor ) );
		code = ( code + "return r.join('');" ).replace( /[\r\t\n]/g, "" );
		result = new Function( code ).apply( options );

		return result;
	};

	/**
	 * Unused in Spine.
	 *
	 * @todo Consider deprecating.
	 *
	 * @returns {*}
	 */
	$.whenAll = function() {
		return $.when.apply( $, arguments );
	};

	/**
	 * Determine if the current view is an iOS device.
	 *
	 * @returns {boolean}
	 */
	$.is_iOS = function() {
		return ( window.navigator.userAgent.match( /(iPad|iPhone|iPod)/ig ) ? true : false );
	};

	/**
	 * Determine if the current view is an Android device.
	 *
	 * @returns {boolean}
	 */
	$.is_Android = function() {
		return ( window.navigator.userAgent.match( /(Android)/ig ) ? true : false );
	};

	/**
	 * Detect browser support for SVG images.
	 *
	 * @returns {boolean}
	 */
	$.svg_enabled = function() {
		return document.implementation.hasFeature( "http://www.w3.org/TR/SVG11/feature#Image", "1.1" );
	};

	/**
	 * Use MutationObserver to watch for any changes to a specific DOM element and trigger
	 * the passed callback when a change is made.
	 *
	 * This is currently only used within the Spine to watch `#glue` for changes such as
	 * menu expansion, etc...
	 *
	 * @param obj
	 * @param callback
	 */
	$.observeDOM = function( obj, callback ) {
		var config, mutationObserver;

		if ( window.MutationObserver ) {
			config = {
				childList: true,
				attributes: true,
				subtree: true,
				attributeOldValue: true,
				attributeFilter: [ "class", "style" ]
			};

			mutationObserver = new MutationObserver( function( mutationRecords ) {
				var fire_callback = false; // Assume no callback is needed.

				$.each( mutationRecords, function( index, mutationRecord ) {
					if ( mutationRecord.type === "childList" ) {
						if ( mutationRecord.addedNodes.length > 0 ) {
							fire_callback = true;
						} else if ( mutationRecord.removedNodes.length > 0 ) {
							fire_callback = true;
						}
					} else if ( mutationRecord.type === "attributes" ) {
						if ( mutationRecord.attributeName === "class" ) {
							fire_callback = true;
						}
					}
				} );

				// If one of our matched mutations has been observed, fire the callback.
				if ( fire_callback ) {
					callback();
				}
			} );
			mutationObserver.observe( obj[ 0 ], config );
		} else {

			// Set a fallback function to fire every 200ms and watch for DOM changes.
			window.setTimeout( function() {
				var current_obj = obj.refresh();

				if ( typeof window.obj_watch === "undefined" ) {
					window.obj_watch = current_obj[ 0 ];
				}

				/**
				 * If the current object does not match the object we're watching, assume
				 * a DOM mutation has occurred and fire the callback.
				 */
				if ( window.obj_watch !== current_obj[ 0 ] ) {
					callback();
				}

				window.obj_watch = current_obj[ 0 ];

				// Reset observation on the current object.
				$.observeDOM( current_obj, callback );
			}, 200 );
		}
	};

	/**
	 * Setup the plugin's prototype.
	 *
	 * @param {string} name
	 * @param {object} prototype
	 */
	$.s = function( name, prototype ) {
		var namespace;

		namespace = name.split( "." )[ 0 ];
		name = name.split( "." )[ 1 ];

		$[ namespace ] = $[ namespace ] || {};

		$[ namespace ][ name ] = function( options, element ) {
			if ( arguments.length ) {
				this._setup( options, element );
			}
		};

		$[ namespace ][ name ].prototype = $.extend( {
			namespace: namespace,
			pluginName: name
		}, prototype );

		$.fn[ name ] = function( context ) {
			var isMethodCall, context_options, args, returnValue;

			context_options = {};

			if ( arguments[ 1 ] ) {
				context_options = arguments[ 1 ];
			}

			context = context || {};

			this.options = $.extend( {}, context );

			isMethodCall = ( typeof context === "string" );
			args = Array.prototype.slice.call( arguments, 1 );
			returnValue = this;

			if ( isMethodCall && context.substring( 0, 1 ) === "_" ) {
				return returnValue;
			}

			this.each( function() {
				var instance;

				instance = $.data( this, name );

				if ( !instance ) {
					instance = $.data( this, name, new $[ namespace ][ name ]( context, this ) );
				}

				if ( instance[ context + "_init" ] !== undefined ) {
					if ( instance[ context + "_init" ] ) {
						instance[ context + "_init" ]( context_options );
					}
				}

				if ( isMethodCall && instance[ context ] !== undefined ) {
					returnValue = instance[ context ].apply( instance, args );
				}
			} );
			return returnValue;
		};
	};

	/**
	 * Configure and create the jQuery.ui.spine plugin.
	 *
	 * Based on a fork of MIT Licensed jquery-ui-map
	 * See: https://code.google.com/p/jquery-ui-map/source/browse/trunk/ui/jquery.ui.map.js
	 */
	$.s( "ui.spine", {

		globals: {
			version: "0.1.0",
			current_url:window.location.href
		},

		options: {},

		/**
		 * Setup plugin basics.
		 *
		 * @param {object}      options
		 * @param {HTMLElement} element
		 */
		_setup: function( options, element ) {
			this.el = element;
			options = options || {};
			$.extend( this.options, options, {} );
			this._create();
		},

		/**
		 * Instantiate the object
		 */
		_create: function() {
			var self;

			self = this;
			this.instance = {
				spine: self.options,
				framework: [],
				search: [],
				social: []
			};

			self._call( self.options.callback, self.instance.spine );
		},

		/**
		 * Add objects to the global spine object.
		 *
		 * Note: Context is not yet implemented.
		 *
		 * @param {object} obj     e.g. {'foo':'bar'}
		 * @param {string} context e.g. 'search', 'social', 'framework'
		 */
		_set_globals: function( obj, context ) {
			context = null; // Avoiding jshint error temporarily.

			if ( typeof( obj ) !== "object" ) {
				return;
			}
			$.extend( this.globals, obj );
		},

		/**
		 * Retrieve a context's objects from the global spine object.
		 *
		 * @param {string} context e.g. 'search', 'social', 'framework'
		 * @returns {*}
		 * @private
		 */
		_get_globals: function( context ) {
			return this.globals[ context ];
		},

		/**
		 * Clears an object of a context.
		 *
		 * @param {string} context e.g. 'search', 'social', 'framework'
		 */
		clear: function( context ) {
			this._c( this.get( context ) );
			this.set( context, [] );

			return this;
		},

		/**
		 * Clears an object of its properties.
		 *
		 * @param {object} obj
		 */
		_c: function( obj ) {
			for ( var property in obj ) {
				if ( obj.hasOwnProperty( property ) ) {
					obj[ property ] = null;
				}
			}
		},

		/**
		 * Returns objects with a specific context.
		 *
		 * @param {string} context In what context, e.g. 'search', 'social', 'framework'
		 * @param {object} options Contains string property, string value, string operator (AND/OR).
		 * @param callback:function(search:jObj, isFound:boolean)
		 */
		find: function( context, options, callback ) {
			var obj, isFound, property, value;
			obj = this.get( context );
			options.value = $.isArray( options.value ) ? options.value : [ options.value ];
			for ( property in obj ) {
				if ( obj.hasOwnProperty( property ) ) {
					isFound = false;
					for ( value in options.value ) {
						if ( $.inArray( options.value[ value ], obj[ property ][ options.property ] ) > -1 ) {
							isFound = true;
						} else {
							if ( options.operator && options.operator === "AND" ) {
								isFound = false;
								break;
							}
						}
					}
					callback( obj[ property ], isFound );
				}
			}
			return this;
		},

		/**
		 * Returns an instance property by key. Has the ability to set an object if the property does not exist
		 * @param key:string
		 * @param value:object(optional)
		 */
		get: function( key, value ) {
			var instance, e, i;
			instance = this.instance;
			if ( !instance[ key ] ) {
				if ( key.indexOf( ">" ) > -1 ) {
					e = key.replace( / /g, "" ).split( ">" );
					for ( i = 0; i < e.length; i++ ) {
						if ( !instance[ e[ i ] ] ) {
							if ( value ) {
								instance[ e[ i ] ] = ( ( i + 1 ) < e.length ) ? [] : value;
							} else {
								return null;
							}
						}
						instance = instance[ e[ i ] ];
					}
					return instance;
				} else if ( value && !instance[ key ] ) {
					this.set( key, value );
				}
			}
			return instance[ key ];
		},

		/**
		 * Sets an instance property
		 * @param key:string
		 * @param value:object
		 */
		set: function( key, value ) {
			this.instance[ key ] = value;
			return this;
		},

		/**
		 * Helper method for unwrapping jQuery/DOM/string elements
		 * @param obj:string/node/jQuery
		 */
		_unwrap: function( obj ) {
			return ( !obj ) ? null : ( ( obj instanceof jQuery ) ? obj[ 0 ] : ( ( obj instanceof Object ) ? obj : $( "#" + obj )[ 0 ] ) );
		},

		/**
		 * Helper method for calling a function
		 * @param callback
		 */
		_call: function( callback ) {
			if ( callback && $.isFunction( callback ) ) {
				callback.apply( this, Array.prototype.slice.call( arguments, 1 ) );
			}
		},

		/**
		 * Destroys spine elements and options.
		 */
		clear_spine: function() {
			this.clear( "search" ).clear( "framework" ).clear( "social" );
		},

		/**
		 * Destroys the plugin.
		 */
		destroy: function( callback ) {
			this.clear( "search" ).clear( "framework" ).clear( "social" )._c( this.instance );
			$.removeData( this.el, this.name );
			this._call( callback, this );
		}
	} );

	/**
	 * The primary Spine method used to start things up.
	 *
	 * @param {object} options
	 * @returns {*}
	 */
	$.spine = function( options ) {
		var targ;

		targ = this.jquery === undefined ? $( "body" ) : this;

		return $.each( targ, function() {
			var targ;
			targ = $( this );

			// Initialize the Spine plugin.
			targ.spine( {} );

			options = $.extend( { "framework":{}, "search":{}, "social":{} }, options );

			// Setup each of the extensions.
			$.each( options, function( i, v ) {
				targ.spine( i, v );
			} );
		} );
	};

} )( jQuery, window, document );

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
		 * Contains elements common to both both the mobile and standard versions of the
		 * Spine for reuse in several areas.
		 *
		 * @since 0.0.6
		 */
		nav_elements: {
			main_nav: false,
			top_level_parent_anchors: false,
			sub_level_parent_anchors: false,
			all_parent_anchors: false,
			top_level_opened: false
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
				self.clear_navigation();
				self.set_spine_state( "mobile" );
				self.setup_mobile_navigation();
			} else if ( !self.is_mobile_view() && self.has_mobile_state() ) {
				self.clear_navigation();
				self.set_spine_state( "full" );
				self.setup_standard_navigation();
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

			// Cache the Spine's main <nav> element for repeated use.
			self.nav_elements.spine_nav = $( ".spine-sitenav" );

			// Apply the `parent` class to each parent list item of an unordered list in the navigation.
			self.nav_elements.spine_nav.find( "ul" ).parents( "li" ).addClass( "parent" );

			// Cache all <a> elements from top level parent <li> elements.
			self.nav_elements.top_level_parent_anchors = self.nav_elements.spine_nav.find( "> ul > .parent > a" );

			// Cache all <a> elements from sub level parent <li> elements.
			self.nav_elements.sub_level_parent_anchors = self.nav_elements.spine_nav.find( "> ul > .parent > ul .parent > a" );

			// Cache all <a> elements from parent <li> elements at any level.
			self.nav_elements.all_parent_anchors = self.nav_elements.spine_nav.find( "li.parent > a" );

			self.nav_elements.all_parent_anchors.each( $.ui.spine.prototype.process_overview_links );

			// Add an active class to parent <li> elements of any element already marked active.
			self.nav_elements.spine_nav.find( ".active" ).parents( "li" ).addClass( "active" );

			// Mark external URLs in the nav menu.
			self.nav_elements.spine_nav.find( "a[href^='http']:not([href*='://" + window.location.hostname + "'])" ).addClass( "external" );

			// Set the initial state of the Spine on page load. Mobile is defined as less than 990px.
			if ( self.is_mobile_view() ) {
				self.setup_mobile_navigation();
				self.set_spine_state( "mobile" );
			} else {
				self.setup_standard_navigation();
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
		 * Walk through each of the anchor elements in the navigation to establish when "Overview"
		 * items should be added and what the text should read.
		 *
		 * @since 0.0.6
		 *
		 * @param index
		 * @param el
		 */
		process_overview_links: function( index, el ) {
			var classes, tar, title, url;
			tar = $( el );
			url = tar.attr( "href" );

			// "Overview" anchors are only added for parents with URLs.
			if ( "#" === url ) {
				return;
			}

			classes = "overview";

			title = ( tar.is( "[title]" )  ) ? tar.attr( "title" ) : "Overview";
			title = ( tar.is( "[data-overview]" ) ) ? tar.data( "overview" ) : title;
			title = title.length > 0 ? title : "Overview"; // This is just triple checking that a value made it here.

			tar.parent( "li" ).children( "ul" ).prepend( "<li class='" + classes + "'></li>" );
			tar.clone( true, true ).appendTo( tar.parent( "li" ).find( "ul .overview:first" ) );
			tar.parent( "li" ).find( "ul .overview:first a" ).html( title );
		},

		/**
		 * Handles click events on the top level anchor items when the
		 * standard horizontal navigation is displayed.
		 *
		 * @since 0.0.6
		 *
		 * @param e
		 */
		handle_top_level_anchor_click: function( e ) {
			e.preventDefault();

			var $parent = $( e.target ).closest( "li" );

			if ( $parent.hasClass( "opened" ) ) {
				$parent.css( { "z-index": 1, "padding-bottom": 0 } );
				setTimeout( function() {
					$.ui.spine.prototype.nav_elements.top_level_opened = false;
					$parent.removeClass( "opened" );
					$parent.find( "> .sub-menu > li" ).css( "visibility", "hidden" );
				}, 300 );

				return;
			}

			var padding = $parent.find( "> .sub-menu" ).outerHeight();
			var existing_menu = false;

			$.ui.spine.prototype.nav_elements.spine_nav.find( "> ul > li" ).each( function( t, x ) {
				if ( $( x ).hasClass( "opened" ) ) {
					existing_menu = true;
					$( x ).css( { "z-index": 1, "padding-bottom": 0 } );
					setTimeout( function() {
						$.ui.spine.prototype.nav_elements.top_level_opened = $parent;
						$( x ).removeClass( "opened" );
						$( x ).find( "> .sub-menu > li" ).css( "visibility", "hidden" );
						$parent.css( { "z-index": 2 } );
						$parent.find( "> .sub-menu > li" ).css( "visibility", "visible" );
						$parent.toggleClass( "opened" );
						$parent.css( { "padding-bottom": padding } );
					}, 300 );
				}
			} );

			if ( false === existing_menu ) {
				$.ui.spine.prototype.nav_elements.top_level_opened = $parent;
				$parent.css( { "z-index": 2 } );
				$parent.find( "> .sub-menu > li" ).css( "visibility", "visible" );
				$parent.toggleClass( "opened" );
				$parent.css( { "padding-bottom": padding } );
			}
		},

		/**
		 * Handles click events on sub level anchor items when the standard
		 * horizontal navigation is displayed.
		 *
		 * @since 0.0.6
		 *
		 * @param e
		 */
		handle_sub_level_anchor_click: function( e ) {
			e.preventDefault();

			var existing_padding = 0;
			var new_height = 0;
			var remove_height = 0;
			var $parent = $( e.target ).closest( "li" );
			var $top_parent = $parent.closest( ".spine-sitenav > ul > .parent" );

			if ( $parent.hasClass( "opened" ) ) {

				// First, remove the height of the smaller sub menu. This will
				// start a transition smoothly that we can continue once we know
				// the entire value.
				remove_height = $parent.find( "> .sub-menu" ).outerHeight();
				existing_padding = parseFloat( $top_parent.css( "padding-bottom" ) );
				$top_parent.css( "padding-bottom", ( existing_padding - remove_height ) + "px" );

				// After waiting for the initial transition to start, calculate the real height.
				setTimeout( function() {
					$parent.removeClass( "opened" );
					new_height = $.ui.spine.prototype.nav_elements.top_level_opened.find( "> .sub-menu" ).outerHeight();
					$top_parent.css( "padding-bottom", ( new_height ) + "px" );
				}, 100 );
			} else {
				$parent.addClass( "opened" );
				new_height = $.ui.spine.prototype.nav_elements.top_level_opened.find( "> .sub-menu" ).outerHeight();
				$top_parent.css( "padding-bottom", ( new_height ) + "px" );
			}
		},

		/**
		 * Sets up the navigation used on standard screen devices.
		 *
		 * @since 0.0.3
		 */
		setup_standard_navigation: function() {
			this.nav_elements.spine_nav.find( "> ul > li > .sub-menu > .non-anchor > a" ).contents().unwrap().wrap( "<span class='parent-anchor'></span>" );
			this.nav_elements.spine_nav.find( "> ul > .parent > .sub-menu > .parent > a" ).contents().unwrap().wrap( "<span class='parent-anchor'></span>" );
			this.nav_elements.top_level_parent_anchors.on( "click", $.ui.spine.prototype.handle_top_level_anchor_click );
			this.nav_elements.sub_level_parent_anchors.on( "click", $.ui.spine.prototype.handle_sub_level_anchor_click );
		},

		/**
		 * Sets up the mobile navigation system.
		 *
		 * @since 0.0.1 Forked from the WSU Spine
		 * @since 0.0.3 Altered to only run on mobile devices.
		 */
		setup_mobile_navigation: function() {

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
			 * loads. If mobile, we use touch events for navigation.
			 *
			 * Some additional handling is necessary on mobile to properly handle the sequence of
			 * touchstart, touchmove, and touchend without confusion.
			 */
			this.nav_elements.all_parent_anchors.on( "mousedown touchstart", function( e ) {
				$( e.target ).on( "mouseup touchend", $.ui.spine.prototype._toggle_spine_nav_list );
				$( e.target ).on( "mousemove touchmove", function( e ) {
					$( e.target ).off( "mouseup touchend", $.ui.spine.prototype._toggle_spine_nav_list );
				} );
			} );
		},

		/**
		 * Clears any navigation behavior when switching states between mobile and
		 * standard screen sizes.
		 *
		 * @since 0.0.3
		 */
		clear_navigation: function() {
			this.nav_elements.top_level_parent_anchors.off( "click", $.ui.spine.prototype.handle_top_level_anchor_click );
			this.nav_elements.sub_level_parent_anchors.off( "click", $.ui.spine.prototype.handle_sub_level_anchor_click );
			this.nav_elements.all_parent_anchors.off();
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

 /*!
 *
 * Depends:
 *		jquery.ui.v.js
 */
/*jshint multistr: true */
( function( $ ) {
	"use strict";
	$.extend( $.ui.spine.prototype, {
		search_init: function( options ) {
			var self;
			self = this;//Hold to preserve scop
			$.extend( options, self.search_options, options );
			this._set_globals( this.search_globals );
			this.create_search();
		},

		search_options:{
			data:[],
			providers:{
				nav:{
					name:"From Navigation",
					nodes: ".spine-navigation",
					dataType: "html",
					maxRows: 12,
					urlSpaces:"%20"
				},
				atoz:{
					name:"WSU A to Z index",
					url: "https://search.wsu.edu/2013service/searchservice/search.asmx/AZSearch",
					urlSpaces:"+",
					dataType: "jsonp",
					featureClass: "P",
					style: "full",
					maxRows: 12,
					termTemplate:"<strong><%this.term%></strong>",
					resultTemplate:""
				}
			},
			search:{
				minLength: 2,
				maxRows: 12,
				getRelated:true,
				urlSpaces:"+",
				tabTemplate: "<section id='wsu-search' class='spine-search spine-action closed'>" +
								"<form id='default-search'>" +
									"<input name='term' type='text' value='' placeholder='search'>" +
									"<button type='submit'>Submit</button>" +
								"</form>" +
								"<div id='spine-shortcuts' class='spine-shortcuts'></div>" +
							"</section>"
			},
			result:{
				appendTo: "#spine-shortcuts",
				showRelated:true,
				target:"_blank",
				relatedHeader:"<b class='related_sep'>Related</b><hr/>",
				providerHeader:"<b class='provider_header'><%this.provider_name%></b><hr/>",
				termTemplate:"<b><%this.term%></b>",
				template:"<li><%this.searchitem%></li>"
			}
		},
		search_globals: {
			wsu_search: $( "#wsu-search" ),
			search_input:$( "#wsu-search input[type=text]" )
		},
		create_search: function() {
			var self, wsu_search, tabhtml;
			self = this;//Hold to preserve scop
			wsu_search = self._get_globals( "wsu_search" ).refresh();
			if ( !wsu_search.length ) {
				tabhtml = $.runTemplate( self.search_options.search.tabTemplate, {} );
			}else {
				tabhtml = "<section id='wsu-search' class='spine-search spine-action closed'>" + wsu_search.html() + "</section>";
				wsu_search.remove();
			}
			this.setup_tabs( "search", tabhtml );

			if ( $( "#spine-shortcuts" ).length <= 0 ) {
				$( "#wsu-search" ).append( "<div id='spine-shortcuts' class='spine-shortcuts'></div>" );
			}

			$( "#wsu-search-tab button" ).on( "click touchend", function() {
				self._get_globals( "search_input" ).refresh().focus();
			} );
			this.setup_search();
		},

		start_search:function( request, callback ) {
			var self, term, queries = [];
			self = this;//Hold to preserve scop

			term = $.trim( request.term );
			self.search_options.data = [];
			$.each( self.search_options.providers, function( i, provider ) {
				$.ui.autocomplete.prototype.options.termTemplate = ( typeof( provider.termTemplate ) !== undefined && provider.termTemplate !== "" ) ? provider.termTemplate : undefined;
				queries.push( self.run_query( term, provider ) );
			} );

			$.when.apply( $, queries ).done(
			function() {
				$.each( arguments, function( i, v ) {
					var data, proData;
					if ( v !== undefined ) {
						data = v[ 0 ];
						if ( data !== undefined && data.length > 0 ) {
							proData = self.setup_result_obj( term, data );
							$.merge( self.search_options.data, proData );
						}
					}
				} );
				self._call( callback, self.search_options.data );
			} );
		},

		run_query:function( term, provider ) {
			var self, result = [], tmpObj = [], nodes;
			self = this;//Hold to preserve scop
			result = [];

			if ( typeof( provider ) !== undefined && typeof( provider.url ) !== undefined && provider.nodes === undefined ) {
				return $.ajax( {
					url: provider.url,
					dataType: provider.dataType,
					data: {
						featureClass: provider.featureClass,
						style: provider.style,
						maxRows: provider.maxRows,
						name_startsWith: term,
						related:self.search_options.search.getRelated
					}
				} );
			}else if ( typeof( provider ) !== undefined && typeof( provider.nodes ) !== undefined ) {
				nodes = $( provider.nodes ).find( "a" );
				$.each( nodes, function( i, v ) {
					var obj, text, localtmpObj;
					obj = $( v );
					text = obj.text();
					if ( text.toLowerCase().indexOf( term.toLowerCase() ) > -1 && obj.attr( "href" ) !== "#" ) {
						localtmpObj = {
							label:text,
							value:obj.attr( "href" ),
							related:"false",
							searchKeywords:""
						};
						tmpObj.push( localtmpObj );
					}
				} );
				return [ tmpObj ];
			}
		},

		format_result_text:function( term, text, value ) {
			var self, termTemplate, regex;
			self = this;//Hold to preserve scope

			termTemplate = "<strong>$1</strong>"; //Typeof($.ui.autocomplete.prototype.options.termTemplate)!==undefined ? $.ui.autocomplete.prototype.options.termTemplate : "<strong>$1</strong>";

			regex	= "(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex( term ) + ")(?![^<>]*>)(?![^&;]+;)";
			text	= "<a href='" + value + "' target='" + self.search_options.result.target + "'>" + text.replace( new RegExp( regex, "gi" ), termTemplate ) + "</a>";

			return text;
		},

		setup_result_obj:function( term, data ) {
			var self, matcher;
			self = this;//Hold to preserve scop
			matcher = new RegExp( $.ui.autocomplete.escapeRegex( term ), "i" );
			return $.map( data, function( item ) {
				var text, value, resultObj;
				text = item.label;
				value	= item.value;
				if ( ( item.value && ( !term || matcher.test( text ) ) || item.related === "true" ) ) {
					text = self.format_result_text( term, text, value );
					resultObj = {
						label: text,
						value: item.value,
						searchKeywords: item.searchKeywords !== undefined ? item.searchKeywords : "false",
						related: item.related !== undefined ? item.related : "false"
					};
					return resultObj;
				}
			} );
		},

		setup_search: function() {
			var self, wsu_search, search_input, focuseitem = {};

			self = this;//Hold to preserve scop
			wsu_search = self._get_globals( "wsu_search" ).refresh();
			search_input = self._get_globals( "search_input" ).refresh();
			focuseitem = {};

			search_input.autosearch( {

				appendTo:			self.search_options.result.appendTo,
				showRelated:		self.search_options.result.showRelated,
				relatedHeader:		self.search_options.result.relatedHeader,
				minLength:			self.search_options.search.minLength,

				source: function( request, response )  {
					self.start_search( request, function( data ) {
						response( data );
					} );
				},
				search: function( ) {
					focuseitem = {};
				},
				select: function( e, ui ) {
					var id, term;
					id = ui.item.searchKeywords;
					term = $( ui.item.label ).text();
					search_input.val( term );
					search_input.autosearch( "close" );
					return false;
				},
				focus: function( e, ui ) {
					search_input.val( $( ui.item.label ).text() );
					focuseitem = {
						label:ui.item.label
					};
					e.preventDefault();
				},
				open: function( ) {},
				close: function( e ) {
					e.preventDefault();
					return false;
				}
			} ).data( "autosearch" );

			search_input.on( "keydown", function( e ) {
				if ( e.keyCode === $.ui.keyCode.TAB && search_input.is( $( ":focus" ) ) ) {
					e.preventDefault();
				}
				if ( e.which === 13 ) {
					search_input.autosearch( "close" );
				}
			} );

			search_input.off( "click touchend" ).on( "click touchend", function( e ) {
				e.stopPropagation();
				e.preventDefault();
			} );

			$( "#wsu-search form" ).submit( function() {
				var scope, site, cx, cof, search_term, search_url;
				scope = wsu_search.attr( "data-default" );
				site = " site:" + window.location.hostname;
				if ( scope === "wsu.edu" ) {
					site = "";
				}
				cx = "cx=004677039204386950923:xvo7gapmrrg";
				cof = "cof=FORID%3A11";
				search_term = search_input.val();
				search_url = "https://search.wsu.edu/default.aspx?" + cx + "&" + cof + "&q=" + search_term + site;
				window.location.href = search_url;
				return false;
			} );
		}
	} );
}( jQuery ) );

/*!
*
* Depends:
*		jquery.ui.spine.js
*/
/*jshint multistr: true */
( function( $ ) {
	$.extend( $.ui.spine.prototype, {
		social_init: function( options ) {
			$.extend( this.social_options, options );

			this._set_globals( this.social_globals );
			this.social_create();
		},
		/**
		 * These default options can be overridden with an object before
		 * the Spine framework is started and with `$('body').spine( spineoptions )`.
		 *
		 * NOTE: The structure of these social options **will** change and could be
		 * deprecated in a future release. Please communicate via the WSU Spine repository
		 * when using these so that we can reach out before a transition in the future.
		 *
		 * https://github.com/washingtonstateuniversity/WSU-spine/issues/230
		 */
		social_options:{
			share_text:"You should know ...",
			twitter_text:"You should know...",
			twitter_handle:"wsupullman",
			linkedin_source:"wsu.edu"
		},
		social_globals: {
			share_block: $( "#wsu-share" )
		},
		social_create: function() {
			var self, share_block, share_text, current_url, wsu_actions, sharehtml, twitter_text, twitter_handle, linkedin_source;
			self = this;//Hold to preserve scope
			share_block = self._get_globals( "share_block" ).refresh();
			if ( !share_block.length ) {
				share_text = encodeURIComponent( this.social_options.share_text );
				twitter_text = encodeURIComponent( this.social_options.twitter_text );
				twitter_handle = encodeURIComponent( this.social_options.twitter_handle );
				current_url = self._get_globals( "current_url" );
				wsu_actions = self._get_globals( "wsu_actions" ).refresh();

				sharehtml  = "<section id='wsu-share' class='spine-share spine-action closed'>";
				sharehtml += "<ul>";
				sharehtml += "<li class='by-facebook'><a href='https://www.facebook.com/sharer/sharer.php?u=" + current_url + "'>Facebook</a></li>";
				sharehtml += "<li class='by-twitter'><a href='https://twitter.com/intent/tweet?text=" + twitter_text + "&url=" + current_url + "&via=" + twitter_handle + "' target='_blank'>Twitter</a></li>";
				sharehtml += "<li class='by-googleplus'><a href='https://plus.google.com/share?url=" + current_url + "'>Google+</a></li>";
				sharehtml += "<li class='by-linkedin'><a href='https://www.linkedin.com/shareArticle?mini=true&url=" + current_url + "&summary=" + share_text + "&source=" + linkedin_source + "' target='_blank'>Linkedin</a></li>";
				sharehtml += "<li class='by-email'><a href='mailto:?subject=" + share_text + "&body=" + current_url + "'>Email</a></li>";
				sharehtml += "</ul>";
				sharehtml += "</section>";

				self.setup_tabs( "share", sharehtml );
			} // End Share Generation
		}
	} );
}( jQuery ) );

( function( $ ) {
	"use strict";
	$( document ).ready( function() {
		$( "html" ).removeClass( "no-js" ).addClass( "js" );
		var spineoptions = window.spineoptions || {};
		$.spine( spineoptions );
	} );
} )( jQuery );

//# sourceMappingURL=spine.js.map