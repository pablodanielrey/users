
app.controller("CambioClaveCtrl", ["$scope", "$resource", "$timeout", '$state', '$stateParams', "sessionService", function ($scope, $resource, $timeout, $state, $stateParams, sessionService) {

  $scope.res = { };
  $scope.view = {
      usuario: {
        name: '',
        lastname: ''
      },
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
    $state.go('perfil.editar_perfil');
  }

  $scope.editarPerfil = function() {
    $state.go('perfil.editar_perfil', {'uid':sessionService.getConfig().id_token_decoded.sub});
  }

  $scope.setearError = function(err) {
    $state.go('cambio_clave.' + err.error);
  }

  $scope.cambiarClave = function() {
    if ($scope.view.clave1 != $scope.view.clave2) {
      // no debería ocurrir pero por las dudas lo chequeo
      console.log('las claves no son iguales');
      return;
    }
    var c = new $scope.res.Clave({clave:$scope.view.clave1});
    c.$save({uid:sessionService.getConfig().id_token_decoded.sub}, function(c2) {
      $scope.view.clave1 = '';
      $scope.view.clave2 = '';
      $state.go('cambio_clave.cambio_exitoso');
    }, function(err) {
      console.log(err);
      $scope.setearError(err.data);
    })
  }

  // inicializar
  $scope.view.usuario = sessionService.getConfig().id_token_decoded;
  var api = $scope.config.users_api_url;
  $scope.res.Clave = $resource(api + '/usuarios/:uid/claves/', {uid:sessionService.getConfig().id_token_decoded.sub});
  $state.go('cambio_clave.ingresar_clave');


}]);
