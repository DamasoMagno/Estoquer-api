# Requisitos Funcionais

- [ ] Usuario deve poder criar uma conta
- [ ] Usuario deve poder fazer login
- [ ] Usuario deve poder cadastrar um pedido
- [ ] Usuario pode visualizar todos os pedidos
- [ ] Usuario pode visualiazr os itens por filtro
  - [ ] Titulo
  - [ ] Categoria
- [ ] Usuario deve poder editar um pedido
- [ ] Usuario deve poder remover um pedido
- [ ] Usuario deve cadastrar os seguintes campos em cada pedido
  - [ ] Prazo pagamento
  - [ ] Titulo
  - [ ] Origem: Fornecedor | Cliente
  - [ ] Tipo: Entrada | Saída
  - [ ] Status: Pendente | Finalizado
- [ ] Usuario deve poder cadastrar os itens do pedido com os campos
  - [ ] Nome
  - [ ] Preço
  - [ ] Quantidade

# Regras de Negócio

- [ ] Usuario não poderá continuar sua autenticação caso haja campos faltando, ou incorretos
- [ ] Usuario não deverá cadastrar um email já existente no sistema
- [ ] Usuario deve inserir email & senha válidos
  - [ ] Email deve conter @
  - [ ] Senha deve possuir 6 ou mais caracteres
- [ ] Usuario não poderá fazer atualizações no pedido, caso a mesma tenha sido concluida
- [ ] Caso a origem do pedido seja Cliente, o usuario deverá preencher o tipo como Saída.
- [ ] Caso o prazo de pagamento tenha acabado, o usuario deverá visualizar os mesmos pedidos em primeiro

## Tables

```sql
- user
  id          Integer   Primary Key
  name        Text
  email       Text
  password    Text

- order
  id          Integer   Primary Key
  title       Text
  finished    Boolean
  origin      TEXT ("Supplier", "Client")
  category    TEXT ("Input", "Output")
  created_at  Date
  deadline    Date
  user_id     Integer   Foreign Key

- item
  id          Integer   Primary Key
  name        Date
  price       INTEGER
  quantity    INTEGER
  order_id    Integer   Foreign Key
```
