app = angular.module('MainApp', ['ui.router', 'ngResource','ngFileUpload', 'ngImgCrop' ,'ngMaterial'])

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .warnPalette('red')
    .accentPalette('cyan');
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
  .state('perfil.cargando', {
    url:'/cargando',
    templateUrl: 'componentes/perfil/templates/cargando.html'
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
  .state('perfil.FormatoIncorrecto', {
    url:'/prueba2',
    templateUrl: 'componentes/perfil/templates/error_servidor.html'
  })


  // --- cambio de clave temporal ---

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


  // --- config correo alternativo ----

  $stateProvider
  .state('config_correo_alternativo', {
    url:'/config_correo_alternativo/:uid',
    params: {
      uid: ''
    },
    templateUrl: 'componentes/config_correo_alternativo/index.html',
    controller:'ConfigCorreoAlternativoCtrl'
  })
  .state('config_correo_alternativo.terminos_y_condiciones_alumnos', {
    url:'/terminos_y_condiciones_alumnos',
    templateUrl: 'componentes/config_correo_alternativo/templates/terminos_y_condiciones_alumnos.html'
  })
  .state('config_correo_alternativo.terminos_y_condiciones', {
    url:'/terminos_y_condiciones',
    templateUrl: 'componentes/config_correo_alternativo/templates/terminos_y_condiciones.html'
  })
  .state('config_correo_alternativo.ingresar_correo', {
    url:'/ingresar_correo',
    templateUrl: 'componentes/config_correo_alternativo/templates/ingresar_correo.html'
  })
  .state('config_correo_alternativo.ingresar_codigo', {
    url:'/ingrar_codigo',
    templateUrl: 'componentes/config_correo_alternativo/templates/ingresar_codigo.html'
  })
  .state('config_correo_alternativo.verificado_correctamente', {
    url:'/verificado_correctamente',
    templateUrl: 'componentes/config_correo_alternativo/templates/verificado_correctamente.html'
  })


  .state('config_correo_alternativo.EnvioCodigoError', {
    url:'/error_envio_codigo',
    templateUrl: 'componentes/config_correo_alternativo/templates/error_envio_codigo.html'
  })
  .state('config_correo_alternativo.CodigoIncorrectoError', {
    url:'/error_codigo_incorrecto',
    templateUrl: 'componentes/config_correo_alternativo/templates/error_codigo_incorrecto.html'
  })
  .state('config_correo_alternativo.CorreoBloqueadoError', {
    url:'/error_correo_bloqueado',
    templateUrl: 'componentes/config_correo_alternativo/templates/error_correo_bloqueado.html'
  })
  .state('config_correo_alternativo.SistemaError', {
    url:'/error',
    templateUrl: 'componentes/config_correo_alternativo/templates/error.html'
  })

}]);


app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
