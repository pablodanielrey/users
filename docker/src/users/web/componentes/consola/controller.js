app.controller("ConsolaCtrl", ["$scope", "$location", "$window", "$route", function ($scope, $location, $window, $route) {

  $scope.cambiarConsola = function() {
    $scope.mostrar = !$scope.mostrar;
  }

  $scope.actual = 0;

  $scope.estadoSiguiente = function() {
    $scope.actual = ($scope.actual + 1) % $route.routes.length;
    console.log($route.routes[$scope.actual]);
    $location.path($route.routes[$scope.actual].originalPath);
  }

  $scope.estadoAnterior = function() {

  }


}]);
  ////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
