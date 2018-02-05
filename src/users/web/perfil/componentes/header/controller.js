
app.controller("HeaderCtrl", ["$scope", "$location", "$resource", "$timeout", "$window", "$state", "sessionService", function ($scope, $location, $resource, $tiemout, $window, $state, sessionService) {

  $scope.view = {
    logo: '/img/usersico.gif',
    usuario: null
  };

  $scope.cambiarClave = function() {
    console.log(sessionService.getConfig());
    $state.go('cambio_clave',{uid:sessionService.getConfig().id_token_decoded.sub});
  }

  $scope.salir = function() {
    $window.location.href = 'https://consent.econo.unlp.edu.ar/logout';
  }

  $scope.$on('config', function(c) {
    $scope.view.usuario = $scope.$parent.config.usuario;
  });

}]);
