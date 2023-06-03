# IAM
Vue 3 + Typescript + Vite + TailwindCSS
## Production Build
```
docker build -t presta-iam-ui/admin .
```
## Staging Build
```
docker build --build-arg env=staging -t presta-iam-ui/admin .
```
## Local Build
```
docker build --build-arg env=local -t presta-iam-ui/admin .
```