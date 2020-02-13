FROM nginx:alpine

LABEL Jan Philip Schellenberg <jps@Lumi.education>

COPY docker/client/nginx.conf /etc/nginx/nginx.conf
COPY build/client /usr/share/nginx/html

EXPOSE 80