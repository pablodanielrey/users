app = angular.module('MainApp', ['ngRoute', 'ngResource'])

app.config(['$routeProvider', function($routeProvider) {

  $routeProvider
    .when('/config_correo/:uid', {templateUrl: '/componentes/config_correo/index.html', controller:'ConfigCorreoCtrl'})
    .when('/perfil/:dni', {templateUrl: '/componentes/perfil/index.html', controller:'PerfilCtrl'})
    .when('/perfil', {templateUrl: '/componentes/perfil/index.html', controller:'PerfilCtrl'})
    .otherwise({ redirectTo: '/perfil/' });

}]);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
