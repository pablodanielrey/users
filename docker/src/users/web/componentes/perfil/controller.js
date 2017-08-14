
app.controller("PerfilCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", "Upload",
              function ($scope, $location, $routeParams, $resource, $timeout, Upload) {

  var Usuario = $resource('http://127.0.0.1:7001/users/api/v1.0/usuarios/:id', {id:null});
  var Correo = $resource('http://127.0.0.1:7001/users/api/v1.0/correos/:id', {id:null},
                                {
                                    'enviar_confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/enviar_confirmar_correo/:id' },
                                    'confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/confirmar_correo/:id/:code' }
                                });


    // -------------- manejo de pantallas y errores ------------------------------------------------------ //
    $scope.$parent.estilos = ['EstadoPerfil'];
    $timeout(function() {
      $scope.$parent.estilo = 'EstadoPerfil';
    });

    $scope.$parent.errores_posibles = ['ErrorCorreo','ErrorEnviandoConfirmacion'];
    //////////////////


  $scope.parm = $routeParams;
  $scope.mensaje = 'Cargando';


  $scope.usuario = {
    nombre:'',
    apellido:'',
    dni:''
  }
  $scope.correos = [];
  $scope.emailAAgregar = '';


  $scope.upload = function (dataUrl, name) {
      Upload.upload({
          url: 'http://163.10.56.57:9001/files/api/v1.0/archivo/',
          data: {
              fileName: name,
              file: Upload.dataUrltoBlob(dataUrl, name)
          },
      }).then(function (response) {
          $timeout(function () {
              $scope.result = response.data;
          });
      }, function (response) {
          if (response.status > 0) $scope.errorMsg = response.status
              + ': ' + response.data;
      }, function (evt) {
          $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
      });
    };


  var usuarios = Usuario.query({dni:$routeParams['dni']}, function() {
    $scope.usuario = usuarios[0];
    $scope.correos = Correo.query({uid:$scope.usuario.id}, function() {
    });
  });

  $scope.actualizarUsuario = function(usuario) {
    usuario.$save({id:usuario.id}, function() {
    });
  };


  $scope.esInstitucional = function(correo) {
    console.log(correo.email.indexOf('econo.unlp.edu.ar') !== -1);
    return correo.email.indexOf('econo.unlp.edu.ar') !== -1;
  }

  $scope.eliminarCorreo = function(correo) {
    correo.$delete({id:correo.id}, function(correo, headers) {
      $scope.correos = Correo.query({uid:$scope.usuario.id});
    });
  };

  $scope.enviarConfirmarCorreo = function(correo) {
    correo.$enviar_confirmar({id:correo.id}, function() {
      $scope.correos = Correo.query({uid:$scope.usuario.id});
    });
  }

  $scope.confirmarCorreo = function(correo) {
    correo.$confirmar({id:correo.id, code:correo.codigo}, function() {
      $scope.correos = Correo.query({uid:$scope.usuario.id});
    });
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
