module.exports = function (grunt) {
  grunt.initConfig({
    exec: {
      test: {
        command: './node_modules/jasmine-node/bin/jasmine-node spec/ --color --captureExceptions --verbose --forceexit'
      },

      watch_test: {
        command: './node_modules/jasmine-node/bin/jasmine-node spec/ --autotest --watch spec/ models/ config/ routes/ --color --captureExceptions'
      }
    },
    karma: {
      unit: {
        options: {
          singleRun: true,
          frameworks: ['jasmine'],
          files: ['public/assets/js/test/**/*.js'],
          browsers: ['PhantomJS']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['exec:test', "karma:unit"]);
  grunt.registerTask('watch_test', ['exec:watch_test']);
};
