# build stage
FROM node:20-alpine3.17 as build-stage
WORKDIR /presta-iam-ui
COPY package*.json ./
RUN npm run clean
RUN npm install
COPY . .
ARG env=production
RUN npm run ${env}
COPY . .

# production stage
FROM nginx:stable-alpine as production-stage
COPY ./.nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /presta-iam-ui/dist /usr/share/nginx/html/admin
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
