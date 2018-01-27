
app.controller("PreloadCtrl", ["$scope", "$http", '$timeout', '$state', 'sessionService', function ($scope, $http, $timeout, $state, sessionService) {

  $scope.view = {
    usuario: $scope.$parent.config.usuario,
    progreso: 0
  };

  $scope.chequear_precondiciones = function() {
    $scope.view.progreso = 0;
    var api = $scope.config.users_api_url;

    // chequeo la clave
    $scope.view.progreso = 30;
    $http.get(api + '/usuarios/' + sessionService.getConfig().id_token_decoded.sub + '/precondiciones')
    .then(function(d) {
        $scope.view.progreso = 60;
        if (d.data.clave.debe_cambiarla) {
          $state.go('cambio_clave_temporal', {'uid':sessionService.getConfig().id_token_decoded.sub});
          return;
        }

        $scope.view.progreso = 80;
        if (!d.data.correos.tiene_alternativo) {
          $state.go('config_correo_alternativo', {'uid':sessionService.getConfig().id_token_decoded.sub});
          return;
        }

        // voy al perfil
        $scope.view.progreso = 100;
        var uid = sessionService.getConfig().id_token_decoded.sub;
        $state.go('perfil', {uid: uid});

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
