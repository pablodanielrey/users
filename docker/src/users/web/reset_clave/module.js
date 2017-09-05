app = angular.module('MainApp', ['ui.router', 'ngResource'])

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/ingrese_dni");

  $stateProvider
  .state('ingrese_dni', {
    url:'/ingrese_dni',
    templateUrl: 'componentes/reset_clave/templates/ingrese_dni.html',
    controller: 'ResetClaveCtrl'
  })
  .state('aviso_de_envio', {
    url:'/aviso_de_envio',
    templateUrl: 'componentes/reset_clave/templates/aviso_de_envio.html',
    controller: 'ResetClaveCtrl'
  })
  .state('ingrese_codigo', {
    url:'/ingrese_codigo',
    templateUrl: 'componentes/reset_clave/templates/ingrese_codigo.html',
    controller: 'ResetClaveCtrl'
  })
  .state('ingrese_clave', {
    url:'/ingrese_clave',
    templateUrl: 'componentes/reset_clave/templates/ingrese_clave.html',
    controller: 'ResetClaveCtrl'
  })

}]);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
