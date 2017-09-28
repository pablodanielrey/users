#!/bin/bash
python3 users/registrar.py users_web / 192.168.0.3:5005 &
python3 users/registrar.py users_rest /users/api 192.168.0.3:5006
