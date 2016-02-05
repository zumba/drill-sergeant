/*global module:false*/
module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        jshint : {
            options : {
                jshintrc : "jshint.json"
            },
            source : 'lib/**'
        },
        mochaTest: {
            test: {
                options: {
                    reporter: "spec",
                    require: "test/support/bootstrap"
                },
                src: ["test/spec/**/*.js"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadTasks('tasks');

    // Default task.
    grunt.registerTask('default', ['jshint', 'mochaTest']);
};
