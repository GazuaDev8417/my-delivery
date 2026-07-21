# Delivery App (Customer-Facing) — Freelance Portfolio Project

A responsive full-stack web application for food and product delivery, built with React, TypeScript, and Styled Components. This repository represents the consumer/customer ecosystem, enabling users to browse dynamic, category-organized menus, manage their shopping cart locally, and process instant digital payments.

> 🌐 **Portfolio Note:** While this application is operationally tailored to the Brazilian delivery market (integrating systems like Pix and CEP-based addressing), **the source code, architecture, and interface were intentionally developed in English** to effectively demonstrate full-stack engineering proficiency to international recruiters.

---

## 🚀 Key Features

*   **Dynamic Menu Browsing (`Detail` Page):** Fetches establishment and product metadata concurrently using optimized parallel promises. Products are cleanly grouped by business category filters, utilizing memoized state selectors to prevent performance degradation caused by re-renders.
*   **Reactive Cart Lifecycle (`Cart` Page):** Allows real-time quantity adjustments, enforcing a minimum limit of 1 item and instantly synchronizing updates with backend controllers via unified Axios wrappers.
*   **Profile & Address Hub (`Profile` Page):** Manages essential user data, including phone number formatting and delivery logistics optimized for Brazilian postal codes (CEP), states, and neighborhoods.
*   **Integrated Payment Gateways:**
*   **Mercado Pago (Pix & Credit Card):** Seamlessly processes local card tokens or generates instant Pix QR codes, utilizing real-time background status polling. *   **WhatsApp Deep-Linking Security Mechanism:** Implements fallback logic for order confirmation, concatenating items and delivery addresses to forward text data directly to the merchant's WhatsApp channel (`+55`).

---

## 🛠️ Architecture and Tech Stack

*   **Frontend Library:** React (Functional Components with Hooks)
*   **Type Safety:** TypeScript (Strictly typed schemas for `User`, `Order`, `Products`, and `Restaurant`)
*   **State Architecture:** Context API using custom hooks (`useGlobal`) with memoized asynchronous routines (`useCallback`) to preserve reference stability.
*   **Styling Engine:** Styled Components (CSS-in-JS layout structure)
*   **HTTP Client:** Axios with centralized authorization interceptors, tracking Bearer tokens in the browser's `localStorage`.

---

## 📂 Key Components and Data Flow Details

### 1. Global State Hub (`Context.tsx`)
Acts as the central engine. Restricts access to sensitive components via route authentication checks. Exposes requests that include the authentication token for:
*   `GET /profile` — Populates active identity states.
*   `GET /active_orders` — Populates local state arrays for the shopping cart.

### 2. Product Matrix (`Detail.tsx`)
Renders category-organized listings. Incorporates a smart scroll anchor via `useRef` to smoothly guide users to search queries. Upon clicking, it immediately compiles order item data payloads:
```typescript
{
    product: string,
    price: number,
    quantity: 1,
    total: number,
    momentString: string // ISO Timestamp
}

```

---

## 👨‍💻 Author

Developed by **Flamarion França** \
Portolio page: https://portfolio-vtu0.onrender.com \
Application link: https://my-delivery-omega.vercel.app