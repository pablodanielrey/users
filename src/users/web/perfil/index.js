
//Controlador Indice
app.controller("IndexCtrl", ["$scope", "$http", '$location', 'sessionService', function ($scope, $http, $location, sessionService) {

  $scope.config = {};

  $scope.obtener_config = function() {
    return $http.get('/config.json');
  };

  $scope.obtener_config().then(function(c) {
    $scope.config = c.data;
    $scope.$broadcast('config', null);
  });

  sessionService.init();

}]);
