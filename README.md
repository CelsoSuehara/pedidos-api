# pedidos-api

Simples API de pedidos em nodejs com mongodb.

# Pacotes NPM utilizados:
- npm install http express debug --save
- npm install -g nodemon --save-dev
- npm install body-parser --save
- npm install mongoose --save
- npm install guid --save
- npm install md5 --save
- npm install @sendgrid/mail --save
- npm install azure-storage --save
- npm install jsonwebtoken --save

# INICIAL

- Iniciando a aplicação com o nodemon não será necessário reiniciá-la após alterar o código, basta salvar (ctrl + s).

nodemon ./bin/server.js

- Em config.js será necessário atribuir as proriedades:
- string de conexão do bando de dados;
- key do sendgrid;
- key do azure storage;

# INFO

- A aplicação possui autenticação de usuário com senha critografada e token válido por um dia. Os usuários têm sistema de regras de acesso, onde somente os "adm" têm permissão para acessar os métodos dos produtos.

- Utilizado o Sendgrid para o envio de email após cadastro e alteração do cliente.

- Utilizado o Azure Storage para armazenar imagem do produto.

# PARA TESTES

- Em /postman, há um arquivo para importar no Postman e testar as chamadas para a API.

# ESPECIFICAÇÕES

- Controle de usuários
- POST - insere
- PUT/id - altera
- DELETE - exclui
- GET - exibe todos
- GET/id - exibe específico
- POST/authenticate - login do usuário
- POST/refresh-token - para expirar a sessão do usuário

- Controle de produtos
- GET - exibe todos os produtos
- GET/id - exibe específico
- GET/slug - exibe por slug
- GET/tag - exibe por tag
- POST - insere
- DELETE - exclui
- PUT/id - altera

- Controle de pedidos
- POST - insere
- GET - exibe todos
