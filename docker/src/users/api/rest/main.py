import logging
logging.getLogger().setLevel(logging.INFO)
import sys
from flask import Flask, abort, make_response, jsonify, url_for, request, json, send_from_directory
from users.model import UsersModel
from flask_jsontools import jsonapi

from rest_utils import register_encoder

from . import reset

app = Flask(__name__)
register_encoder(app)
reset.registrarApiReseteoClave(app)


@app.route('/users/api/v1.0/usuarios/', methods=['OPTIONS'])
@app.route('/users/api/v1.0/usuarios/<uid>', methods=['OPTIONS'])
@app.route('/users/api/v1.0/usuarios/<uid>/claves/', methods=['OPTIONS'])
@app.route('/users/api/v1.0/correos/', methods=['OPTIONS'])
@app.route('/users/api/v1.0/correos/<uid>', methods=['OPTIONS'])
@app.route('/users/api/v1.0/enviar_confirmar_correo/<cid>', methods=['OPTIONS'])
@app.route('/users/api/v1.0/confirmar_correo/<uid>/<code>', methods=['OPTIONS'])
def options(*args, **kargs):
    '''
        para autorizar el CORS
        https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
    '''
    print(request.headers)
    o = request.headers.get('Origin')
    rm = request.headers.get('Access-Control-Request-Method')
    rh = request.headers.get('Access-Control-Request-Headers')

    r = make_response()
    r.headers['Access-Control-Allow-Methods'] = 'PUT,POST,GET,HEAD,DELETE'
    r.headers['Access-Control-Allow-Origin'] = '*'
    r.headers['Access-Control-Allow-Headers'] = rh
    r.headers['Access-Control-Max-Age'] = 1
    return r


@app.route('/users/api/v1.0/usuarios/', methods=['GET'], defaults={'uid':None})
@app.route('/users/api/v1.0/usuarios/<uid>', methods=['GET'])
@jsonapi
def usuarios(uid):
    offset = request.args.get('offset',None,int)
    limit = request.args.get('limit',None,int)
    mostrarClave = request.args.get('c',False,bool)
    if not uid:
        dni = request.args.get('dni',None,str)
        return UsersModel.usuarios(dni=dni, retornarClave=mostrarClave, offset=offset, limit=limit)
    else:
        us = UsersModel.usuarios(usuario=uid, retornarClave=mostrarClave)
        return None if len(us) == 0 else us[0]

@app.route('/users/api/v1.0/usuarios/<uid>', methods=['PUT','POST'])
@jsonapi
def actualizar_usuario(uid):
    datos = json.loads(request.data)
    UsersModel.actualizar_usuario(uid, datos)

@app.route('/users/api/v1.0/usuarios/<uid>/claves/', methods=['PUT','POST'])
@jsonapi
def crear_clave(uid):
    data = json.loads(request.data)
    if 'clave' in data:
        return UsersModel.crear_clave(uid, data['clave'])
    else:
        abort(400)

@app.route('/users/api/v1.0/usuarios/<uid>/claves/', methods=['GET'])
@jsonapi
def obtener_claves(uid):
    return UsersModel.claves(uid=uid)

@app.route('/users/api/v1.0/claves/', methods=['GET'], defaults={'cid':None})
@app.route('/users/api/v1.0/claves/<cid>', methods=['GET'])
@jsonapi
def claves(cid):
    return UsersModel.claves(cid=cid)


@app.route('/users/api/v1.0/correos/', methods=['GET'], defaults={'cid':None})
@app.route('/users/api/v1.0/correos/<cid>', methods=['GET'])
@jsonapi
def correos(cid):
    offset = request.args.get('offset',None,int)
    limit = request.args.get('limit',None,int)
    uid = request.args.get('uid',None,str)
    h = request.args.get('h',False,bool)
    return UsersModel.correos(usuario=uid, historico=h, offset=offset, limit=limit)

@app.route('/users/api/v1.0/correos/', methods=['PUT','POST'])
@jsonapi
def agregar_correo():
    uid = request.args.get('uid',None,str)
    assert uid != None
    datos = json.loads(request.data)
    UsersModel.agregar_correo(uid, datos)

@app.route('/users/api/v1.0/correos/<cid>', methods=['DELETE'])
@jsonapi
def eliminar_correo(cid):
    UsersModel.eliminar_correo(cid)

@app.route('/users/api/v1.0/enviar_confirmar_correo/<cid>', methods=['PUT','POST'])
@jsonapi
def enviar_confirmar_correo(cid):
    datos = json.loads(request.data)
    UsersModel.enviar_confirmar_correo(cid, datos)

@app.route('/users/api/v1.0/confirmar_correo/<cid>/<code>', methods=['PUT','POST'])
@jsonapi
def confirmar_correo(cid, code):
    assert cid is not None
    assert code is not None
    UsersModel.confirmar_correo(cid, code)


@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'

    r.headers['Access-Control-Allow-Origin'] = '*'
    return r

def main():
    app.run(host='0.0.0.0', port=5001, debug=True)

if __name__ == '__main__':
    main()
