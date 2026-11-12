# Uruà – Frontend

The web app for Uruà, an e-commerce platform that helps small businesses in Nigeria sell to buyers across all 36 states. It is built with React and talks to the Uruà REST API.

Backend repository: https://github.com/Emediong-hub/urua-ecommerce

## Author

Michael Emediong – Web/Java track

## Features

- Landing page with search, category tiles and the latest products
- Browse products, with search by name, category and state
- Product page with an "Add to cart" button
- Register and log in as a buyer or a seller
- **Email verification:** after registering, users see a "check your email" screen. The link in the email opens a page that confirms the account. Logging in before verifying shows a resend button with a 60-second countdown.
- **Buyers:** cart, checkout with a delivery address, payment on Paystack, order history, and confirming delivery
- **Sellers:** add products, see their own listings, view paid orders with the delivery address, and mark orders as shipped
- Pages are protected by role, so buyers can't open seller pages and the other way round
- Layout works on phone screens

## Tech stack

React, Vite, React Router, plain CSS

## Running it locally

### Requirements

- A recent Node.js (built with Node 24)
- The Uruà backend running at `http://localhost:8080`, set up for email sending (see the backend README)

### Steps

```
git clone https://github.com/Emediong-hub/urua-frontend.git
cd urua-frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Keep the dev server on port 5173. The backend allows requests from that address, Paystack sends buyers back to `http://localhost:5173/payment/callback` after they pay, and verification emails link to `http://localhost:5173/verify-email`.

### Trying the full flow

1. Register one account as a seller and another as a buyer, using real email addresses you can open. With Gmail, `yourname+seller@gmail.com` and `yourname+buyer@gmail.com` arrive in the same inbox.
2. Open the verification email for each account and click **Verify my email**. Open it on the same computer, because the link points to `localhost`.
3. Log in as the seller and use **Sell** to add a product.
4. Log in as the buyer, add it to the cart and check out. On Paystack's test page, choose **Success**, then **Pay**.
5. As the seller, open **Orders** and click **Mark as shipped**.
6. As the buyer, open **My orders** and click **Confirm delivery**.

## Project structure

```
src
├── api.js            One helper for every call to the backend
├── auth-context.js   Login state
├── AuthProvider.jsx  Keeps the logged-in user and token
├── components        Header, product card, order card, role guard,
│                     resend-verification button
└── pages             Home, Products, Product detail, Cart, Checkout,
                      Payment callback, My orders, Seller orders,
                      Add product, My products, Login, Register,
                      Verify email
```

The backend address is set at the top of `src/api.js`. Change it there when the backend is deployed.