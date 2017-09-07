
app.controller("PreloadCtrl", ["$scope", "$http", '$timeout', '$state', function ($scope, $http, $timeout, $state) {

  $scope.view = {
    usuario: $scope.$parent.config.usuario
  };

  $scope.chequear_precondiciones = function() {
    var api = $scope.config.users_api_url;

    // chequeo la clave
    $http.get(api + '/usuarios/' + $scope.config.usuario.sub + '/clave_temporal')
    .then(function(d) {
        if (!d.data.debe_cambiarla) {
          $state.go('cambio_clave_temporal');
        } else {
          return $http.get(api + '/usuarios/' + $scope.config.usuario.sub + '/correos/');
        }
      }

    // chequeo los correos
    ).then(function(d) {
        var correos = d.data;
        for (var i = 0; i < correos.length; i++) {
          console.log(correos[i]);
        }

        // voy al perfil
        $timeout(function() {
            var uid = $scope.config.usuario['sub'];
            $state.go('perfil', {uid: uid});
        }, 5000);

      }
    ).catch(function(err) {
      console.log(err);
    });

  }

  $scope._inicializar = function() {
    $state.go('preload.bienvenido');

    $scope.$parent.obtener_config().then(
      function(c) {
        $scope.config = c.data;
        $scope.chequear_precondiciones();
      },
      function(err) {
        console.log(err);
      }
    );
  }

  $scope.$on('config', $scope._inicializar);

  $scope._inicializar();

}]);
