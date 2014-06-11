module.exports = function (grunt) {
  grunt.initConfig({
    exec: {
      test: {
        command: './node_modules/.bin/mocha --require should --reporter spec --check-leaks'
      },

      watch_test: {
        command: './node_modules/.bin/mocha --require should --reporter spec --check-leaks'
      }
    },
    karma: {
      unit: {
        options: {
          singleRun: true,
          frameworks: ['jasmine'],
          files: [
            'public/js/src/vendor/jquery/dist/jquery.js',
            'public/js/src/vendor/angular/angular.js',
            'public/js/src/vendor/angular-route/angular-route.js',
            'public/js/src/vendor/angular-mocks/angular-mocks.js',
            'public/js/src/vendor/moment/moment.js',
            'public/js/src/app.js',
            'public/js/src/*.js',
            'public/js/test/**/*.js'
          ],
          browsers: ['PhantomJS']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['exec:test']);
  grunt.registerTask('watch_test', ['exec:watch_test']);
};
