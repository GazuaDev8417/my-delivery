# My Delivery

A web application for customers to discover stores, browse their products, and place orders. Customers choose a store, add items to their cart, and manage their orders using services provided by My Delivery Server.

## The My Delivery ecosystem

The customer application is part of an integrated suite:

- **My Delivery** — the customer-facing app for browsing stores and placing orders.
- **My Delivery Provider** — the store-facing dashboard for receiving and managing orders and maintaining the product catalog.
- **SaaS Dashboard** — the management and monitoring dashboard for the ecosystem.
- **My Delivery Server** — the central API that connects the applications, authenticates users, and provides shared data and services.

Customers browse stores and products through the API. Orders are recorded by the server and made available to My Delivery Provider. The Dashboard complements the ecosystem with management and monitoring features.

## Features

- Browse stores and view their products.
- Sign up, log in, reset passwords, and access protected pages.
- Manage a cart with items grouped by store, including quantity updates and product removal.
- Check out using the Pix payment flow or the card form powered by the Mercado Pago SDK.
- View and edit profile details, delivery address, and contact information.
- Autofill Brazilian address details from a postal code using ViaCEP.
- Access account and order-related notifications.
- Share order details with a store through WhatsApp.

## Tech stack

- React 19, TypeScript, and Vite
- React Router
- Styled Components
- Axios
- Mercado Pago SDK for React

## Run locally

Requires Node.js and npm. From this project directory:

```bash
npm install
```

Create a `.env` file in the project root and set the base URL for My Delivery Server. To enable the app's payment features, also configure your Mercado Pago public key:

```env
VITE_BASE_URL=http://localhost:3003
VITE_PUBLIC_KEY_TP=your_public_key
```

Start the application:

```bash
npm run dev
```

Other available commands:

```bash
npm run build
npm run preview
npm run lint
```

## Integrations

`VITE_BASE_URL` should point to the API root—for example, `http://localhost:3003` during local development. The API provides user, store, order, and notification resources. Payments are processed by the server through Mercado Pago; the app provides the Pix flow and card form.

## Related applications

- [My Delivery — customer app](https://my-delivery-silk.vercel.app)
- [My Delivery Provider — store dashboard](https://my-delivery-provider.vercel.app)
- [My Delivery Server — API documentation](https://my-delivery-server-nine.vercel.app/api-docs/)
- [Portfolio](https://portfolio-vtu0.onrender.com)
