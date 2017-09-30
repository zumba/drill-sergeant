/*global module:false*/
module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        eslint : {
            library: 'lib/**'
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
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadTasks('tasks');

    // Default task.
    grunt.registerTask('default', ['eslint', 'mochaTest']);
};
