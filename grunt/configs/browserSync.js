'use strict';

module.exports = {
  files: ['<%= yeoman.app %>/styles/sdf-all.css',
    '<%= yeoman.app %>/**/*.html', '<%= yeoman.app %>/**/*.js'],
  options: {
    watchTask: true,
    port: 3001
  }
};
