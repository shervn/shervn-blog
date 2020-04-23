FROM nginx:stable-alpine

COPY ./shervn-frontend/build/ /usr/share/nginx/html
COPY ./shervn-nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]