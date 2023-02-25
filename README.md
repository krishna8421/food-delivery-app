# Food Delivery App

## Setup

```bash
git clone https://github.com/krishna8421/food-delivery-app # clone the repo

cd food-delivery-app # change directory to the project folder

yarn # or npm install

yarn dev # or npm run dev

```
---
## Environment Variables

```bash
DATABASE_URL="" # Postgres database url. Eg - postgresql://user:pass@localhost:5432/food-delivery-app

JWT_SECRET="" # JWT secret key, used for signing JWT tokens

PORT="" # Backend server port
```
---
## Folder Structure

```bash
prisma/schema.prisma # Database schema
src # Source code
    /db/index.ts # Database connection with Prisma
    /middleware/checkAuth.ts # Middleware to check if user is authenticated
    utils/generateJwtToken.ts # Function to generate JWT token
    routers
        /customer.ts # Customer routes
        /vendor.ts # Vendor routes
    server.ts # Backend server
```

---
## API Documentation

## Customer

> ### Register

Register a new customer

```bash
POST /customer/register
```

Request Body

```json
{
  "name": "Customer 1",
  "email": "c1@gmail.com",
  "password": "pass"
}
```

> ### Login

Login a customer

```bash
POST /customer/login
```

Request Body

```json
{
    "email": "c1@gmail.com",
    "password": "pass"
}
```

> ### Add to Cart

Add a product to cart

```bash
POST /customer/add-to-cart
```

Request Body

```json
{
    "itemsId": "66a9db71-8c79-4f55-b596-4206ca43c836", 
    "quantity": 6
}
```

> ### Place Order

Place an order

```bash
GET /customer/place-order
```

## Vendor

> ### Register

Register a new vendor

```bash
POST /vendor/register
```

Request Body

```json
{
  "name": "Vendor 1",
  "email": "v1@gmail.com",
  "password": "pass"
}
```

> ### Login

Login a vendor

```bash
POST /vendor/login
```

Request Body

```json
{
    "email": "v1@gmail.com",
    "password": "pass"
}
```

> ### Create Menu

Create a menu and add items to it


```bash
POST /vendor/create-menu
```

Request Body

```json
{
    "name": "Ice Cream",
    "description": "Chilled Ice Cream",
    "price": 50,
    "imgUrl": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
}
```