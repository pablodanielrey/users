app = angular.module('MainApp', ['ui.router', 'ngResource','ngFileUpload', 'ngImgCrop'])

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
  .state('perfil.ErrorEnviandoConfirmacion', {
    url:'/error_enviar_codigo',
    templateUrl: 'componentes/perfil/templates/error_enviar_codigo.html'
  })
  .state('perfil.ErrorCorreo', {
    url:'/prueba1',
    templateUrl: 'componentes/perfil/templates/error_enviar_codigo.html'
  })
  .state('perfil.FormatoIncorrecto', {
    url:'/prueba2',
    templateUrl: 'componentes/perfil/templates/error_servidor.html'
  })

}]);


app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
