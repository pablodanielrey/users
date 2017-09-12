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
    templateUrl: '/reset_clave/componentes/reset_clave/templates/ingrese_dni.html'
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

  .state('reset_clave.TokenExpiradoError', {
    templateUrl: 'componentes/reset_clave/templates/error_expirado.html'
  })
  .state('reset_clave.SeguridadError', {
    templateUrl: 'componentes/reset_clave/templates/error_expirado.html'
  })
  .state('reset_clave.UsuarioNoEncontradoError', {
    templateUrl: 'componentes/reset_clave/templates/error_dni_inexistente.html'
  })
  .state('reset_clave.NoTieneCuentaAlternativaError', {
    templateUrl: 'componentes/reset_clave/templates/error_dni_sin_cuenta_alternativa.html'
  })
  .state('reset_clave.EnvioCodigoError', {
    templateUrl: 'componentes/reset_clave/templates/error_envio.html'
  })
  .state('reset_clave.LimiteDeEnvioError', {
    templateUrl: 'componentes/reset_clave/templates/error_limite_de_envios.html'
  })
  .state('reset_clave.CodigoIncorrectoError', {
    templateUrl: 'componentes/reset_clave/templates/error_de_codigo.html'
  })
  .state('reset_clave.LimiteDeVerificacionError', {
    templateUrl: 'componentes/reset_clave/templates/error_limite_de_verificacion.html'
  })
  .state('reset_clave.ClaveError', {
    templateUrl: 'componentes/reset_clave/templates/error_cambiando_clave.html'
  })
  .state('reset_clave.FormatoDeClaveIncorrectoError', {
    templateUrl: 'componentes/reset_clave/templates/error_formato_de_clave.html'
  })
  .state('reset_clave.CorreoBloqueadoError', {
    templateUrl: 'componentes/reset_clave/templates/error_correo_bloqueado_spam.html'
  })





}]);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
