import logging
logging.basicConfig(level=logging.DEBUG)

import os
import flask
from flask import Flask, request, send_from_directory, jsonify, redirect, url_for
from flask_jsontools import jsonapi

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='/src/users/web')
app.debug = True
app.config['SECRET_KEY'] = 'algo-secreto'
app.config['SESSION_COOKIE_NAME'] = 'users_session'

@app.route('/config.json', methods=['GET'])
@jsonapi
def configuracion():
    return {
        'oidc_auth': '{}/oauth2/auth'.format(os.environ['OIDC_HOST']),
        'oidc_token': '{}/oauth2/token'.format(os.environ['OIDC_HOST']),
        'users_url': os.environ['USERS_URL'],
        'users_api_url': os.environ['USERS_API_URL']
    }

@app.route('/reset_clave/config.json', methods=['GET'])
@jsonapi
def configuracion_reset_clave():
    return {
        'users_url': os.environ['USERS_URL'],
        'users_api_url': os.environ['USERS_API_URL']
    }

@app.route('/reset_clave', methods=['GET'], defaults={'path':None})
@app.route('/reset_clave/<path:path>', methods=['GET'])
def reset_clave(path):
    if not path:
        return redirect('/reset_clave/index.html'), 303
    return send_from_directory(app.static_url_path + '/reset_clave', path)

@app.route('/libs/<path:path>', methods=['GET'])
def send_libs(path):
    return send_from_directory(app.static_url_path + '/libs', path)


@app.route('/', methods=['GET'], defaults={'path':None})
@app.route('/<path:path>', methods=['GET'])
def send(path):
    if not path:
        return redirect('/perfil/index.html'), 303
    return send_from_directory(app.static_url_path, path)

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
    return r

def main():
    app.run(host='0.0.0.0', port=5000, debug=True)

if __name__ == "__main__":
    main()
