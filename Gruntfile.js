var Promise = require( "es6-promise" ).polyfill();

module.exports = function( grunt ) {
	grunt.initConfig( {
		pkg: grunt.file.readJSON( "package.json" ),

		stylelint: {
			src: [ "css/*.css" ]
		},

		concat: {
			options: {
				sourceMap: true
			},
			dist: {
				src: "css/*.css",
				dest: "tmp-style.css"
			},
			spine_js: {
				src: [
					"src/js/wsu_autocomplete.js",
					"src/js/ui.spine.js",
					"src/js/ui.spine.framework.js",
					"src/js/ui.spine.search.js",
					"src/js/ui.spine.social.js",
					"src/js/spine.js"
				],
				dest: "js/spine.js"
			},
			video_js: {
				src: [ "src/js/video.js" ],
				dest: "js/video.js"
			},
			graph_js: {
				src: [ "src/js/graph.js" ],
				dest: "js/graph.js"
			},
			animated_list_js: {
				src: [ "src/js/animated-list.js" ],
				dest: "js/animated-list.js"
			}
		},

		postcss: {
			options: {
				map: true,
				diff: false,
				processors: [
					require( "autoprefixer" )( {
						browsers: [ "> 1%", "ie 8-11", "Firefox ESR" ]
					} )
				]
			},
			dist: {
				src: "tmp-style.css",
				dest: "style.css"
			}
		},

		clean: {
			options: {
				force: true
			},
			temp: [ "tmp-style.css", "tmp-style.css.map" ]
		},

		jscs: {
			scripts: {
				src: [ "Gruntfile.js", "src/js/*.js" ],
				options: {
					preset: "jquery",
					requireCamelCaseOrUpperCaseIdentifiers: false, // We rely on name_name too much to change them all.
					maximumLineLength: 250
				}
			}
		},

		jshint: {
			grunt_script: {
				src: [ "Gruntfile.js" ],
				options: {
					curly: true,
					eqeqeq: true,
					noarg: true,
					quotmark: "double",
					undef: true,
					unused: false,
					node: true     // Define globals available when running in Node.
				}
			},
			theme_scripts: {
				src: [ "src/js/*.js" ],
				options: {
					bitwise: true,
					curly: true,
					eqeqeq: true,
					forin: true,
					freeze: true,
					noarg: true,
					nonbsp: true,
					quotmark: "double",
					undef: true,
					unused: true,
					browser: true, // Define globals exposed by modern browsers.
					jquery: true   // Define globals exposed by jQuery.
				}
			}
		},

		uglify: {
			spine_js: {
				src: "js/spine.js",
				dest: "js/spine.min.js"
			},
			video_js: {
				src: "js/video.js",
				dest: "js/video.min.js"
			},
			graph_js: {
				src: "js/graph.js",
				dest: "js/graph.min.js"
			},
			animated_list_js: {
				src: "js/animated-list.js",
				dest: "js/animated-list.min.js"
			}
		},

		phpcs: {
			plugin: {
				src: "./"
			},
			options: {
				bin: "vendor/bin/phpcs --extensions=php --ignore=\"*/vendor/*,*/node_modules/*\"",
				standard: "phpcs.ruleset.xml"
			}
		},

		watch: {
			styles: {
				files: [ "css/*.css", "src/js/*.js" ],
				tasks: [ "default" ],
				option: {
					livereload: 8000
				}
			}
		},

		connect: {
			server: {
				options: {
					open: true,
					port: 8000,
					hostname: "localhost"
				}
			}
		}

	} );

	grunt.loadNpmTasks( "grunt-postcss" );
	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-phpcs" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-contrib-connect" );
	grunt.loadNpmTasks( "grunt-jscs" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-uglify" );
	grunt.loadNpmTasks( "grunt-stylelint" );

	// Default task(s).
	grunt.registerTask( "default", [ "jscs", "jshint", "stylelint", "concat", "postcss", "uglify", "clean" ] );
	grunt.registerTask( "serve", [ "connect", "watch" ] );
};
