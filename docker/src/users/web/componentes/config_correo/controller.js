
app.controller("ConfigCorreoCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", function ($scope, $location, $routeParams, $resource, $tiemout) {

    // -------------- manejo de pantallas y errores ------------------------------------------------------ //
    $scope.$parent.errores_posibles = ['FormatoDeClaveIncorrectoError', 'SistemaError'];
    $scope.$parent.mensajes = [];

    $scope.$parent.estados = ['EstadoClaveVencida','EstadoCambioClave','EstadoOK'];
    $timeout(function() {
      $scope.$parent.estado = 'EstadoClaveVencida';
      $scope.$parent.mensaje = {mensaje:'', codigo:''};
    });
    //////////////////


  var Correo = $resource('http://127.0.0.1:7001/users/api/v1.0/correos/:id', {id:null},
                                {
                                    'enviar_confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/enviar_confirmar_correo/:id' },
                                    'confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/confirmar_correo/:id/:code' }
                                });


  $scope.correoPendiente = null;
  $scope.view = {
      correo: '',
      codigo: ''
    };

  $scope.uid = $routeParams['uid'];


  ////////////// chequea las precondiciones y si esta ok entonces pasa al paso1. en caso contrario es redirigido al perfil ////////////

  $scope.chequearPrecondiciones = function() {
    Correo.query({uid:$scope.uid}, function(cc) {
      if (cc != null && cc.length >= 1) {
        var alternativos = $scope._buscarCorreosNoInstitucionales(cc);
        if (alternativos.length >= 1) {
          // redirigir al sitio de perfil.
          alert('redirigiendo /perfil');
        }
      }

      $scope.correoPendiente = null;
      $scope.view.correo = '';
      $scope.view.codigo = '';
      $scope.pasoSiguiente();
    });
  }
  $scope.chequearPrecondiciones();

  ////////////////////////////////////////////////////////////////////////////////////


  $scope._buscarCorreosNoInstitucionales = function(correos) {
    var retorno = [];
    for (var i = 0; i < correos.length; i++) {
      if (correos[i].email.indexOf('econo.unlp.edu.ar') == -1) {
        retorno.push(correos[i]);
      }
    }
    return retorno;
  }

  $scope._buscarCorreoPorId = function(cid, correos) {
    for (var i = 0; i < correos.length; i++) {
      if (correos[i].id == cid) {
        return correos[i];
      }
    }
    return null;
  }

  $scope._buscarCorreoPendiente = function(correo, correos) {
     for (var i = 0; i < correos.length; i++) {
       if (correos[i].email == correo && !correos[i].confirmado) {
         return correos[i];
       }
     }
     return null;
  }


  $scope.agregarCorreo = function() {
    if ($scope.view.correo == null || $scope.view.correo.indexOf('@') == -1) {
      return;
    }
    var correo = new Correo({
        email: $scope.view.correo,
        confirmado: false
    });
    correo.$save({uid:$scope.uid}, function(c, headers) {
      Correo.query({uid:$scope.uid}, function(cc) {
        $scope.correoPendiente = $scope._buscarCorreoPendiente($scope.view.correo, cc);
        if ($scope.correoPendiente == null) {
          alert('no existen correos pendientes con ese email - redirigiendo /perfil');
          return;
        }
        $scope._enviarConfirmarCorreo($scope.correoPendiente);
      });
    });
  }

  $scope._enviarConfirmarCorreo = function(correo) {
    correo.$enviar_confirmar({id:correo.id}, function() {
      Correo.query({uid:$scope.uid}, function(cc) {
          // se carga nuevamente el correo porque ahora trae el hash para verificar.
          $scope.correoPendiente = $scope._buscarCorreoPorId($scope.correoPendiente.id, cc);
          $scope.pasoSiguiente();
      });
    });
  }


  $scope.verificarCorreo = function() {
    $scope.correoPendiente.$confirmar({id:$scope.correoPendiente.id, code:$scope.view.codigo}, function() {
      Correo.query({uid:$scope.uid}, function(cc) {
        $scope.correoPendiente = $scope._buscarCorreoPorId($scope.correoPendiente.id, cc);
        if ($scope.correoPendiente.confirmado) {
          $scope.pasoSiguiente();
        } else {
          alert('no pudo ser verificado');
        }
      });
    });
  }

}]);
