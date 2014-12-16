		module.exports = function(grunt) {

		<!--  // Project configuration. -->
		 grunt.initConfig({
		     pkg: grunt.file.readJSON('package.json'),

		     autoprefixer: {
		       options: {
		         browsers: ['last 4 versions']
		     	}
		     },
		     sass: {
		      dist: {
		          options: {
		            style: 'expanded',
		          },
		          files: {
		            'style.css': 'style.scss',
		          }
		  		}
		  	},

		  	watch: {
		  	  css: {
		  	    files: '**/*.scss',
		  	    tasks: ['sass','autoprefixer'],
		  	    options: {
		  	      livereload: true,
		  	    }
		  	  }
		  	},
		  	
		 });

		 grunt.loadNpmTasks('grunt-contrib-sass');
		 grunt.loadNpmTasks('grunt-contrib-watch');
		 grunt.loadNpmTasks('grunt-autoprefixer');

		 <!-- // Default task(s). -->
		 grunt.registerTask('default', ['sass', 'autoprefixer', 'watch']);

		 };