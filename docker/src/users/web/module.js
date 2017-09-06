app = angular.module('MainApp', ['ui.router', 'ngResource','ngFileUpload', 'ngImgCrop' ,'ngMaterial'])

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('deep-purple');
});


app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/perfil/");

  $stateProvider
  .state('perfil', {
    url:'/perfil',
    templateUrl: 'componentes/perfil/index.html',
    controller:'PerfilCtrl'
  })
  .state('perfil.editar_perfil', {
    url:'/editar_perfil',
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


}]);


app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
