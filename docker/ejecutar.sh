#!/bin/bash
sudo docker run -ti -d --name users -v $(pwd)/src:/src -p 5005:5000 -p 5006:5001 -p 5007:5002 -p 5008:5003 --env-file /home/pablo/gitlab/fce/produccion/users users
