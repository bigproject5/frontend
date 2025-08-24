#!/bin/sh
# entrypoint.sh

# config.template.js를 기반으로 환경 변수 값을 적용하여 config.js를 생성
envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js

# Nginx를 foreground로 실행 (컨테이너가 꺼지지 않게)
nginx -g 'daemon off;'