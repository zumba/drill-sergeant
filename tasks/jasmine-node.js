/*global module:false*/
module.exports = function(grunt) {
        "use strict";

        var exec = require('child_process').exec;

        /**
         * Jasmine test runner
         */
        grunt.registerTask('jasmine-node', 'runs jasmine tests', function(){
                var done = this.async(), // Tells Grunt that an async task is complete
                        child;

                child = exec(
                'jasmine-node --captureExceptions test/spec/*.spec.js',
                function(error, stdout, stderr) {
                        grunt.log.writeln(stdout);
                        grunt.log.writeln(stderr);
                        done(error);
                });
        });
};
