# Product-publishing
API para publicação de produtos

## Requisitos de funcionamento

1. Mongodb funcionando na porta 27017

## Scripts disponíveis

### `yarn dev`

Executa o aplicativo no modo de desenvolvimento<br/>
Qualquer mudança salva reiniciará o servidor automaticamente

### `yarn test`

Executa os testes da API

### `yarn cover`

Mostra a cobertura do código pelos testes

## Autentição

As rotas dessa API que requerem autenticação utilizam de tokens jwt

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

<br/>

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
    <td>Caso este parâmetro seja informado, qualquer outro parâmetro que também tenha sido informado será desconsiderado e apenas será retornado o usuário a que esse _id pertence, sem o uso de paginação</td>
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

<br/>

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

<br/>

- ### Criação de produto

Cria um produto e retorna seu id

#### URL

POST http://localhost:8080/products

#### Informações

<table>
  <tr>
    <td>Requer autenticação?</td>
    <td>Sim</td>
  </tr>
</table>

#### Parâmetros

<table>
  <tr>
    <td>name</td>
    <td>Required</td>
    <td>string</td>
  </tr>
  <tr>
    <td>description</td>
    <td>Optional</td>
    <td>string</td>
  </tr>
  <tr>
    <td>categories</td>
    <td>Required</td>
    <td>array de strings</td>
  </tr>
  <tr>
    <td>price</td>
    <td>Required</td>
    <td>número real positivo</td>
  </tr>
  <tr>
    <td>image</td>
    <td>Required</td>
    <td>string</td>
  </tr>
</table>

<br/>

- ### Busca de produto

Realiza uma busca por produtos que possuam os parâmetros enviados

#### URL

GET http://localhost:8080/products

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
    <td>Caso este parâmetro seja informado, qualquer outro parâmetro que também tenha sido informado será desconsiderado e apenas será retornado o produto a que esse _id pertence, sem o uso de paginação</td>
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
    <td>Caso este parâmetro seja informado, será feita uma busca por produtos que possuam a string informada inclusa em seus nomes. Para esse parâmetro a busca não diferencia letras maiúsculas e minúsculas</td>
  </tr>
  <tr>
    <td>categories</td>
    <td>Optional</td>
    <td>string</td>
    <td>Caso este parâmetro seja informado, será feita uma busca por produtos que possuam essa categoria</td>
  </tr>
  <tr>
    <td>owner</td>
    <td>Optional</td>
    <td>string</td>
    <td>Caso este parâmetro seja informado, será feita uma busca por produtos que pertençam a esse propietário</td>
  </tr>
  <tr>
    <td>maxPrice</td>
    <td>Optional</td>
    <td>números reais positivos</td>
    <td>Caso este parâmetro seja informado, será feita uma busca por produtos q possuam preço menor que este</td>
  </tr>
</table>

<br/>

- ### Atualização de produto

Atualiza as propriedades do produto informado

#### URL

PTCH http://localhost:8080/products

#### Informações

<table>
  <tr>
    <td>Requer autenticação?</td>
    <td>Sim</td>
  </tr>
</table>

#### Parâmetros

<table>
  <tr>
    <td>productId</td>
    <td>Required</td>
    <td>string</td>
  </tr>
  <tr>
    <td>description</td>
    <td>Optional</td>
    <td>string</td>
  </tr>
  <tr>
    <td>categories</td>
    <td>Optional</td>
    <td>array de string</td>
  </tr>
  <tr>
    <td>price</td>
    <td>Optional</td>
    <td>número real positivo</td>
  </tr>
  <tr>
    <td>image</td>
    <td>Optional</td>
    <td>string</td>
  </tr>
</table>

<br/>

- ### Remoção de produto

Remove o produto informado do banco de dados

#### URL

DEL http://localhost:8080/products

#### Informações

<table>
  <tr>
    <td>Requer autenticação?</td>
    <td>Sim</td>
  </tr>
</table>

#### Parâmetros

<table>
  <tr>
    <td>productId</td>
    <td>Required</td>
    <td>string</td>
  </tr>
</table>
