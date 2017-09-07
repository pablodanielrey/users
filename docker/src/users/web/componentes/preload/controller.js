
app.controller("PreloadCtrl", ["$scope", "$http", '$state', function ($scope, $http, $state) {

  $scope._inicializar = function() {
    if ($scope.$parent.config != null && $scope.$parent.config.usuario != null) {
      var uid = $scope.$parent.config.usuario['sub']
      $state.go('perfil', {uid: uid});
    }
  }

  $scope.$on('config', $scope._inicializar);

  $scope._inicializar();

}]);
