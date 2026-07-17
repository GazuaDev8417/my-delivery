# Meu-Delivery 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)

An enterprise-grade, high-performance full-stack ecosystem engineered for seamless on-demand delivery scaling. This repository contains the customer-facing core client, completely refactored from legacy structures into a highly modular, decoupled architecture following strict clean-code metrics and international industry standards.

---

## 🗺️ System Architecture Overview

The system is built on an optimized decoupled frontend stack that eliminates unnecessary coupling between raw API states and the view layer, providing seamless performance and high scannability.

* **Frontend Engine:** Built with **React 18**, **TypeScript** for strict type-safety, and styled layouts.
* **State Management Paradigm:** Managed globally through a centralized `useGlobal` atomic context abstraction, preventing prop-drilling across multi-stage cart flows.
* **Routing Guard Infrastructure:** Configured with **React Router v6** utilizing lazy loading mechanics to dramatically minimize initial bundle sizes.

---

## 🔥 Key Technical Improvements & Refactoring

### ⚡ Parallel Data Fetching & Memoization
Re-engineered heavy dashboard workflows away from rendering waterfalls. Components leverage concurrent asynchronous promises running in parallel, combined with strategic `React.memo` and `useMemo` hooks to shield intensive UI layers from unnecessary state broadcast re-renders.

### 💳 Mercado Pago API Checkout
Deeply integrated with the **Mercado Pago API gateway** for transaction handling. The checkout architecture fires payloads securely, instantiating instantaneous dynamic QR Codes for instant **Pix payouts** alongside real-time status monitoring workflows.

### 🛠️ Defensive Validations & Custom Hooks
Isolated core components (such as shipping fields, dynamic addresses, and cart changes) behind tailored custom React hooks. Input components handle aggressive sanitization, sanitizing payloads prior to external backend updates.

### 📝 Swagger API Documentation
Backend controllers and services are fully documented under the **OpenAPI Spec (Swagger UI)**. This ensures strict contractual alignment between frontend requests and endpoint layers.

---

## 📂 Repository Directory Tree

```text
meu-delivery/
├── src/
│   ├── components/       # Atomically split presentational elements (Header, Cart, etc.)
│   ├── constants/        # Global system configuration primitives (URLs, Enums)
│   ├── global/           # Centralized useGlobal state provider contexts
│   ├── hooks/            # Isolated custom hooks for decoupled business logic
│   ├── routes/           # Protected layout paths with code-splitting mechanisms
│   ├── services/         # Absolute API client abstractions mapping raw endpoints
│   └── views/            # Main structural application screens/pages
├── swagger/              # Structured OpenAPI specification configurations
├── package.json          # Node infrastructure configuration dependencies
└── README.md             # Repository documentation