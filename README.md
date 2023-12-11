# About the Project

This project is an API developed as a complement to a basic inventory control system called Estoquer, previously created by the author.

## Functional Requirements

- [ ] Users should be able to create an account.
- [ ] Users should be able to log in.
- [ ] Users should be able to create an order.
- [ ] Users can view all orders.
- [ ] Users should be able to edit an order.
- [ ] Users should be able to remove an order.
- [ ] Users can view order sorted by:
  - [ ] Origin
  - [ ] Type
  - [ ] Finished
- [ ] Users should register the following fields for each order:
  - [ ] Name
  - [ ] Price
  - [ ] Quantity
  - [ ] Origin [ Supplier, Customer ]
  - [ ] Type [ Input, Output ]
  - [ ] Finished
  - [ ] Payment Deadline
- [ ] Users can view all stock.
- [ ] Users can view stock by:
  - [ ] Product quantity
  - [ ] Product name
  - [ ] Product status
- [ ] User should be able register order type input in Stock

## Business Rules

- [ ] User should be able to see orders deadline finished after of it pendent
- [ ] User should be able to inform email with @
- [ ] User should be able to use password 6 or more digits
- [ ] User should not be able to proceed with authentication if there are missing or incorrect fields.
- [ ] User should not be able to register an email already existing in the system.
- [ ] User should not be able to updates an order if it's finished.
- [ ] User should not be able to place an order with a deadline before the current day
- [ ] User should not be able to create order output with product of out of stock
- [ ] User should not be able to create order of type output if origin is "Supplier"

## Technologies

- Node.js
- Fastify
- Prisma
- PlanetScale
- Sqlite (Development Database)
- Zod
- TypeScript
