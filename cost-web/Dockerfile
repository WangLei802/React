from 172.19.50.78:5000/nginx:latest

COPY dist /usr/share/nginx/html/
ADD ./nginx.conf.template /etc/nginx/conf.d/nginx.conf.template

CMD envsubst < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'