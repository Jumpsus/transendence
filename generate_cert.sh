#!bin/bash

SSL_IMAGE="ssl_docker_image"


SSL_CONTAINER="ssl_dockcer_container"

if [ ! -f "~/goinfre/ssl/cert/certificate.crt" ] && [ ! -f "~/goinfre/ssl/cert/private.key" ]; 
then
    docker build ./ssl -t ssl_docker_image;
    mkdir -p ssl/cert;
    chmod 777 -R ssl/cert;
    docker run -v ~/goinfre/ssl/cert:/app/ssl --name ssl_docker_container ssl_docker_image;
    docker stop ssl_docker_container;
    docker rm ssl_docker_container;
    docker rmi ssl_docker_image
fi