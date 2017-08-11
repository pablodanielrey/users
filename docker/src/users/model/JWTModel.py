import datetime
import jwt

class JWTModel:

    def __init__(self, clave):
        self.clave = clave

    def encode_auth_token(self, datos=''):
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, seconds=60),
            'iat': datetime.datetime.utcnow(),
            'datos': datos
        }
        token = jwt.encode(payload, self.clave, algorithm='HS256')
        return token.decode()

    def decode_auth_token(self, token):
        '''
            Decodifica el token.
            tira:
                ExpiredSignatureError
                InvalidTokenError
        '''
        payload = jwt.decode(token, self.clave)
        return payload['datos']
