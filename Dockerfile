# build stage
FROM node:lts-alpine as build-stage
WORKDIR /presta-iam-ui
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run deploy

# production stage
FROM nginx:stable-alpine as production-stage
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /presta-iam-ui/dist /usr/share/nginx/html/admin
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
