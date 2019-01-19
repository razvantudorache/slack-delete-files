'use strict';

module.exports = {
  bower: {
    files: ['bower.json'],
    tasks: ['wiredep']
  },
  js: {
    files: ['<%= yeoman.app %>/scripts/**/*.js'],
    tasks: ['eslint']
  },
  css: {
    files: ['<%= yeoman.app %>/scripts/**/*.scss',
      '<%= yeoman.app %>/styles/scss/*.scss',
      '!<%= yeoman.app %>/styles/scss/typ-all.scss'
    ],
    tasks: ['concat', 'sass', 'postcss']
  },
  gruntfile: {
    files: ['Gruntfile.js']
  },
  options: {
    event: ['changed', 'added', 'deleted']
  }
};
