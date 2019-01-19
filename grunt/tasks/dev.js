/**
 * Created by razvant on 09.09.2016.
 */
'use strict';

module.exports = function (grunt) {
  grunt.registerTask('dev', [
    'browserSync',
    'watch'
  ]);
};
