#!/bin/bash
tar -cvzf src.tar.gz ./src
sudo docker build -t users .
