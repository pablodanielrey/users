
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

        $scope.model = {
          avatar: '',
          usuario: {},
          correos: [],
          emailAAgregar:''
        }

        $scope.view = {
          cambiando_imagen_estilo: ''
        }

        var Usuario = $resource($scope.$parent.config.users_api_url + '/usuarios/:uid',
               {
                 uid:$stateParams['uid']
               }
           );
        var Correo = $resource($scope.$parent.config.users_api_url + '/usuarios/:uid/correos/:cid',
               {
                 uid:$stateParams['uid']
               },
               {
                 'enviar_confirmar': {method:'GET', url: $scope.$parent.config.users_api_url + '/usuarios/:uid/correos/:cid/enviar_confirmar'},
                 'confirmar': {method:'POST', url: $scope.$parent.config.users_api_url + '/usuarios/:uid/correos/:cid/confirmar'}
               }
           );


        $scope._obtener_hash_avatar = function(correo) {
          var md = forge.md.md5.create();
          md.update(correo);
          var hs = md.digest().toHex();
          return hs
        }

        $scope._obtener_primer_correo = function() {
          if ($scope.model.correos.length <= 0) {
            return null;
          }
          for (var i = 0; i < $scope.model.correos.length; i++) {
            if ($scope.esInstitucional($scope.model.correos[i])) {
              return $scope.model.correos[i];
            }
          }
          // si no tiene institucional entonces retorno uno de los alternativos
          return $scope.model.correos[0];
        }

        $scope._cargar_url_avatar = function() {
          var correo = $scope._obtener_primer_correo();
          if (correo == null) {
            return;
          }
          var hs = $scope._obtener_hash_avatar(correo.email);
          $scope.model.avatar = $scope.$parent.config.users_api_url + '/avatar/' + hs + '/contenido' + '?' + new Date().getTime();
        }

        $scope.subir_avatar = function(dataUrl, name) {

          // escondo la imagen para cropear
          $scope.view.cambiando_imagen_estilo = '';

          var correo = $scope._obtener_primer_correo();
          if (correo == null) {
            console.log('no tiene correo para asignarle algun avatar');
            return;
          }
          var hs = $scope._obtener_hash_avatar(correo.email);
          Upload.upload(
            {
              url: $scope.$parent.config.users_api_url + '/avatar/' + hs,
              data: {
                  fileName: name,
                  file: Upload.dataUrltoBlob(dataUrl, name)
              },
            }).then(
            function (response) {
              console.log(response);
              $scope.model.avatar = $scope.$parent.config.users_api_url + '/avatar/' + hs + '/contenido' + '?' + new Date().getTime();
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


        $scope._inicializar = function() {

          if ($stateParams.uid == '') {
            $scope.$parent.obtener_config().then(
              function(c) {
                console.log(c.data.usuario);
                $state.go('perfil', {uid: c.data.usuario.sub}, {reload: true});
              },
              function(err) {
                console.log(err);
                $scope.setearError(err.data);
              }
            );
            return;
          }

          if ($scope.$parent.config.users_api_url == undefined) {
            return;
          }
          Usuario.get({uid:$stateParams['uid']}, function(u) {
             console.log(u);
             $scope.model.usuario = u;
           });

          Correo.query({uid:$stateParams['uid']}, function(ms) {
             console.log(ms);
             $scope.model.correos = ms;
             $scope._cargar_url_avatar();
          });

          $state.go('perfil.editar_perfil', {uid:$stateParams['uid']});
        }

        $scope._inicializar();


        $scope.actualizarUsuario = function(usuario) {
          usuario.$save({uid:usuario.id},
            function(r) {
              console.log(r);
              $window.location.reload();
            },
            function(err) {
              console.log(err);
              $window.location.reload();
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
              Correo.query({uid:$scope.model.usuario.id}, function(cs) {
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
              Correo.query({uid:$scope.model.usuario.id}, function(cs) {
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
              Correo.query({uid:$scope.model.usuario.id}, function(cs) {
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
          var correo = new Correo({
              email: $scope.model.emailAAgregar,
              confirmado: false
          });
          correo.$save({uid:$scope.model.usuario.id},
            function(c) {
              $scope.model.emailAAgregar = '';
              Correo.query({uid:$scope.model.usuario.id}, function(cs) {
                $scope.model.correos = cs;
              });
            },
            function(err) {
              console.log(err);
              alert(err);
            });

        }
}]);
