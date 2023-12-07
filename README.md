# About the Project

This project is an API developed as a complement to a basic inventory control system called Estoquer, previously created by the author.

## Functional Requirements

- [ ] Users should be able to create an account.
- [ ] Users should be able to log in.
- [ ] Users should be able to register an order.
- [ ] Users can view all orders.
- [ ] Users can view items by filter:
  - [ ] Title
  - [ ] Type
- [ ] Users should be able to edit an order.
- [ ] Users should be able to remove an order.
- [ ] Users should register the following fields for each order:
  - [ ] Title
  - [ ] Origin: Supplier | Customer
  - [ ] Type: Input | Output
  - [ ] Status: Pending | Completed
  - [ ] Payment deadline
- [ ] Users should be able to register order items with the following fields:
  - [ ] Name
  - [ ] Price
  - [ ] Quantity

## Business Rules

- [ ] Users cannot proceed with authentication if there are missing or incorrect fields.
- [ ] Users should not register an email already existing in the system.
- [ ] Users must enter valid email and password:
  - [ ] Email must contain "@".
  - [ ] Password must be 6 characters or more.
- [ ] Users cannot make updates to an order if it has been completed.
- [ ] If the order origin is Customer, the user must fill in the type as Output.
- [ ] If the payment deadline has passed, the user should see those orders last.

## Technologies

- Node.js
- Fastify
- Prisma
- PlanetScale
- Sqlite (Development Database)
- Zod

## Database Tables

```sql
- user
  id          Integer   Primary Key
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
