# NetBench

> Modular, offline-first network engineering workbench with zero-latency bitwise calculations, keyboard-first ergonomics, and visual pedagogical breakdowns.

[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](./LICENSE)

---

## Overview

Traditional subnet calculators are either fragmented, ad-cluttered, or simple CLI utilities. **NetBench** is a client-side workbench built for network engineers, sysadmins, DevOps, and certification students (CCNA, CCNP, Network+, AWS Networking).

### Key Features

- **Zero-Latency In-Memory Math:** Pure client-side `uint32` bitwise arithmetic. No backend roundtrips.
- **Keyboard-First Ergonomics:** Custom auto-advancing 4-octet inputs (auto-advances on 3 digits, `.`, or `Tab`; backspaces naturally across octet boundaries).
- **Pedagogical Breakdown:** Visual bit-slicing (Network, Subnet, and Host bits), significant octet identification, and magic number step-by-step explanations.
- **RFC Boundary Accuracy:** Correct handling of standard subnets, RFC 3021 (`/31` point-to-point links), and `/32` host routes.
- **Gamified Drills & Offline Persistence:** Multi-tier subnet mastery drills, timed rounds, streak tracking, and mistake analysis backed by `localStorage`.

---

## Tech Stack

| Layer | Tooling |
| :--- | :--- |
| **Framework** | React 19 + TypeScript (Strict Mode) |
| **Build & Tooling** | Vite |
| **Styling** | Tailwind CSS v4 (Terminal / Cyber-Engineering Dark Theme) |
| **State Management** | Zustand (with `persist` middleware) |
| **Icons & Motion** | Lucide React + Framer Motion |
| **Testing** | Vitest |

---

## Quickstart

### Prerequisites

- Node.js 20+
- npm or pnpm / yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/<your-username>/netbench.git
cd netbench

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to open the workbench.

---

## Available Scripts

- `npm run dev` — Launch the Vite local dev server with HMR.
- `npm run build` — Typecheck (`tsc -b`) and bundle for production.
- `npm run test` — Run unit test suite via Vitest.
- `npm run test:watch` — Run Vitest in interactive watch mode.
- `npm run lint` — Lint code using ESLint.

---

## Keyboard Navigation

| Key | Action |
| :--- | :--- |
| `.` or `Tab` | Advance to the next octet |
| `Backspace` (on empty) | Return focus to the previous octet |
| `Enter` | Submit current answer / Next drill problem |
| `Space` | Reveal step-by-step educational breakdown |
| `Esc` | Clear inputs or dismiss active overlay |

---

## Project Structure

```text
src/
├── shared/              # Reusable bitwise utilities, hooks, and UI primitives
│   ├── components/      # AppHeader, OctetInput, etc.
│   ├── hooks/           # Keyboard listeners and helpers
│   └── lib/             # Pure uint32 bitwise arithmetic & formatters
└── modules/             # Modular tool suites
    └── subnet-drill/    # Subnet mastery drill generator, store, and UI
```

---

## License

[MIT](./LICENSE)
