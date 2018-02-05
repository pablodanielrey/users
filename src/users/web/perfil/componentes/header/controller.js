
app.controller("HeaderCtrl", ["$scope", "$location", "$resource", "$timeout", "$window", "$state", function ($scope, $location, $resource, $tiemout, $window, $state) {

  $scope.view = {
    logo: '/img/usersico.gif',
    usuario: null
  };

  $scope.cambiarClave = function() {
    $state.go('cambio_clave',{uid:$scope.view.usuario.sub});
  }

  $scope.salir = function() {
    $window.location.href = 'https://consent.econo.unlp.edu.ar/logout';
  }

  $scope.$on('config', function(c) {
    $scope.view.usuario = $scope.$parent.config.usuario;
  });

}]);
