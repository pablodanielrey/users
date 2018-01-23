app = angular.module('MainApp', ['ui.router', 'ngResource', 'ngMaterial'])

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .warnPalette('red')
    .accentPalette('cyan');
});

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
    templateUrl: '/reset_clave/componentes/reset_clave/templates/ingrese_dni.html'
  })
  .state('reset_clave.ingrese_codigo', {
    url:'/ingrese_codigo',
    templateUrl: 'componentes/reset_clave/templates/ingrese_codigo.html'
  })
  .state('reset_clave.enviando_codigo', {
    url:'/enviando_codigo',
    templateUrl: 'componentes/reset_clave/templates/enviando_codigo.html'
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

  .state('reset_clave.TokenExpiradoError', {
    url:'/error_expirado',
    templateUrl: 'componentes/reset_clave/templates/error_expirado.html'
  })
  .state('reset_clave.SeguridadError', {
    url:'/error_expirado',
    templateUrl: 'componentes/reset_clave/templates/error_expirado.html'
  })
  .state('reset_clave.UsuarioNoEncontradoError', {
    url:'/error_dni_inexistente',
    templateUrl: 'componentes/reset_clave/templates/error_dni_inexistente.html'
  })
  .state('reset_clave.NoTieneCuentaAlternativaError', {
    url:'/error_dni_sin_cuenta_alternativa',
    templateUrl: 'componentes/reset_clave/templates/error_dni_sin_cuenta_alternativa.html'
  })
  .state('reset_clave.EnvioCodigoError', {
    url:'/error_envio',
    templateUrl: 'componentes/reset_clave/templates/error_envio.html'
  })
  .state('reset_clave.LimiteDeEnvioError', {
    url:'/error_limite_de_envios',
    templateUrl: 'componentes/reset_clave/templates/error_limite_de_envios.html'
  })
  .state('reset_clave.CodigoIncorrectoError', {
    url:'/error_de_codigo',
    templateUrl: 'componentes/reset_clave/templates/error_de_codigo.html'
  })
  .state('reset_clave.LimiteDeVerificacionError', {
    url:'/error_limite_de_verificacion',
    templateUrl: 'componentes/reset_clave/templates/error_limite_de_verificacion.html'
  })
  .state('reset_clave.ClaveError', {
    url:'/error_cambiando_clave',
    templateUrl: 'componentes/reset_clave/templates/error_cambiando_clave.html'
  })
  .state('reset_clave.FormatoDeClaveIncorrectoError', {
    url:'/error_formato_de_clave',
    templateUrl: 'componentes/reset_clave/templates/error_formato_de_clave.html'
  })
  .state('reset_clave.CorreoBloqueadoError', {
    url:'/error_correo_bloqueado_spam',
    templateUrl: 'componentes/reset_clave/templates/error_correo_bloqueado_spam.html'
  })





}]);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
