
app.controller("HeaderCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", "$window", function ($scope, $location, $routeParams, $resource, $tiemout, $window) {

  $scope.config().then(function(c) {
    console.log(c.data);
    $scope.view.usuario = c.data.usuario;
  });

  //var Usuario = $resource('http://127.0.0.1:7001/users/api/v1.0/usuarios/:id', {id:null});

  $scope.view = {
    usuario: null
  };

  $scope.salir = function() {
    $window.location.href = '/logout';
  }

  /*
  Usuario.get({id:'205de802-2a15-4652-8fde-f23c674a1246'}, function(usuario) {
    $scope.view.usuario = usuario;
  }, function(err) {
    alert(err);
  })
  */

}]);
