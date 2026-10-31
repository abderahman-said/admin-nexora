# Clean Admin Dashboard

A clean, minimal admin dashboard template built with React, Vite, and Tailwind CSS.

## Features

- **Login System**: Authentication with JWT token management
- **Dashboard Layout**: Responsive sidebar and top navigation
- **Protected Routes**: Route protection for authenticated users
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **State Management**: Zustand for global state
- **Routing**: React Router for navigation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── features/        # Feature-specific components
│   └── auth/        # Authentication components
├── layouts/         # Layout components (Sidebar, Navbar)
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── NotFound.jsx
├── routes/          # Route configuration
├── store/           # Zustand stores
└── hooks/           # Custom hooks
```

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router
- Zustand
- Lucide Icons
- React Hot Toast

## License

MIT
