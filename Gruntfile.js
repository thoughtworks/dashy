module.exports = function (grunt) {
  grunt.initConfig({
    exec: {
      test: {
        command: './node_modules/.bin/mocha --require should --reporter spec --check-leaks'
      },

      clientTest:{
        command: 'grunt karma'
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
            'public/js/test/testHelper.js',
            'public/js/test/**/*.js'
          ],
          browsers: ['PhantomJS']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('test', ['exec:test', 'exec:clientTest']);
  grunt.registerTask('watch_test', ['exec:watch_test']);

  grunt.registerTask('publish', 'Publish the latest version of this plugin', function() {
    var done = this.async(),
      data = {
        username: process.env.NPM_USERNAME,
        password: process.env.NPM_PASSWORD,
        email: process.env.NPM_EMAIL
      }
      npm = require('npm');
    npm.load({}, function(err) {
      npm.registry.adduser(data.username, data.password, data.email, function(err) {
        if (err) {
          console.log(err);
          done(false);
        } else {
          npm.config.set("email", data.email, "user");
          npm.commands.publish([], function(err) {
            console.log(err || "Published to registry");
            done(!err);
          });
        }
      });
    });
  });
};
