import sys
from flask import Flask, abort, make_response, jsonify, url_for

app = Flask(__name__)

@app.route('/users/api/v1.0/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    users = UserModel.findUserByIds([user_id]).fetch()
    return jsonify({'user': task[0]})

def main():
    app.run(host='0.0.0.0', port=5000, debug=True)

if __name__ == '__main__':
    main()
