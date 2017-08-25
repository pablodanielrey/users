
app.controller("ConfigClaveCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", function ($scope, $location, $routeParams, $resource, $timeout) {

  // -------------- manejo de pantallas y errores ------------------------------------------------------ //
  $scope.$parent.errores_posibles = ['FormatoDeClaveIncorrectoError', 'SistemaError'];
  $scope.$parent.mensajes = [];

  $scope.$parent.estados = ['EstadoClaveVencida','EstadoCambioClave','EstadoOK'];
  $timeout(function() {
    $scope.$parent.estado = 'EstadoClaveVencida';
    $scope.$parent.mensaje = {mensaje:'', codigo:''};
  });
  //////////////////


  // var Clave = $resource('http://127.0.0.1:7001/users/api/v1.0/usuarios/:uid/claves/', {uid:null});

  /*
  var Usuario = $resource('http://127.0.0.1:7001/users/api/v1.0/usuarios/:id', {id:null});
  var Correo = $resource('http://127.0.0.1:7001/users/api/v1.0/correos/:id', {id:null},
                                {
                                    'enviar_confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/enviar_confirmar_correo/:id' },
                                    'confirmar': { method:'POST', url: 'http://127.0.0.1:7001/users/api/v1.0/confirmar_correo/:id/:code' }
                                });
*/

  $scope.uid = $routeParams['uid']
  $scope.view = {
      tipos_de_inputs:['password','text'],
      tipo: 'password',
      indice: 0,
      clave1: '',
      clave2: '',
  };

  $scope.cambiarTipo = function() {
    $scope.view.indice = ($scope.view.indice + 1) % $scope.view.tipos_de_inputs.length;
    $scope.view.tipo = $scope.view.tipos_de_inputs[$scope.view.indice];
  }

  $scope.finalizar = function() {
    $window.location.href = '/';
  }

  $scope.cambiarClave = function() {
    if ($scope.view.clave1 != $scope.view.clave2) {
      alert('las claves no son iguales');
      return;
    }
    // var c = new Clave({clave:$scope.view.clave1});
    // c.$save({uid:$scope.uid}, function(c2) {
    //   $scope.view.clave1 = '';
    //   $scope.view.clave2 = '';
    //   $scope.pasoSiguiente();
    // }, function(err) {
    //   alert(err);
    // })
  }

}]);
