from flask import Flask, request, send_from_directory
#from flask_oidc import OpenIDConnect

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='/src/users/web')
app.debug = True
app.config['SECRET_KEY'] = 'algo-secreto'
app.config['OIDC_CLIENT_SECRETS'] = '/src/users/web/client_secrets.json'
#oidc = OpenIDConnect(app)

@app.route('/<path:path>')
#@oidc.require_login
def send(path):
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
