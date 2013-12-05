/*global module:false*/
module.exports = function(grunt) {
        "use strict";
        var pkg, name, testServer, http, url, file;

        testServer = {};
        http = require('http');
        url = require('url');
        file = grunt.file;

        pkg = file.readJSON('package.json');
        name = pkg.name;
        grunt.initConfig({
                jshint : {
                        options : {
                                jshintrc : "jshint.json"
                        },
                        source : 'lib/**'
                },
        });
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadTasks('tasks');

        // Default task.
        grunt.registerTask('default', ['jshint']);
};
