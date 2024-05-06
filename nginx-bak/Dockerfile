FROM owasp/modsecurity-crs:3.3.5-nginx-202402140602
# FROM nginx

EXPOSE 443
EXPOSE 80

RUN mkdir -p /etc/nginx/
RUN mkdir -p /etc/nginx/templates/conf.d

COPY ./cert /etc/nginx
# COPY ./modsecurity /etc/modsecurity.d/owasp-crs/rules
