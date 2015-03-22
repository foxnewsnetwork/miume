/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'miume',
    environment: environment,
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    contentSecurityPolicy: { 
      'connect-src': "'self' wss://*.firebaseio.com",
      "img-src": "'self' http://192.168.0.101",
      "media-src": "'self' http://localhost:*",
      "font-src": "http://fonts.gstatic.com 'self'",
      "style-src": "'self' http://fonts.googleapis.com",
      "script-src": "'self' https://s.ytimg.com",
      "frame-src": "'self' https://www.youtube.com"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    sassOptions: {
      includePaths: [
        'bower_components/materialize/sass',
        'node_modules/compass-mixins/lib'
      ]
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.locationType = "hash";
    ENV.baseURL = "/" + ENV.modulePrefix;
  }

  return ENV;
};
