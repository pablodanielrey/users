
app.controller("PerfilCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", function ($scope, $location, $routeParams, $resource, $tiemout) {

  $scope.parm = $routeParams;

  $scope.usuario = {
    nombre:'',
    apellido:'',
    dni:$routeParams['dni'],
    mails:[]
  }
  $scope.mensaje = 'Cargando';
  $scope.emailAAgregar = '';

  var Usuarios = $resource('http://127.0.0.1:6001/users/api/v1.0/usuarios?d=:dni', {dni:null});
  $scope.usuario = Usuarios.get({dni:$routeParams['dni']});


  $scope.actualizarUsuario = function(usuario) {
    alert(usuario.nombre);
  };

  $scope.eliminarCorreo = function(email) {
    alert(email.email);
  };

  $scope.confirmarCorreo = function(email) {
    alert(email.id);
  }

  $scope.agregarCorreo = function() {
    alert($scope.emailAAgregar);
  }

}]);
