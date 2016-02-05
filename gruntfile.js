/*global module:false*/
module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
            jshint : {
                    options : {
                            jshintrc : "jshint.json"
                    },
                    source : 'lib/**'
            }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadTasks('tasks');

    // Default task.
    grunt.registerTask('default', ['jshint', 'jasmine-node']);
};
