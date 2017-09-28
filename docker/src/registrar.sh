#!/bin/bash
python3 users/registrar.py users_web / usuarios.econo.unlp.edu.ar:5005 &
python3 users/registrar.py users_rest /users/api usuario.econo.unlp.edu.ar:5006
