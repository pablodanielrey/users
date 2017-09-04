app = angular.module('MainApp', ['ngRoute', 'ngResource','ngFileUpload', 'ngImgCrop'])

app.config(['$routeProvider', function($routeProvider) {

  $routeProvider
    .when('/config_correo/:uid', {templateUrl: '/componentes/config_correo/index.html', controller:'ConfigCorreoCtrl'})
    .when('/config_clave/:uid', {templateUrl: '/componentes/cambio_clave/index.html', controller:'ConfigClaveCtrl'})
    .when('/reset_clave', {templateUrl: '/componentes/reseteo_clave/index.html', controller:'ReseteoClaveCtrl'})

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

    .when('/preload', {templateUrl: '/componentes/preload/index.html', controller:'PreloadCtrl'})
    .otherwise({ redirectTo: '/preload' });

}]);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
