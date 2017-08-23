
app.controller("PreloadCtrl", ["$scope", "$http", function ($scope, $http) {

  $scope.$parent.estado = 'EstadoPreload';

  $scope.config().then(function(c) {
    console.log(c.data);
    $scope.view.usuario = c.data.usuario;
  });

  $scope.view = {
    usuario:{}
  }

}]);
