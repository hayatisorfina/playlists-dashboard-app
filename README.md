# Playlist Dashboard

Welcome to the **Playlist Dashboard**! This is a lightweight, production-ready digital signage dashboard prototype built with Next.js, React, TypeScript, and Ant Design. This frontend application empowers system operators to securely manage playlists and author ad-hoc media items effectively.

## 🚀 Getting Started

If you're new to the team, follow these steps to bootstrap your local prototyping environment quickly.

### 1. Prerequisites

Ensure your system has the following dependencies ready:
* [Node.js](https://nodejs.org/) (v18.0.0 or newer is highly recommended)
* [Yarn](https://yarnpkg.com/) globally installed
* A reachable instance of the **NestJS Backend API** (local or remote) to serve mock metadata.

### 2. Environment Configuration

Clone the baseline environment configuration for your local workspace:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# macOS/Linux
cp .env.example .env.local
```

Open your newly created `.env.local` and define `NEXT_PUBLIC_API_BASE_URL` to point towards the NestJS backend interface.

*⚠️ Important Note: Ensure that CORS configurations are correctly permitted over on the NestJS backend repository to facilitate interactions with the Next.js development origin.*

### 3. Installation & Run

Hydrate the local registry and spin up the frontend:

```bash
yarn install
yarn dev
```

*Note: Your development machine may utilize `yarn dev --port=3004` to avoid port collision.*
Open the active URL displayed in your console (usually [http://localhost:3000](http://localhost:3000)) to traverse the layout in your browser.

---

## 🏗️ Project Architecture & Structure

This project implements robust, modern paradigms while striving to remain un-bloated.

### Core Stack
- **Framework**: Next.js App Router
- **Type Safety**: strict TypeScript
- **UI & Toolkit**: Ant Design v5 (Modals, Form Logic, Tables, Pages) & Tailwind CSS v4 (Spacings, Layout resets)
- **Form Validation**: Ant Design built-in Form properties and schema enforcement via `zod`
- **Data Fetching**: Pure REST `axios` queries paired with native Next server cache purges via `router.refresh()`.

### Decisions and Tradeoffs

- **Hybrid Data Fetching vs React Query**: A hybrid approach is used. Initial data is loaded on the server and passed to the client. The client then handles updates using `router.refresh()`. *Tradeoff*: This keeps the app size small because it does not use `@tanstack/react-query`. However, it means state updates must be handled manually instead of automatically.
- **Ant Design Forms vs React Hook Form**: The project uses Ant Design's built-in `<Form>` component for building forms and checking rules. *Tradeoff*: This removes the need to install extra libraries like `react-hook-form` and works well with existing design tools. However, it connects the form logic very closely to the Ant Design library.
- **Tailwind CSS + Ant Design**: Ant Design is used for complex parts like Tables and Modals. Tailwind CSS is used for spacing, layout, and basic styles. *Tradeoff*: This makes development much faster because there is no need to write custom CSS. But, extra care is needed to make sure Tailwind classes do not conflict with Ant Design styles.

### Codebase Geography

The layout breaks out logic logically between routing, monolithic features, and reusable components.

```text
src/
├── app/                  # Next.js App Router definitions and top-level server components
│   ├── page.tsx          # Site entrypoint (redirects instantly into playlists)
│   └── playlists/        # /playlists index and /[id] dynamic routing logic
├── features/             # Consolidated domain-specific views
│   └── playlists/        # PlaylistListPage and PlaylistDetailPage grids and actions
├── components/           # Generic interface atoms and reusable structures
│   ├── layout/           # AppShell, navigational boundaries, common padding shells
│   └── playlists/        # Specialized modal forms (PlaylistFormModal, MediaItemFormModal)
├── lib/                  # Client configurations, env strict loaders, and API routing logic
└── types/                # Strict DTO interfaces and TS definitions mapping backend tables
```

## 🛠️ Available Scripts

Quickly reference workspace utility scripts:

| Command        | Purpose                                            |
|----------------|----------------------------------------------------|
| `yarn dev`     | Spins the responsive next.js fast-refresh server   |
| `yarn build`   | Bundles the app tightly for production deployment  |
| `yarn start`   | Boots up the finalized production web container    |
| `yarn lint`    | Static analysis and ESLint code-quality assurances |

---

**Where should I start?** Dive into `src/app/playlists/page.tsx` directly to trace how the server loads Playlists to push into the `src/features/playlists/PlaylistListPage.tsx` grid! Feel free to raise any questions you might have.
