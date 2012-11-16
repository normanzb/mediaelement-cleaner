/*global module:false*/
module.exports = function(grunt) {

	grunt.loadNpmTasks("grunt-contrib");
	grunt.loadNpmTasks("grunt-buster");
	grunt.loadNpmTasks("grunt-git-describe");
	grunt.loadNpmTasks("grunt-github-upload");

	grunt.registerTask("test", "lint buster");
	grunt.registerTask("dist", "describe copy min concat");
	grunt.registerTask("default", "clean dist");

	grunt.config.init({
		meta : {
			version : "SNAPSHOT",
			banner : "/*!\n" +
				"* MediaElement-Cleaner - <%= meta.version %>\n" +
				"* Copyright (c) <%= grunt.template.today('yyyy') %> " + "Norman Xu <i@qusi.org>\n" +
				"* Licensed MIT\n" +
				"*/",
			dist : {
				max : "dist/mecleaner.js",
				min : "dist/mecleaner.min.js"
			},
			auth : "<json:auth.json>"
		},
		clean : "<config:meta.dist>",
		lint : {
			src: [ "grunt.js", "src/*.js" ]
		},
		copy : {
            dist : {
                files : {
                    "dist/" : "src/**"
                }
            }
        },
		concat : {
			dist : {
				src : [ "<banner>", "<config:meta.dist.max>" ],
				dest : "<config:meta.dist.max>"
			}
		},
		min : {
			dist : {
				src : [ "<banner>", "<config:concat.dist.dest>" ],
				dest : "<config:meta.dist.min>"
			}
		},
		upload : {
			"mecleaner.js" : {
				repo : "normanzb/mediaelement-cleaner",
				auth : "<%= [ meta.auth.username, meta.auth.password ].join(':') %>",
				file : "<config:meta.dist.max>",
				description : "MediaElement-Cleaner - <%= meta.version %>"
			},
			"mecleaner.min.js" : {
				repo : "normanzb/mediaelement-cleaner",
				auth : "<%= [ meta.auth.username, meta.auth.password ].join(':') %>",
				file : "<config:meta.dist.min>",
				description : "MediaElement-Cleaner - <%= meta.version %> (minified)"
			}
		}
	});
};
