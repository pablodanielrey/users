
app.controller("PerfilCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", function ($scope, $location, $routeParams, $resource, $tiemout) {

  var Usuario = $resource('http://127.0.0.1:7001/users/api/v1.0/usuarios/:id', {id:null});
  var Correo = $resource('http://127.0.0.1:7001/users/api/v1.0/correos/:id', {id:null},
                                {
                                    'confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/confirmar_correo/:id' }
                                });

  $scope.parm = $routeParams;
  $scope.mensaje = 'Cargando';

  $scope.usuario = {
    nombre:'',
    apellido:'',
    dni:''
  }
  $scope.correos = [];
  $scope.emailAAgregar = '';


  var usuarios = Usuario.query({dni:$routeParams['dni']}, function() {
    $scope.usuario = usuarios[0];
    $scope.correos = Correo.query({uid:$scope.usuario.id});
  });

  $scope.actualizarUsuario = function(usuario) {
    usuario.$save({id:usuario.id});
  };




  $scope.eliminarCorreo = function(correo) {
    correo.$delete({id:correo.id}, function(correo, headers) {
      $scope.correos = Correo.query({uid:$scope.usuario.id});
    });
  };

  $scope.confirmarCorreo = function(correo) {
    correo.$confirmar({id:correo.id});
  }

  $scope.agregarCorreo = function() {
    if ($scope.emailAAgregar == null) {
      return;
    }
    var correo = new Correo({
        email: $scope.emailAAgregar,
        confirmado: false
    });
    correo.$save({uid:$scope.usuario.id}, function(c, headers) {
      $scope.emailAAgregar = '';
      $scope.correos = Correo.query({uid:$scope.usuario.id});
    });

  }

}]);
