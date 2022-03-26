# Vue 3 + Typescript + Vite + TailwindCSS

## Deployment Docker

## Production Deployment
- docker build -t presta-iam-ui/admin .
- docker run -it -p 8080:80 --rm --name dockerize-presta-iam-ui presta-iam-ui/admin

## Local Deployment
- docker build -t presta-iam-ui/admin -f Dockerfile.dev .
- docker run -it -p 8080:80 --rm --name dockerize-presta-iam-ui presta-iam-ui/admin