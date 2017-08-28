### Desafio

Fazer o refactoring de uma API para venda de Pokemons

## Instalação

### Instalação do Node.js 8.4.0

- Node.js versão v8.4.0
- Instruções de instalação [neste link](https://nodejs.org/en/download/package-manager)

### Dependências do Projeto

- Instalação global do componente para producão [PM2](pm2.keymetrics.io)
```bash
npm install -g pm2
```

- Instalação global do componente para homologação [nodemon](https://nodemon.io)
```bash
npm install -g nodemon
```

### Instalação do projeto

```bash
git clone https://github.com/geison20/pagarme-teste.git
npm install
```

## Inicializando a aplicação

### PRODUÇÃO

```bash
npm run start-prod
```

### HOMOLOGAÇÃO

```bash
npm run start-dev
```

### Logs da aplicação

```bash
npm run logs
```

### Iniciar os testes

```bash
npm run test-integration
```

## Rotas

Para poder acessar as rotas de pokemons é necessário antes criar um usuário e se autenticar na API, para assim gerar um token de acesso

### Criar usuário

```
Request:
curl -X POST \
  http://localhost:3000/api/v1/user/create \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'postman-token: 0eef2fd8-3292-27b2-0a21-8151d60edef7' \
  -d 'email=geisonnm%40hotmail.com&name=Geisson&password=!Geisson12345'

Response:
{
    "error": false,
    "code": 201,
    "message": "User created",
    "error_system": null,
    "date": "2017-08-28T19:24:36.409Z"
}
```

### Autenticação no sistema

```
Request:
curl -X POST \
  http://localhost:3000/api/v1/authentication/login \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'postman-token: 0b0ce27a-6999-9462-b5cb-45893f898e9e' \
  -d 'email=geisonnm%40hotmail.com&password=!Geisson12345'

Response:
{
    "error": false,
    "code": 200,
    "message": "Login successfull",
    "user": {
        "id": 1,
        "email": "geisonnm@hotmail.com",
        "name": "Geisson"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnZWlzb25ubUBob3RtYWlsLmNvbSIsIm5hbWUiOiJHZWlzc29uIiwiaWF0IjoxNTAzOTQ5NzIyLCJleHAiOjE1MDM5NjQxMjJ9.nCbEPR8xVXvS3emzdhrJqfsTBhdU1kmGTxW78O_UWY4",
    "date": "2017-08-28T19:48:42.611Z"
}
```

### Criando novos pokemons

```
Request:
curl -X POST \
  http://localhost:3000/api/v1/pokemon/create \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnZWlzb25ubUBob3RtYWlsLmNvbSIsIm5hbWUiOiJHZWlzc29uIiwiaWF0IjoxNTAzOTQ5NzIyLCJleHAiOjE1MDM5NjQxMjJ9.nCbEPR8xVXvS3emzdhrJqfsTBhdU1kmGTxW78O_UWY4' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'postman-token: e783f6f3-3ac1-cae7-886a-b6cf0b1d8f60' \
  -d 'name=Raichu&price=100&stock=3'

Response:
{
    "error": false,
    "code": 201,
    "message": "Pokemon created",
    "error_system": null,
    "pokemon": {
        "id": 1,
        "name": "Raichu",
        "price": "100",
        "stock": "3"
    },
    "date": "2017-08-28T19:58:02.958Z"
}
```

### Listando Pokemons

```
Request:
curl -X GET \
  http://localhost:3000/api/v1/pokemon/all \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnZWlzb25ubUBob3RtYWlsLmNvbSIsIm5hbWUiOiJHZWlzc29uIiwiaWF0IjoxNTAzOTQ5NzIyLCJleHAiOjE1MDM5NjQxMjJ9.nCbEPR8xVXvS3emzdhrJqfsTBhdU1kmGTxW78O_UWY4' \
  -H 'cache-control: no-cache' \
  -H 'postman-token: 17fd85df-b5c8-c63c-2263-b8265a9cee9c'

Response:
{
    "error": false,
    "code": 200,
    "message": "ok",
    "error_system": null,
    "pokemons": [
        {
            "id": 1,
            "name": "Raichu",
            "price": 100,
            "stock": 3
        }
    ],
    "date": "2017-08-28T20:00:05.722Z"
}
```

### Comprando Pokemon

```
Request:
curl -X POST \
  http://localhost:3000/api/v1/pokemon/buy \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJnZWlzb25ubUBob3RtYWlsLmNvbSIsIm5hbWUiOiJHZWlzc29uIiwiaWF0IjoxNTAzOTQ5NzIyLCJleHAiOjE1MDM5NjQxMjJ9.nCbEPR8xVXvS3emzdhrJqfsTBhdU1kmGTxW78O_UWY4' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'postman-token: dfe2df95-8843-2ce2-168b-bc23215567cb' \
  -d 'id=1&quantity=2'

Response:
{
    "error": false,
    "code": 200,
    "message": "ok",
    "date": "2017-08-28T20:05:17.723Z"
}
```
