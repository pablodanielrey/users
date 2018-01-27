/*
  https://jeremymarc.github.io/2014/08/14/oauth2-with-angular-the-right-way

  parche para manejar el tema de autentificación en angular1.
  algo simple pero que resuelve el problema.
*/
var app = angular.module('MainApp');

app.factory('sessionService', ['$location', function($location) {
  var service = {
    data: {
      access_token: '',
      expires_in: 0,
      state: '',
      token_type: '',
      scope: ''
    },

    init: function() {
      service.processUrl();
      service.redirect();
    },

    config: function(config) {
      var params = {};
      var t = config.split('&');
      for (var i = 0; i < t.length; i++) {
         var param  = t[i].split('=');
         var key    = param[0];
         var value  = param[1];
         params[key] = value;
       }
      service.data = params;
    },

    processUrl: function() {
      var data = $location.hash();
      if (data.includes('access_token')) {
        service.config(data);
      }
    },

    redirect: function() {
      if (!service.isLogged()) {
        window.location = service.getAuthOIDCUrl();
      }
    },

    logout: function() {
      $http.get('https://consent.econo.unlp.edu.ar/logout').then(function(d) {
        console.log(d);
      });
    },

    isLogged: function() {
      return service.data.access_token != undefined && service.data.access_token != '';
    },

    getAccessToken: function() {
      return service.data.access_token;
    },

    getAuthOauthUrl: function() {
      return 'https://oidp.econo.unlp.edu.ar/oauth2/auth?client_id=users-ui&response_type=token&state=algodeestado';
    },

    getAuthOIDCUrl: function() {
      var params = {
        'client_id': 'users-ui',
        'response_type': 'id_token token',
        'redirect_uri': 'https://usuarios.econo.unlp.edu.ar',
        'scope': 'openid profile email',
        'state': 'openidstatealgorandom',
        'nonce': 'algorandomageneraryguardarenelservice'
      };
      var p = '';
      for (var k in params) {
        p = p + k + '=' + params[k] + '&';
      };
      console.log(p);
      //return 'https://oidp.econo.unlp.edu.ar/oauth2/auth?' + 'client_id=users-ui&response_type=id_token token&redirect_uri=https://usuarios.econo.unlp.edu.ar&scope=openid profile email&state=sdfdsfdsdfssalgo&nonce=23f3f323f3algo2';
      return 'https://oidp.econo.unlp.edu.ar/oauth2/auth?' + p;
    }
  }
  return service;
}]);

app.factory('OauthHttpInterceptor', ['sessionService', function(sessionService) {
  return {
    'request': function(config) {
      if (sessionService.isLogged()) {
        config.headers['Authorization'] = "Bearer " + sessionService.getAccessToken();
      } else {
        sessionService.redirect();
      }
      return config;
    }
  };
}]);

app.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('OauthHttpInterceptor');
}]);
