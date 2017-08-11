
app.controller("ReseteoClaveCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", function ($scope, $location, $routeParams, $resource, $tiemout) {

  $scope.estilos = ['paso1', 'paso2', 'paso3', 'paso4', 'paso5', 'paso6'];
  $scope.estilo_actual = 0;
  $scope.estilo = $scope.estilos[$scope.estilo_actual];

  $scope.pasoSiguiente = function() {
    $scope.estilo_actual = ($scope.estilo_actual + 1) % $scope.estilos.length;
    $scope.estilo = $scope.estilos[$scope.estilo_actual];
  }

  $scope.pasoAnterior = function() {
    $scope.estilo_actual = ($scope.estilo_actual + $scope.estilos.length - 1) % $scope.estilos.length;
    $scope.estilo = $scope.estilos[$scope.estilo_actual];
  }


  $scope.errores = ['', 'expirado', 'error1', 'error2', 'error3']
  $scope.error_actual = 0;
  $scope.codigo_error = $scope.errores[$scope.error_actual];
  $scope.error = ''

  $scope.cambiarError = function() {
    if ($scope.error == '') {
      $scope.error = 'error';
    } else {
      $scope.error = '';
    }
  }

  $scope.errorSiguiente = function() {
    $scope.error_actual = ($scope.error_actual + 1) % $scope.errores.length;
    $scope.codigo_error = $scope.errores[$scope.error_actual];
  }

  $scope.errorAnterior = function() {
    $scope.error_actual = ($scope.error_actual + $scope.errores.length - 1) % $scope.errores.length;
    $scope.codigo_error = $scope.errores[$scope.error_actual];
  }


  $scope.view = {
    usuario: {
      nombre: 'Nombre',
      apellido: 'Apellido',
      dni:'12345678',
      correo: {
        email: 'prueba@gmail.com'
      }
    },

    codigo:'',
    timer:1,

    tipos: ['password','text'],
    tipo:'password',
    indice: 0
  }

  $scope.cambiarTipo = function() {
    $scope.view.indice = ($scope.view.indice + 1) % $scope.view.tipos.length;
    $scope.view.tipo = $scope.view.tipos[$scope.view.indice];
  }



}]);
