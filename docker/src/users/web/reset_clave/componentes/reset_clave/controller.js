
app.controller("ResetClaveCtrl", ["$scope", "$location", "$resource", "$timeout", "$state", function ($scope, $location, $resource, $timeout, $state) {

  // -------------- manejo de pantallas y errores ------------------------------------------------------ //
  // $scope.$parent.errores_posibles = [
  //                   'TokenExpiradoError',
  //                   'UsuarioNoEncontradoError',
  //                   'SeguridadError',
  //                   'NoTieneCuentaAlternativaError',
  //                   'EnvioCodigoError',
  //                   'LimiteDeEnvioError',
  //                   'CodigoIncorrectoError',
  //                   'LimiteDeVerificacionError',
  //                   'ClaveError',
  //                   'FormatoDeClaveIncorrectoError',
  //                   'CorreoBloqueadoError'
  //                 ];
  // $scope.$parent.mensajes = [];
  //
  // $scope.$parent.estados = ['EstadoIngreseSuDNI','EstadoAvisoDeEnvio','EstadoIngreseCodigo','EstadoIngreseClave','EstadoOK'];
  // $timeout(function() {
  //   $scope.$parent.estado = 'EstadoIngreseSuDNI';
  //   $scope.$parent.mensaje = {mensaje:'', codigo:''};
  // });
  //////////////////

  var Reset = null;

  $scope.model = {
    users_api_url: ''
  };

  console.log($state.$current);

  $scope.config().then(
    function(d) {
      console.log(d.data);
      $scope.model.users_api_url = d.data.users_api_url;

      Reset = $resource('', {},
                      {
                          'obtener_token': {
                              method:'GET',
                              url: $scope.model.users_api_url + '/reset/obtener_token'
                          },
                          'obtener_usuario': {
                              method:'GET',
                              url: $scope.model.users_api_url + '/reset/obtener_usuario/:dni',
                              headers: { Authorization: getTokenHeader }
                          },
                          'enviar_codigo': {
                              method:'POST',
                              url: $scope.model.users_api_url + '/reset/enviar_codigo',
                              headers: { Authorization: getTokenHeader }
                          },
                          'verificar_codigo': {
                              method:'POST',
                              url: $scope.model.users_api_url + '/reset/verificar_codigo',
                              headers: { Authorization: getTokenHeader }
                          },
                          'cambiar_clave': {
                              method:'POST',
                              url: $scope.model.users_api_url + '/reset/cambiar_clave',
                              headers: { Authorization: getTokenHeader }
                          },
                      });

      $scope.iniciarProceso();
    },
    function(err) {
      console.log(err);
    });

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

  $scope.cambiarTipo = function() {
    $scope.view.indice = ($scope.view.indice + 1) % $scope.view.tipos.length;
    $scope.view.tipo = $scope.view.tipos[$scope.view.indice];
  }


  $scope.iniciarProceso = function() {
    Reset.obtener_token(function(resp) {
      $scope.token = resp.token;
      $state.go('reset_clave.ingrese_dni');

    }, function(e) {
      console.log(e);
      $scope.setearError(e.data);
    });
  }

  $scope.obtenerDatosDeUsuario = function() {
    if ($scope.view.dni == '') {
      return;
    }
    Reset.obtener_usuario({dni:$scope.view.dni}, function(resp) {
      $scope.token = resp.token;
      $scope.view.usuario = resp.usuario;
      $state.go('reset_clave.aviso_de_envio');

    }, function(e) {
      console.log(e);
      $scope.setearError(e.data);
    })
  }

  $scope.enviarCodigo = function() {
    Reset.enviar_codigo(function(resp) {
      $scope.token = resp.token;
      $state.go('reset_clave.ingresar_codigo');

    }, function(e) {
      console.log(e);
      $state.go('reset_clave.' + e.data.error);

    })

  }

  $scope.verificarCodigo = function() {
    if ($scope.view.codigo == '') {
      return;
    }
    var r = new Reset({codigo:$scope.view.codigo})
    r.$verificar_codigo(function(resp) {
      $scope.token = resp.token;
      $state.go('reset_clave.ingrese_clave');

    }, function(e) {
      console.log(e);
      $scope.setearError(e.data);
    })
  }

  $scope.cambiarClave = function() {
    if ($scope.view.clave1 != $scope.view.clave2 || $scope.view.clave1 == '') {
      return;
    }
    var r = new Reset({clave:$scope.view.clave1})
    r.$cambiar_clave(function(resp) {
      $state.go('reset_clave.cambio_de_clave_exitoso');

    }, function(e) {
      console.log(e);
      $scope.setearError(e.data);
    })
  }


}]);
