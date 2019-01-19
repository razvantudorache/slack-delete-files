// Generated on 2016-03-18 using generator-angular 0.15.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  // with grunt-load-options from package.json - load the tasks from grunt/tasks - https://www.npmjs.com/package/grunt-load-options
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'public',
    dist: 'public/dist'
  };

  var options = {
    config : {
      src : "grunt/configs/*.js"
    },
    yeoman: appConfig
  };

  var configs = require('load-grunt-configs')(grunt, options);

  grunt.initConfig(configs);
};
