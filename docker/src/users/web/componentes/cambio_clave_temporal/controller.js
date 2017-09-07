
app.controller("CambioClaveTempCtrl", ["$scope", "$resource", "$timeout", '$state', '$stateParams', function ($scope, $resource, $timeout, $state, $stateParams) {

  $scope.uid = $stateParams['uid']
  $scope.res = { };
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

  $scope.setearError = function(err) {
    $state.go('cambio_clave_temporal.' + err.error);
  }

  $scope.cambiarClave = function() {
    if ($scope.view.clave1 != $scope.view.clave2) {
      // no debería ocurrir pero por las dudas lo chequeo
      console.log('las claves no son iguales');
      return;
    }
    var c = new $scope.res.Clave({clave:$scope.view.clave1});
    c.$save({uid:$scope.uid}, function(c2) {
      $scope.view.clave1 = '';
      $scope.view.clave2 = '';
      $state.go('cambio_clave_temporal.cambio_exitoso');
    }, function(err) {
      console.log(err);
      $scope.setearError(err.data);
    })
  }

  // inicializar
  $scope.$parent.obtener_config().then(
    function(c) {
      var api = c.data.users_api_url;
      $scope.res.Clave = $resource(api + '/usuarios/:uid/claves/', {uid:$scope.uid});
      $state.go('cambio_clave_temporal.ingresar_clave');
    },
    function(err) {
      console.log(err);
      $scope.setearError(err.data);
    }
  );


}]);
