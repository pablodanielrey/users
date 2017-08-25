app = angular.module('MainApp', ['ngRoute', 'ngResource','ngFileUpload', 'ngImgCrop'])

app.config(['$routeProvider', function($routeProvider) {

  $routeProvider
    .when('/reset_clave', {templateUrl: 'componentes/reset_clave/index.html', controller:'ResetClaveCtrl'})
    .otherwise({ redirectTo: '/reset_clave' });

}]);

app.config(['$resourceProvider', function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
}]);
