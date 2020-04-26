FROM nginx:stable-alpine

COPY ./shervn-frontend/build/ /usr/share/nginx/html
COPY ./shervn-nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./shervn-nginx/ssl.conf /etc/nginx/conf.d/ssl.conf

RUN mkdir certs

COPY ./shervn-nginx/certs/nginx-selfsigned.crt /certs/nginx-selfsigned.crt
COPY ./shervn-nginx/certs/nginx-selfsigned.key /certs/nginx-selfsigned.key
COPY ./shervn-nginx/certs/dhparam.pem /certs/dhparam.pem

EXPOSE 443
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
