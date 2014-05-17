module.exports = function (grunt) {
  grunt.initConfig({
    exec: {
      test: {
        command: './node_modules/jasmine-node/bin/jasmine-node spec/ --color'
      },

      watch_test: {
        command: './node_modules/jasmine-node/bin/jasmine-node spec/ --autotest --watch spec/ models/ config/ routes/ --color'
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', ['exec:test']);
  grunt.registerTask('watch_test', ['exec:watch_test']);
};
