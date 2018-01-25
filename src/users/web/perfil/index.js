
//Controlador Indice
app.controller("IndexCtrl", ["$scope", "$http", '$location', 'sessionService', function ($scope, $http, $location, sessionService) {

  $scope.config = {};

  $scope.obtener_config = function() {
    return $http.get('/config.json');
  };

  $scope.obtener_config().then(function(c) {
    $scope.config = c.data;
    $scope.$broadcast('config', null);
  });


  var data = $location.hash();
  if (data.includes('access_token')) {
    sessionService.config(data);
  }
  /*var data = {
    acces_token: $stateParams['acces_token'],
    expires_in: $stateParams['expires_in'],
    state: $stateParams['state'],
    token_type: $stateParams['token_type'],
    scope: $stateParams['scope']
  };*/
  sessionService.redirect();

}]);
