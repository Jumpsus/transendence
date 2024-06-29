FROM owasp/modsecurity-crs:3.3.4-nginx-alpine-202301110601

RUN mkdir -p /etc/nginx/ssl
RUN mkdir -p /share-resource/image

COPY default.png /share-resource/image/

COPY nginx.conf /etc/nginx/templates/conf.d/default.conf.template
COPY ./files /frontend