
app.controller("ConfigCorreoAlternativoCtrl", ["$scope", "$resource", "$timeout", '$state', '$stateParams', function ($scope, $resource, $timeout, $state, $stateParams) {

  $scope.uid = $stateParams['uid'];
  $scope.res = {
    Correo: null
  };

  $scope.iniciarProceso = function() {
    $state.go('config_correo_alternativo.terminos_y_condiciones');
  }

  $scope.aceptarTerminosYCondiciones = function() {
    $scope.ingresarCorreoAlternativo();
  }

  $scope.ingresarCorreoAlternativo = function() {
    $state.go('config_correo_alternativo.ingresar_correo');
  }

  $scope.agregarCorreo = function() {
    if ($scope.view.correo == null || $scope.view.correo.indexOf('@') == -1) {
      return;
    }
    var correo = new $scope.res.Correo({
        email: $scope.view.correo,
        confirmado: false
    });
    correo.$save({uid:$scope.uid}, function(c, headers) {
      $scope.res.Correo.query({uid:$scope.uid}, function(cc) {
        $scope.correoPendiente = $scope._buscarCorreoPendiente($scope.view.correo, cc);
        if ($scope.correoPendiente == null) {
          console.log('no existen correos pendientes con ese email - redirigiendo /perfil');
          return;
        }
        $scope._enviarConfirmarCorreo($scope.correoPendiente);
      });
    });
  }

  $scope.ingresarCodigo = function() {
    $state.go('config_correo_alternativo.ingresar_codigo');
  }

  $scope.correoVerificado = function() {
    $state.go('config_correo_alternativo.verificado_correctamente');
  }

  $scope.cargarPerfil = function() {
    $state.go('preload');
  }




  $scope.crearRecursos = function() {
    // defino los recursos a usar
    $scope.res = {
      Correo: $resource($scope.$parent.config.users_api_url + '/usuarios/:uid/correos/:cid',
        {
         uid:$stateParams['uid'],
         cid:null
        },
        {
         'enviar_confirmar': {method:'GET', url: $scope.config.users_api_url + '/usuarios/:uid/correos/:cid/enviar_confirmar'},
         'confirmar': {method:'POST', url: $scope.config.users_api_url + '/usuarios/:uid/correos/:cid/confirmar'}
        }
     )
   };

   /*
   $scope.res.Correo.query({uid:$stateParams['uid']}, function(ms) {
      console.log(ms);
      $scope.model.correos = ms;
   });
   */
  }

  $scope.correoPendiente = null;
  $scope.view = {
      correo: '',
      codigo: ''
    };


  ////////////// chequea las precondiciones y si esta ok entonces pasa al paso1. en caso contrario es redirigido al perfil ////////////

  $scope.chequearPrecondiciones = function() {
    // Correo.query({uid:$scope.uid}, function(cc) {
    //   if (cc != null && cc.length >= 1) {
    //     var alternativos = $scope._buscarCorreosNoInstitucionales(cc);
    //     if (alternativos.length >= 1) {
    //       // redirigir al sitio de perfil.
    //       alert('redirigiendo /perfil');
    //     }
    //   }
    //
    //   $scope.correoPendiente = null;
    //   $scope.view.correo = '';
    //   $scope.view.codigo = '';
    //   $scope.pasoSiguiente();
    // });
  }

  ////////////////////////////////////////////////////////////////////////////////////


  $scope._buscarCorreosNoInstitucionales = function(correos) {
    var retorno = [];
    for (var i = 0; i < correos.length; i++) {
      if (correos[i].email.indexOf('econo.unlp.edu.ar') == -1) {
        retorno.push(correos[i]);
      }
    }
    return retorno;
  }

  $scope._buscarCorreoPorId = function(cid, correos) {
    for (var i = 0; i < correos.length; i++) {
      if (correos[i].id == cid) {
        return correos[i];
      }
    }
    return null;
  }

  $scope._buscarCorreoPendiente = function(correo, correos) {
     for (var i = 0; i < correos.length; i++) {
       if (correos[i].email == correo && !correos[i].confirmado) {
         return correos[i];
       }
     }
     return null;
  }




  $scope._enviarConfirmarCorreo = function(correo) {
    correo.$enviar_confirmar({cid:correo.id}, function() {
      $scope.res.Correo.query({uid:$scope.uid}, function(cc) {
          // se carga nuevamente el correo porque ahora trae el hash para verificar.
          $scope.correoPendiente = $scope._buscarCorreoPorId($scope.correoPendiente.id, cc);
          $scope.ingresarCodigo();
      });
    });
  }


  $scope.verificarCorreo = function() {
    $scope.correoPendiente.codigo = $scope.view.codigo;
    $scope.correoPendiente.$confirmar(
        {
          uid:$scope.correoPendiente.usuario_id,
          cid:$scope.correoPendiente.id,
          codigo:$scope.correoPendiente.codigo
        },
      function() {
        $scope.res.Correo.query({uid:$scope.uid}, function(cc) {
          $scope.correoPendiente = $scope._buscarCorreoPorId($scope.correoPendiente.id, cc);
          if ($scope.correoPendiente.confirmado) {
            $scope.correoVerificado();
          } else {
            alert('no pudo ser verificado');
          }
        });
      });
  }




  $scope.crearRecursos();
  $scope.iniciarProceso();

}]);
