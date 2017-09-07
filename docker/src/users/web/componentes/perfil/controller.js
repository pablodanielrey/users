
app.controller('TemplateCtrl', ['$scope', '$window', '$timeout', function($scope, $window, $timeout) {

  $scope.volver = function() {
    $window.history.back();
  }

  $scope.timer = function() {
    $timeout(function() {
      $scope.volver();
    },5000);
  }

}])

app.controller("PerfilCtrl", ["$scope", "$location", "$resource", "$timeout", "$window", "Upload", "$state", '$stateParams',
   function ($scope, $location, $resource, $timeout, $window, Upload, $state, $stateParams) {


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
            function (err) {
              console.log(err);
              alert(err);
            },
            function (evt) {
              console.log(parseInt(100.0 * evt.loaded / evt.total));
            });
        };

        $scope.cambiar_imagen = function() {
          $scope.view.cambiando_imagen_estilo = 'cambiando_imagen';
        }




        $scope.actualizarUsuario = function(usuario) {
          usuario.$save({uid:usuario.id},
            function(r) {
              $state.reload();
            },
            function(err) {
              console.log(err);
              $state.reload();
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
          correo.$delete({cid:correo.id, uid:correo.usuario_id},
            function(correo) {
              $scope.res.Correo.query({uid:$scope.model.usuario.id}, function(cs) {
                $scope.model.correos = cs;
              });
            },
            function(err) {
              alert(err);
            });
        };

        $scope.enviarConfirmarCorreo = function(correo) {
          correo.$enviar_confirmar({cid:correo.id, uid:correo.usuario_id},
            function() {
              $scope.res.Correo.query({uid:$scope.model.usuario.id}, function(cs) {
                $scope.model.correos = cs;
              });
            },
            function(err) {
              alert(err);
            });
        }

        $scope.confirmarCorreo = function(correo) {
          correo.$confirmar({cid:correo.id, uid:correo.usuario_id, codigo:correo.codigo},
            function() {
              $scope.res.Correo.query({uid:$scope.model.usuario.id}, function(cs) {
                $scope.model.correos = cs;
              });
            },
            function(err) {
              alert(err);
            });
        }


        $scope.agregarCorreo = function() {
          if ($scope.model.emailAAgregar == null) {
            return;
          }
          var correo = new $scope.res.Correo({
              email: $scope.model.emailAAgregar,
              confirmado: false
          });
          correo.$save({uid:$scope.model.usuario.id},
            function(c) {
              $scope.model.emailAAgregar = '';
              $scope.res.Correo.query({uid:$scope.model.usuario.id}, function(cs) {
                $scope.model.correos = cs;
              });
            },
            function(err) {
              console.log(err);
              alert(err);
            });

        }


        $scope._inicializar = function() {

          if ($scope.inicializando) {
            return;
          }

          // chequeo si tengo cargada la config del sistema.
          if ($scope.config.usuario == undefined) {
            $scope.$parent.obtener_config().then(
              function(c) {
                console.log(c.data.usuario);
                $scope.config = c.data;

                $scope.inicializando = false;
                $state.go('perfil', {uid: $scope.config.usuario.sub}, {reload: true});
              },
              function(err) {
                console.log(err);
                $scope.inicializando = false;
                $scope.setearError(err.data);
              }
            );
            return;
          }

          // el estado debe tener el uid como parámetro
          if ($stateParams.uid == '') {
            $state.go('perfil', {uid: $scope.config.usuario.sub}, {reload: true});
            return;
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


        $scope.res.Correo.query({uid:$stateParams['uid']}, function(ms) {
           console.log(ms);
           $scope.model.correos = ms;
        });

        $scope._cargar_url_avatar();
        $state.go('perfil.editar_perfil', {uid:$stateParams['uid']});
      }

      $scope._inicializar();


}]);
