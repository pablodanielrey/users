app = angular.module('MainApp', ['ui.router', 'ngResource'])

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/reset_clave");

  $stateProvider
  .state('reset_clave', {
    url:'/reset_clave',
    templateUrl: 'componentes/reset_clave/index.html',
    controller: 'ResetClaveCtrl'
  })

  // estados del componente de reset_clave

  .state('reset_clave.ingrese_dni', {
    url:'/ingrese_dni',
    templateUrl: 'componentes/reset_clave/templates/ingrese_dni.html'
  })
  .state('reset_clave.aviso_de_envio', {
    url:'/aviso_de_envio',
    templateUrl: 'componentes/reset_clave/templates/aviso_de_envio.html'
  })
  .state('reset_clave.ingrese_codigo', {
    url:'/ingrese_codigo',
    templateUrl: 'componentes/reset_clave/templates/ingrese_codigo.html'
  })
  .state('reset_clave.ingrese_clave', {
    url:'/ingrese_clave',
    templateUrl: 'componentes/reset_clave/templates/ingrese_clave.html'
  })
  .state('reset_clave.cambio_de_clave_exitoso', {
    url:'/cambio_de_clave_exitoso',
    templateUrl: 'componentes/reset_clave/templates/cambio_de_clave_exitoso.html'
  })

  // Errores del sistema y sus templates

  .state('reset_clave.EnvioCodigoError', {
    url:'/error_envio_codigo',
    templateUrl: 'componentes/reset_clave/templates/error_envio.html'
  })


}]);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
