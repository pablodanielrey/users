
//Controlador Indice
app.controller("IndexCtrl", ["$scope", "$http", function ($scope, $http) {

  $scope.config = function() {
    return $http.get('/reset_clave/config.json');
  }


}]);
