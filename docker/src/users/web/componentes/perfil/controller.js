
app.controller("PerfilCtrl", ["$scope", "$location", "$routeParams", "$resource", "$timeout", "Upload",
   function ($scope, $location, $routeParams, $resource, $timeout, Upload) {

        // -------------- manejo de pantallas y errores ------------------------------------------------------ //
        $scope.$parent.errores_posibles = ['ErrorCorreo','ErrorEnviandoConfirmacion'];
        $scope.$parent.mensajes = ['MensajeGuardadoConExito','MensajeCargando'];

        $scope.$parent.estados = ['EstadoPerfil'];
        $timeout(function() {
          $scope.$parent.estado = 'EstadoPerfil';
          $scope.$parent.mensaje = {mensaje:'', codigo:''};
        });

        //////////////////

        $scope.model = {
          usuario: {},
          correos: [],
          emailAAgregar:''
        }

        var Usuario = $resource($scope.$parent.config.users_api_url + '/usuarios/:uid',
              {
                uid:$routeParams['uid']
              }
          );
        var Correo = $resource($scope.$parent.config.users_api_url + '/usuarios/:uid/correos/:cid',
              {
                uid:$routeParams['uid']
              },
              {
                'enviar_confirmar': {method:'POST', url: $scope.$parent.config.users_api_url + '/usuarios/:uid/correos/:cid/enviar_confirmar'},
                'confirmar': {method:'POST', url: $scope.$parent.config.users_api_url + '/usuarios/:uid/correos/:cid/confirmar'}
              }
          );


        $scope._inicializar = function() {
          if ($scope.$parent.config.users_api_url == undefined) {
            return;
          }
          Usuario.get({uid:$routeParams['uid']}, function(u) {
            console.log(u);
            $scope.model.usuario = u;
          });

          Correo.query({uid:$routeParams['uid']}, function(ms) {
            console.log(ms);
            $scope.model.correos = ms;
          });
        }

        $scope.$on('config', function(e) {
          $scope._inicializar();
        });

        $scope._inicializar();



        $scope.upload = function (dataUrl, name) {
            Upload.upload({
                url: 'http://163.10.56.57:9001/files/api/v1.0/archivo/',
                data: {
                    fileName: name,
                    file: Upload.dataUrltoBlob(dataUrl, name)
                },
            }).then(function (response) {
                $timeout(function () {
                    $scope.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) $scope.errorMsg = response.status
                    + ': ' + response.data;
            }, function (evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            });
          };

        $scope.actualizarUsuario = function(usuario) {
          usuario.$save({uid:usuario.id}, function() {
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
