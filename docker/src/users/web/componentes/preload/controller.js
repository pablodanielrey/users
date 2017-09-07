
app.controller("PreloadCtrl", ["$scope", "$http", '$timeout', '$state', function ($scope, $http, $timeout, $state) {

  $scope.view = {
    usuario: $scope.$parent.config.usuario,
    progreso: 0
  };

  $scope.chequear_precondiciones = function() {
    $scope.view.progreso = 0;
    var api = $scope.config.users_api_url;

    // chequeo la clave
    $scope.view.progreso = 10;
    $http.get(api + '/usuarios/' + $scope.config.usuario.sub + '/clave_temporal')
    .then(function(d) {
        $scope.view.progreso = 50;
        if (d.data.debe_cambiarla) {
          $state.go('cambio_clave_temporal');
        } else {
          return $http.get(api + '/usuarios/' + $scope.config.usuario.sub + '/correos/');
        }
      }

    // chequeo los correos
    ).then(function(d) {
        $scope.view.progreso = 90;
        var correos = d.data;
        for (var i = 0; i < correos.length; i++) {
          console.log(correos[i]);
        }

        // voy al perfil
        $scope.view.progreso = 100;
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
