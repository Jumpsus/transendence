FROM owasp/modsecurity-crs:3.3.4-nginx-alpine-202301110601

RUN mkdir -p /etc/nginx/ssl
RUN mkdir -p share-resource

COPY nginx.conf /etc/nginx/templates/conf.d/default.conf.template
COPY ./files /frontend