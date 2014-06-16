module.exports = function (grunt) {
  grunt.initConfig({
    exec: {
      test: {
        command: './node_modules/.bin/mocha --require should --reporter spec --check-leaks --recursive'
      },

      watch_test: {
        command: './node_modules/.bin/mocha --require should --reporter spec --check-leaks --recursive'
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
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    }
  });

  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('test', ['exec:test', 'karma']);
  grunt.registerTask('watch_test', ['exec:watch_test']);

  grunt.registerTask('publish', ['bump:patch', 'npm_publish']);

  grunt.registerTask('npm_publish', 'Publish to the npm', function() {
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
