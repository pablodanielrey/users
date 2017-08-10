
app.controller("ConfigCorreoCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", function ($scope, $location, $routeParams, $resource, $tiemout) {

  var Usuario = $resource('http://127.0.0.1:7001/users/api/v1.0/usuarios/:id', {id:null});
  var Correo = $resource('http://127.0.0.1:7001/users/api/v1.0/correos/:id', {id:null},
                                {
                                    'enviar_confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/enviar_confirmar_correo/:id' },
                                    'confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/confirmar_correo/:id/:code' }
                                });

  $scope.estilos = ['paso1','paso2','paso3','paso4'];
  $scope.estilo_actual = 0;
  $scope.estilo = $scope.estilos[$scope.estilo_actual];

  $scope.pasoSiguiente = function() {
    $scope.estilo_actual = ($scope.estilo_actual + 1) % $scope.estilos.length;
    $scope.estilo = $scope.estilos[$scope.estilo_actual];
  }

  $scope.pasoAnterior = function() {
    $scope.estilo_actual = ($scope.estilo_actual + $scope.estilos.length - 1) % $scope.estilos.length;
    $scope.estilo = $scope.estilos[$scope.estilo_actual];
  }

  $scope.correoPendiente = null;
  $scope.view = {
      correo: '',
      codigo: ''
    };

  $scope.uid = $routeParams['uid'];

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
        if ($scope.correoPendiente.email == $scope.view.correo) {
          $scope._enviarConfirmarCorreo($scope.correoPendiente);
        } else {
          // ver como manejamos este error. no debería pasar!!!
          alert('bazungaaaa');
        }
      });
    });
  }

  $scope._enviarConfirmarCorreo = function(correo) {
    correo.$enviar_confirmar({id:correo.id}, function() {
      Correo.query({uid:$scope.uid}, function(cc) {
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
          alert('no funca');
        }
      });
    });
  }

}]);
