'use strict';

module.exports = {
  dist: {
    options: {
      module: 'trackYourPackage',
      htmlmin: '<%= htmlmin.dist.options %>',
      usemin: 'scripts/scripts.js'
    },
    cwd: '<%= yeoman.app %>',
    src: ['scripts/**/*.html'],
    dest: '.tmp/templateCache.js'
  }
};
