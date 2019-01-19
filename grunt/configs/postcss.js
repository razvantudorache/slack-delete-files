'use strict';

module.exports = {
  options: {
    processors: [
      require('autoprefixer')({
        browsers: ['last 2 Chrome versions', 'last 2 Firefox versions', 'ie >= 9', 'last 2 Safari versions', 'last 2 Edge versions']
      }),
      require('cssnano')({
        options: {
          safe: true
        }
      })
    ],
    map: true
  },
  dist: {
    src: '<%= yeoman.app %>/styles/typ-all.css'
  }
};
