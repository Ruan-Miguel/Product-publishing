# Product-publishing
Api para publicação de produtos


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
