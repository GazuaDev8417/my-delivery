# 🛍️ My Delivery — Consumer Order & Checkout Portal

[![Live Demo](https://img.shields.io/badge/Live_App-Try_It_Now-2ea44f?style=for-the-badge&logo=vercel)](https://my-delivery-silk.vercel.app)
[![Portfolio](https://img.shields.io/badge/Author-Flamarion_França-007acc?style=for-the-badge&logo=render)](https://portfolio-vtu0.onrender.com)

> **Ecosystem Core:** *My Delivery* is the consumer-facing frontend of a full-stack SaaS delivery ecosystem. It operates in real time with **[My Delivery Provider](https://my-delivery-provider.vercel.app)** (Operational Dashboard) and the **[SaaS Control Panel](https://dashboard-project-nu-one.vercel.app/)** (BI Engine), all backed by the **My Delivery Server** centralized API.

---

## ⚡ Interactive Live Demo

Experience the customer ordering and checkout pipeline directly in your browser:

* 🌐 **Live Web Application:** [https://my-delivery-silk.vercel.app](https://my-delivery-silk.vercel.app)
* 💼 **Developer Portfolio:** [https://portfolio-vtu0.onrender.com](https://portfolio-vtu0.onrender.com)

🔑 **Demo Access Credentials:**
* **User 1:** `visitor1@email.com` | Password: `123456`
* **User 2:** `visitor2@email.com` | Password: `123456`
* **User 3:** `visitor3@email.com` | Password: `123456`

> 💡 **Suggested Test Flow:** Open the application, browse store menus, add products to your cart, and simulate a real-time digital transaction via **Mercado Pago** or trigger an automated **WhatsApp** order payload.

---

## 🌟 Technical Highlights & Engineering Decisions

Built using **React**, **TypeScript**, and **Styled Components**, this consumer portal demonstrates solid frontend engineering focused on high-speed UI execution, strict type safety, and resilient checkout flows:

* **⚡ Parallelized Metadata Hydration:** Utilizes `Promise.all` asynchronous routines to fetch establishment settings, store menus, and category listings concurrently, reducing initial render latency.
* **🛒 Zero-Lag Reactive Cart:** Built with custom React Hooks and memoized selectors (`useCallback`, `useMemo`) to eliminate unnecessary re-renders during high-frequency cart state mutations.
* **💳 Multi-Gateway Checkout Engine:** Integrated with `@mercadopago/sdk-react` for automated background payment polling (Pix QR codes and credit card tokenization) alongside a fallback **WhatsApp Deep-Linking Protocol**.
* **📍 Localized Logistics Engine:** Built-in dynamic CEP auto-fill and validation routines engineered specifically for local Brazilian address standards.
* **🔔 Real-Time Event Readiness:** Architected to sync order statuses and receive instant updates whenever merchants modify menus or store availability across the platform.

---

## 🏗️ System Architecture & Data Flow

```text
  ┌───────────────────────────┐
  │   My Delivery (Client)    │
  └─────────────┬─────────────┘
                │
                │ 1. Metadata Hydration & Menus (Promise.all)
                ▼
  ┌───────────────────────────┐
  │   My Delivery Server      │◄───────────┐ 
  │    (Centralized API)      │            │ 4. Instant Order Sync
  └─────────────┬─────────────┘            │
                │                          │
                │ 2. Payment Intent        │
                ▼                          │
  ┌───────────────────────────┐            │
  │    Mercado Pago SDK /     │            │
  │   WhatsApp Deep-Link      │            │
  └─────────────┬─────────────┘            │
                │                          │
                │ 3. Status Polling        │
                └──────────────────────────┴──► My Delivery Provider
                                                (Merchant Dashboard)