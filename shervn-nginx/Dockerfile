FROM nginx:stable-alpine

COPY ./shervn-frontend/build/ /usr/share/nginx/html
COPY ./shervn-nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./shervn-nginx/ssl.conf /etc/nginx/conf.d/ssl.conf

RUN mkdir certs

COPY ./shervn-nginx/certs/fullchain.pem /certs/fullchain.pem
COPY ./shervn-nginx/certs/privkey.pem /certs/privkey.pem

EXPOSE 443
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
