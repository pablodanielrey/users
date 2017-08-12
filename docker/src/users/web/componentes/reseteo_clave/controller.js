
app.controller("ReseteoClaveCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", function ($scope, $location, $routeParams, $resource, $tiemout) {

  // -------------- manejo de pantallas y errores ------------------------------------------------------ //

  $scope.estilos = ['paso1', 'paso2', 'paso3', 'paso4', 'paso5', 'paso6', 'paso7'];
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

  $scope.limpiarError = function() {
    $scope.setearError(0);
    $scope.error = '';
  }

  $scope.setearError = function(codigo) {
    $scope.error = 'error';
    $scope.error_actual = codigo;
    $scope.codigo_error = $scope.errores[$scope.error_actual];
  }

  $scope.errorSiguiente = function() {
    $scope.error_actual = ($scope.error_actual + 1) % $scope.errores.length;
    $scope.codigo_error = $scope.errores[$scope.error_actual];
  }

  $scope.errorAnterior = function() {
    $scope.error_actual = ($scope.error_actual + $scope.errores.length - 1) % $scope.errores.length;
    $scope.codigo_error = $scope.errores[$scope.error_actual];
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  $scope.token = '';

  $scope.view = {
    dni: '',

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


  function getTokenHeader(requestConfig) {
    var tk = $scope.token;
    return 'Basic ' + btoa(tk + ':' + 'ignorado');
  }

  var Reset = $resource('', {},
                  {
                      'obtener_token': {
                          method:'GET',
                          url: 'http://127.0.0.1:7001/users/api/v1.0/reset/obtener_token'
                      },
                      'obtener_usuario': {
                          method:'GET',
                          url: 'http://127.0.0.1:7001/users/api/v1.0/reset/obtener_usuario/:dni',
                          headers: { Authorization: getTokenHeader }
                      },
                      'enviar_codigo': {
                          method:'POST',
                          url: 'http://127.0.0.1:7001/users/api/v1.0/reset/enviar_codigo',
                          headers: { Authorization: getTokenHeader }
                      },
                      'verificar_codigo': {
                          method:'POST',
                          url: 'http://127.0.0.1:7001/users/api/v1.0/reset/verificar_codigo',
                          headers: { Authorization: getTokenHeader }
                      },
                      'cambiar_clave': {
                          method:'POST',
                          url: 'http://127.0.0.1:7001/users/api/v1.0/reset/cambiar_clave',
                          headers: { Authorization: getTokenHeader }
                      },


                  });

  $scope.cambiarTipo = function() {
    $scope.view.indice = ($scope.view.indice + 1) % $scope.view.tipos.length;
    $scope.view.tipo = $scope.view.tipos[$scope.view.indice];
  }

  $scope.chequearError = function(resp) {
    if (resp.estado != 'ok') {
      $scope.setearError(resp.codigo);
      return true;
    }
    return false;
  }


  $scope.iniciarProceso = function() {
    Reset.obtener_token(function(resp) {
      if ($scope.chequearError(resp)) { return; };
      $scope.token = resp.token;
      $scope.pasoSiguiente();
    }, function(err) {
      console.log(err);
    });
  }

  $scope.obtenerDatosDeUsuario = function() {
    if ($scope.view.dni == '') {
      return;
    }
    Reset.obtener_usuario({dni:$scope.view.dni}, function(resp) {
      if ($scope.chequearError(resp)) { return; };
      $scope.token = resp.token;
      $scope.view.usuario = resp.usuario;
      $scope.pasoSiguiente();
    }, function(err) {
      console.log(err);
    })
  }

  $scope.enviarCodigo = function() {
    Reset.enviar_codigo(function(resp) {
      if ($scope.chequearError(resp)) { return; };
      $scope.token = resp.token;
      $scope.pasoSiguiente();
    }, function(err) {
      console.log(err);
    })
  }

  $scope.verificarCodigo = function() {
    if ($scope.view.codigo == '') {
      return;
    }
    var r = new Reset({codigo:$scope.view.codigo})
    r.$verificar_codigo(function(resp) {
      if ($scope.chequearError(resp)) { return; };
      $scope.token = resp.token;
      $scope.pasoSiguiente();
    }, function(err) {
      console.log(err);
    })
  }

  $scope.cambiarClave = function() {
    if ($scope.view.clave1 != $scope.view.clave2 || $scope.view.clave1 == '') {
      return;
    }
    var r = new Reset({clave:$scope.view.clave1})
    r.$cambiar_clave(function(resp) {
      if ($scope.chequearError(resp)) { return; };
      $scope.pasoSiguiente();
    }, function(err) {
      console.log(err);
    })
  }


}]);
