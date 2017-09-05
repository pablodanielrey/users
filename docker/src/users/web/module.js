app = angular.module('MainApp', ['ngRoute', 'ngResource','ngFileUpload', 'ngImgCrop'])

app.config(['$routeProvider', function($routeProvider) {

  $routeProvider
    .when('/preload', {templateUrl: '/componentes/preload/index.html', controller:'PreloadCtrl'})

    /*
      CONFIGURACION DE CORREO ALTERNATIVO
    */

    .when('/config_correo/:uid', {templateUrl: '/componentes/config_correo/index.html', controller:'ConfigCorreoCtrl'})

    /*
      RESETEO DE CLAVE TEMPORAL
    */

    .when('/config_clave/:uid', {
          templateUrl: 'componentes/cambio_clave/index.html',
          controller:'ConfigClaveCtrl'
    })
    .when('/config_clave_fin', {
          templateUrl: 'componentes/cambio_clave/templates/mensaje_fin.html',
          controller:'TemplateCtrl'
    })
    .when('/config_clave_error', {
          templateUrl: 'componentes/cambio_clave/templates/error_sistema.html',
          controller:'TemplateCtrl'
    })

    /*
      RESETEO DE CLAVE
    */

    .when('/reset_clave', {templateUrl: '/componentes/reseteo_clave/index.html', controller:'ReseteoClaveCtrl'})


    /*
      DATOS DE PERFIL
    */

    .when('/perfil/:uid', {
          templateUrl: '/componentes/perfil/index.html',
          controller:'PerfilCtrl'
    })
    .when('/perfil_error_actualizando_usuario', {
          templateUrl: '/componentes/perfil/templates/error_actualizando_usuario.html',
          controller: 'TemplateCtrl'
    })
    .when('/perfil_error_servidor', {
          templateUrl: '/componentes/perfil/templates/error_servidor.html',
          controller: 'TemplateCtrl'
    })
    .when('/perfil_error_enviar_codigo', {
          templateUrl: '/componentes/perfil/templates/error_enviar_codigo.html',
          controller: 'TemplateCtrl'
    })
    .when('/perfil_error_usuario_bloqueado', {
          templateUrl: '/componentes/perfil/templates/error_usuario_bloqueado.html',
          controller:'TemplateCtrl'
    })
    .when('/perfil_guardado_con_exito', {
          templateUrl: '/componentes/perfil/templates/mensaje_guardado_con_exito.html',
          controller:'TemplateCtrl'
    })



    .otherwise({ redirectTo: '/preload' });

}]);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
