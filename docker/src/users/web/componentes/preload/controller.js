
app.controller("PreloadCtrl", ["$scope", "$http", '$timeout', '$state', function ($scope, $http, $timeout, $state) {

  $scope._inicializar = function() {
    $timeout(function() {
      if ($scope.$parent.config != null && $scope.$parent.config.usuario != null) {
        var uid = $scope.$parent.config.usuario['sub']
        $state.go('perfil', {uid: uid});
      }
    }, 5000);
  }

  $scope.$on('config', $scope._inicializar);

  $scope._inicializar();

}]);
