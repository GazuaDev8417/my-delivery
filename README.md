# 🛍️ My Delivery — Consumer Order & Checkout Portal

[![Live Demo](https://img.shields.io/badge/Live_App-Try_It_Now-2ea44f?style=for-the-badge&logo=vercel)](https://my-delivery-silk.vercel.app)
[![Portfolio](https://img.shields.io/badge/Author-Flamarion_França-007acc?style=for-the-badge&logo=render)](https://portfolio-vtu0.onrender.com)

> **Ecosystem Core:** *My Delivery* is the client-facing application of a 3-part micro-frontend architecture. It works synchronously with **[My Delivery Provider](https://my-delivery-provider.vercel.app)** (Operations Engine) and the **[SaaS Dashboard](https://dashboard-project-nu-one.vercel.app/)** (Business Intelligence Engine).

---

## ⚡ Interactive Live Demo
Experience the customer order pipeline directly in your browser:
* 🌐 **Live Web Application:** [https://my-delivery-silk.vercel.app](https://my-delivery-silk.vercel.app)
* 💼 **Developer Portfolio:** [https://portfolio-vtu0.onrender.com](https://portfolio-vtu0.onrender.com)

> 💡 **Try this flow:** Open the app, explore category menus, add items to your cart, and simulate a real-time digital payment (Pix / Mercado Pago) or trigger a structured WhatsApp order payload.

---

## 🌟 Why Test This Application?

Built with **React**, **TypeScript**, and **Styled Components**, this client portal demonstrates enterprise-grade frontend engineering focused on high-speed user experience, strict type safety, and resilient checkout flows:

* **⚡ Ultra-Fast Parallel Metadata Hydration:** Uses parallelized async routines (`Promise.all`) to fetch establishment settings and category listings simultaneously, dropping initial paint times.
* **🛒 Zero-Lag Reactive Cart:** Implements custom React Hooks and memoized selectors (`useCallback`, `useMemo`) to prevent unnecessary UI re-renders during high-frequency cart updates.
* **💳 Multi-Gateway Checkout Engine:** Integrated with **Mercado Pago API** for automated background payment polling (Pix QR codes and credit card tokenization) alongside a secure fallback **WhatsApp Deep-Linking Protocol**.
* **📍 Brazilian Address Engine:** Built-in dynamic CEP validation and auto-fill logistics routines tailored to local Brazilian delivery standards.

---

## 🏗️ System Architecture & Data Flow

```text
   [ Customer App ]
          │
          ├── 1. Fetches Products & Stores ──► [ Centralized REST API ]
          ├── 2. Cart & State Synchronization 
          └── 3. Generates Payments ─────────► [ Mercado Pago / WhatsApp ]
                                                         │
                                                         ▼
                                             [ My Delivery Provider ]
                                             (Receives Live Orders)