# Product-publishing
Api para publicação de produtos

## Requisitos de funcionamento

1. Mongodb funcionando na porta 27017

## Rotas

- ### Criação de usuário

Cria um usuário e retorna um token de acesso

#### URL

POST http://localhost:8080/users

#### Informações

<table>
  <tr>
    <td>Requer autenticação?</td>
    <td>Não</td>
  </tr>
</table>

#### Parâmetros

<table>
  <tr>
    <td>name</td>
    <td>Required</td>
    <td>Nome atribuído a conta</td>
    <td>string</td>
  </tr>
  <tr>
    <td>email</td>
    <td>Required</td>
    <td>Utilizado para login</td>
    <td>string</td>
  </tr>
  <tr>
    <td>password</td>
    <td>Required</td>
    <td>Utilizado para login</td>
    <td>string</td>
  </tr>
  <tr>
    <td>dateOfBirth</td>
    <td>Required</td>
    <td>Utilizado para definir a idade do usuário</td>
    <td>string no formato: yyyy-mm-dd</td>
  </tr>
</table>

<br/>

- ### Login de usuário

Autentica o usuário no sistema e retorna um token de acesso

#### URL

POST http://localhost:8080/users/login

#### Informações

<table>
  <tr>
    <td>Requer autenticação?</td>
    <td>Não</td>
  </tr>
</table>

#### Parâmetros

<table>
  <tr>
    <td>email</td>
    <td>Required</td>
    <td>string</td>
  </tr>
  <tr>
    <td>password</td>
    <td>Required</td>
    <td>string</td>
  </tr>
</table>

- ### Busca de usuário

Realiza uma busca por usuários que possuam os parâmetros enviados

#### URL

GET http://localhost:8080/users

#### Informações

<table>
  <tr>
    <td>Requer autenticação?</td>
    <td>Não</td>
  </tr>
</table>

#### Parâmetros

<table>
  <tr>
    <td>_id</td>
    <td>Optional</td>
    <td>string</td>
    <td>Caso este parâmetro seja informado, qualquer outro parâmetro q também tenha sido informado será desconsiderado e apenas será retornado o usuário a que esse _id pertence, sem o uso de paginação</td>
  </tr>
  <tr>
    <td>page</td>
    <td>Optional</td>
    <td>unsigned integer</td>
    <td>Caso este parâmetro não seja informado, e a pesquisa em questão fizer uso de paginação, este parâmetro receberá o valor 1 como default</td>
  </tr>
  <tr>
    <td>limit</td>
    <td>Optional</td>
    <td>unsigned integer</td>
    <td>Caso este parâmetro não seja informado, e a pesquisa em questão fizer uso de paginação, este parâmetro receberá o valor 10 como default</td>
  </tr>
  <tr>
    <td>name</td>
    <td>Optional</td>
    <td>string</td>
    <td>Caso este parâmetro seja informado, será feita uma busca por usuários que possuam a string informada inclusa em seus nomes. Para esse parâmetro a busca não diferencia letras maiúsculas e minúsculas</td>
  </tr>
  <tr>
    <td>email</td>
    <td>Optional</td>
    <td>string</td>
    <td>Caso este parâmetro seja informado, será feita uma busca por usuários que possuam a string informada inclusa em seus emails. Para esse parâmetro a busca não diferencia letras maiúsculas e minúsculas</td>
  </tr>
</table>

- ### Remoção de usuário

Remove o usuário e seus produtos do banco de dados com base no token de acesso fornecido

#### URL

DEL http://localhost:8080/users

#### Informações

<table>
  <tr>
    <td>Requer autenticação?</td>
    <td>Sim</td>
  </tr>
</table>

