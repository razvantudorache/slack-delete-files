'use strict';

module.exports = {
  dist: {
    src: [
      '<%= yeoman.dist %>/scripts/{,*/}*.js',
      '<%= yeoman.dist %>/styles/{,*/}*.css',
      '<%= yeoman.dist %>/styles/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
      '<%= yeoman.dist %>/styles/fonts/*'
    ],
    options: {
      process: function (basename, name, extension) {
        var momentJs = require('moment');

        var date = new Date();

        var formattedDate = momentJs(date).format('YYYYMMDDHHmm');

        return basename + '.' + formattedDate +'.' + extension;
      }
    }
  }
};
