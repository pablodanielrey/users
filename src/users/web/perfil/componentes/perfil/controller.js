app.controller("PerfilCtrl", ["$scope", "$location", "$resource", "$timeout", "$window", "Upload", "$state", '$stateParams', 'sessionService',
   function ($scope, $location, $resource, $timeout, $window, Upload, $state, $stateParams, sessionService) {

        $scope.res = {
          Usuario: null,
          Correo: null
        };

        $scope.model = {
          avatar: '',
          usuario: {},
          correos: [],
          emailAAgregar:''
        }

        $scope.view = {
          cambiando_imagen_estilo: ''
        }

        $scope.setearError = function(e) {
          $state.go('perfil.' + e.error);
        }

        $scope.cargando = function() {
          //$state.go('perfil.cargando');
        }

        $scope.recargar = function() {
          $state.go('perfil.editar_perfil', $stateParams);
        }

        $scope.cancelar_cambiar_imagen = function() {
          $scope.view.cambiando_imagen_estilo = '';
          $scope.recargar();
        }


        $scope._cargar_url_avatar = function() {
          var uid = $stateParams['uid'];
          $scope.model.avatar = $scope.config.users_api_url + '/usuarios/' + uid + '/avatar/?' + new Date().getTime();
        }

        $scope.subir_avatar = function(dataUrl, name) {
          // escondo la imagen para cropear
          $scope.view.cambiando_imagen_estilo = '';

          var uid = $stateParams['uid'];
          Upload.upload(
            {
              url: $scope.$parent.config.users_api_url + '/usuarios/' + uid + '/avatar/',
              data: {
                  fileName: name,
                  file: Upload.dataUrltoBlob(dataUrl, name)
              },
            }).then(
            function (response) {
              console.log(response);
              $state.reload();
            },
            function (e) {
              console.log(e);
              $scope.setearError(e);
            },
            function (evt) {
              console.log(parseInt(100.0 * evt.loaded / evt.total));
            });
        };

        $scope.cambiar_imagen = function() {
          $scope.view.cambiando_imagen_estilo = 'cambiando_imagen';
        }


        $scope.actualizarUsuario = function(usuario) {
          $scope.cargando();
          usuario.$save({uid:usuario.id},
            function(r) {
              $scope.recargar();
            },
            function(err) {
              console.log(err);
              $scope.recargar();
            });
        };


        $scope.esInstitucional = function(correo) {
          return correo.email.indexOf('econo.unlp.edu.ar') !== -1;
        }

        $scope.tieneCuentasAlternativas = function() {
          for (var i = 0; i < $scope.model.correos.length; i++) {
            if (!$scope.esInstitucional($scope.model.correos[i])) {
              return true;
            }
          }
          return false;
        }

        $scope.noEsInstitucional = function(correo) {
          return correo.email.indexOf('econo.unlp.edu.ar') == -1;
        }

        $scope.estaConfirmado = function(correo) {
          return correo.confirmado;
        }

        $scope.seEnvioCodigo = function(m) {
          return m.hash != null & m.hash != '';
        }

        $scope.eliminarCorreo = function(correo) {
          $scope.cargando();
          correo.$delete({cid:correo.id, uid:correo.usuario_id},
            function(correo) {
              $scope.res.Correo.query({uid:$scope.model.usuario.id}, function(cs) {
                $scope.model.correos = cs;
                $scope.recargar();
              });
            },
            function(err) {
              $scope.setearError(err);
            });
        };

        /*
        $scope.enviarConfirmarTodosLosCorreos = function() {
          for (var i = 0; i < $scope.model.correos.length; i++) {
            var m = $scope.model.correos[i];
            if (!$scope.esInstitucional(m) && !$scope.seEnvioCodigo(m) && !$scope.estaConfirmado(m)) {
              $timeout(function() {
                $scope.enviarConfirmarCorreo(m);
              },5);
            }
          }
        }
        */

        $scope.enviarConfirmarCorreo = function(correo) {
          $scope.cargando();
          correo.$enviar_confirmar({cid:correo.id, uid:correo.usuario_id},
            function() {
              $scope.res.Correo.query({uid:$scope.model.usuario.id}, function(cs) {
                $scope.model.correos = cs;
                $scope.recargar();
              });
            },
            function(err) {
              $scope.setearError(err);
            });
        }

        $scope.confirmarCorreo = function(correo) {
          $scope.cargando();
          correo.$confirmar({cid:correo.id, uid:correo.usuario_id, codigo:correo.codigo},
            function() {
              $scope.res.Correo.query({uid:$scope.model.usuario.id}, function(cs) {
                $scope.model.correos = cs;
                $scope.recargar();
              });
            },
            function(err) {
              $scope.setearError(err);
            });
        }


        $scope.agregarCorreo = function() {
          if ($scope.model.emailAAgregar == null || $scope.model.emailAAgregar.indexOf('econo.unlp.edu.ar') != -1) {
            return;
          }

          $scope.cargando();
          var correo = new $scope.res.Correo({
              email: $scope.model.emailAAgregar,
              confirmado: false
          });
          correo.$save({uid:$scope.model.usuario.id},
            function(c) {
              $scope.model.emailAAgregar = '';
              $scope.obtener_correos_usuario();
            },
            function(err) {
              console.log(err);
              $scope.setearError(err);
            });

        }


        $scope._inicializar = function() {

          if ($scope.inicializando) {
            return;
          }

          $scope.cargando();

          if ($stateParams.uid == undefined) {
            $scope.inicializando = false;
            $state.go('perfil', {uid: sessionService.getConfig().id_token_decoded.sub}, {reload: true});
          }

          // defino los recursos a usar
          $scope.res = {
            Usuario: $resource(
              $scope.$parent.config.users_api_url + '/usuarios/:uid',
              {
                uid:$stateParams['uid']
              }
            ),
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

         // cargo los recursos.
        $scope.res.Usuario.get({uid:$stateParams['uid']}, function(u) {
           console.log(u);
           $scope.model.usuario = u;
         });

         $scope.obtener_correos_usuario();

        $scope._cargar_url_avatar();
        $state.go('perfil.editar_perfil', {uid:$stateParams['uid']});
      }


      $scope.obtener_correos_usuario = function() {
        $scope.res.Correo.query({uid:$stateParams['uid']}, function(ms) {
           console.log(ms);
           $scope.model.correos = ms;
        });
      }

      $scope._inicializar();


}]);
