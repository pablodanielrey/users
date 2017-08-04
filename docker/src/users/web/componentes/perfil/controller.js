
app.controller("PerfilCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", function ($scope, $location, $routeParams, $resource, $tiemout) {

  $scope.usuario = {
    nombre:'',
    apellido:'',
    dni:$routeParams[dni],
    mails:[]
  }
  $scope.mensaje = 'Cargando';

  var Usuarios = $resource('http://192.168.0.3:6001/users/api/v1.0/usuarios?d=:dni', {dni:null});
  $scope.usuario = Usuarios.get({dni:$routeParams[dni]});

}]);
