app = angular.module('MainApp', ['ui.router', 'ngResource','ngFileUpload', 'ngImgCrop' ,'ngMaterial'])

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('deep-purple');
});


app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/preload");

  // --- preload ----

  $stateProvider
  .state('preload', {
    url:'/preload',
    templateUrl: 'componentes/preload/index.html',
    controller:'PreloadCtrl'
  })
  .state('preload.bienvenido', {
    url:'/bienvenido',
    templateUrl: 'componentes/preload/templates/bienvenido.html',
  })
  .state('preload.error', {
    url:'/error',
    templateUrl: 'componentes/preload/templates/error.html',
  })


  // ---- perfil ----

  $stateProvider
  .state('perfil', {
    url:'/perfil',
    params: {
      uid: ''
    },
    templateUrl: 'componentes/perfil/index.html',
    controller:'PerfilCtrl'
  })
  .state('perfil.editar_perfil', {
    url:'/editar_perfil/:uid',
    // params: {
    //   uid: ''
    // },
    templateUrl: 'componentes/perfil/templates/editar_perfil.html'
  })
  .state('perfil.errorActualizandoUsuario', {
    url:'/error_actualizando_usuario',
    templateUrl: 'componentes/perfil/templates/error_actualizando_usuario.html'
  })
  .state('perfil.ErrorEnviandoConfirmacion', {
    url:'/error_enviar_codigo',
    templateUrl: 'componentes/perfil/templates/error_enviar_codigo.html'
  })
  .state('perfil.Errorservidor', {
    url:'/error_servidor',
    templateUrl: 'componentes/perfil/templates/error_servidor.html'
  })
  .state('perfil.UsuarioBloqueado', {
    url:'/error_usuario_bloqueado',
    templateUrl: 'componentes/perfil/templates/error_usuario_bloqueado.html'
  })
  .state('perfil.Mensaje_guardado_con_exito', {
    url:'/mensaje_guardado_con_exito',
    templateUrl: 'componentes/perfil/templates/mensaje_guardado_con_exito.html'
  })
  .state('perfil.cargando', {
    url:'/cargando',
    templateUrl: 'componentes/perfil/templates/preload.html'
  })
  .state('perfil.FormatoIncorrecto', {
    url:'/prueba2',
    templateUrl: 'componentes/perfil/templates/error_servidor.html'
  })


  // --- cambio de clave forzado ---

  $stateProvider
  .state('cambio_clave_temporal', {
    url:'/cambio_clave_temporal/:uid',
    params: {
      uid: ''
    },
    templateUrl: 'componentes/cambio_clave_temporal/index.html',
    controller:'CambioClaveTempCtrl'
  })
  .state('cambio_clave_temporal.ingresar_clave', {
    url:'/ingresar_clave',
    templateUrl: 'componentes/cambio_clave_temporal/templates/ingresar_clave.html'
  })
  .state('cambio_clave_temporal.cambio_exitoso', {
    url:'/cambio_exitoso',
    templateUrl: 'componentes/cambio_clave_temporal/templates/cambio_exitoso.html'
  })
  .state('cambio_clave_temporal.FormatoDeClaveIncorrectoError', {
    url:'/formato_incorrecto',
    templateUrl: 'componentes/cambio_clave_temporal/templates/formato_incorrecto.html'
  })
  .state('cambio_clave_temporal.SistemaError', {
    url:'/error',
    templateUrl: 'componentes/cambio_clave_temporal/templates/error_sistema.html'
  })



}]);


app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
