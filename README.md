# 💪 PowerGym - Gym Management System

<div align="center">

![PowerGym Logo](https://img.shields.io/badge/PowerGym-Gym%20Management-FF0310?style=for-the-badge&logo=dumbbell&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?style=for-the-badge&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**Complete gym management system** with facial recognition, member management, subscriptions, payments, and real-time analytics.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [Structure](#-project-structure)

</div>

---

## ✨ Features

### 🎯 Complete Member Management
- 📝 Full client registration with advanced validation
- 👤 Detailed profiles with biometric information
- 🔐 Facial recognition for quick and secure check-in
- 📊 Complete membership and subscription history
- 📱 Contact and payment method management

### 💳 Subscriptions & Payments
- 📅 Flexible membership plan management
- 🔄 Automatic subscription renewal
- 💰 Partial and full payment tracking
- 📈 Debt and payment status monitoring
- 🎁 Attendance-based rewards system
- 📄 Complete transaction history

### 🎫 Attendance Control
- 🤖 **Facial recognition check-in** in real-time
- 📊 Detailed attendance reports by hour, day, and week
- 📈 Frequency and attendance pattern analytics
- ⏰ Automatic entry and exit logging
- 🚫 Access control based on subscription status

### 📦 Inventory Management
- 🏷️ Complete product and stock control
- 📊 Automatic low stock and overstock alerts
- 📝 Entry and exit movement logging
- 💰 Daily sales reports by employee
- 📈 Inventory analysis and valuation

### 📊 Dashboard & Analytics
- 📈 Real-time business metrics
- 💰 Financial analysis and revenue reports
- 👥 Membership statistics and new client tracking
- 📅 Attendance analysis by periods
- 🎯 Customizable and exportable KPIs

### 🎨 User Experience
- 🎨 Modern and responsive design with Tailwind CSS
- ✨ Smooth animations with Framer Motion
- 📱 Mobile and tablet optimized interface
- ⚡ Performance optimized with lazy loading
- 🌙 Dark mode ready (coming soon)

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library
- **TypeScript 5.9** - Static typing
- **Vite 7.1** - Ultra-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion 12** - Advanced animations

### State & Data
- **TanStack Query 5.9** - Server state management
- **React Query Persist** - Cache persistence
- **React Hook Form 7.6** - Performant forms
- **Zod 4.1** - Schema validation

### Routing & Navigation
- **React Router 6.3** - Declarative navigation
- **Protected Routes** - Authentication and authorization

### UI Components
- **Lucide React** - Modern and consistent icons
- **Custom components** - Own UI component library

### Testing
- **Vitest 4.0** - Fast testing framework
- **React Testing Library** - Component testing
- **JSDOM** - Testing environment

### Development Tools
- **ESLint 9** - Code linting
- **TypeScript ESLint** - TypeScript rules
- **PostCSS** - CSS processing

---

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (or yarn/pnpm)
- **Git** to clone the repository

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api/v1

# Authentication
VITE_DISABLE_AUTH=false

# Development
VITE_USE_MOCK_API=true  # Use mock API in development
```

### 4. Start development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 📖 Usage

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Build
npm run build            # Create production build
npm run preview          # Preview production build

# Testing
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:ui          # Open Vitest UI (auto port)
npm run test:ui:port     # Open Vitest UI on port 3001

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # Verify TypeScript types
```

### Application Access

1. **Landing Page**: `/` - Landing page with system information
2. **Login**: `/login` - User authentication
3. **Dashboard**: `/dashboard` - Main panel (requires authentication)
4. **Clients**: `/dashboard#clients` - Member management
5. **Attendances**: `/dashboard#attendances` - Attendance control
6. **Inventory**: `/dashboard#inventory` - Product management

---

## 📁 Project Structure

```
frontend/
├── public/                 # Static files
│   ├── favicon.svg
│   └── logo.svg
├── src/
│   ├── components/         # Reusable components
│   │   ├── ui/            # Base components (Button, Input, Card, etc.)
│   │   ├── auth/          # Authentication components
│   │   └── biometrics/    # Facial recognition components
│   ├── features/          # Feature-based modules
│   │   ├── auth/         # Authentication
│   │   ├── clients/      # Client management
│   │   ├── subscriptions/# Subscriptions and payments
│   │   ├── attendances/  # Attendance control
│   │   ├── inventory/    # Inventory management
│   │   ├── dashboard/    # Dashboard and analytics
│   │   └── rewards/      # Rewards system
│   ├── pages/            # Main pages
│   ├── shared/           # Shared code
│   │   ├── api/          # API client
│   │   ├── hooks/        # Shared hooks
│   │   ├── lib/          # Libraries (QueryClient, etc.)
│   │   ├── types/        # Shared types
│   │   └── utils/        # Utilities (logger, etc.)
│   ├── test/             # Test configuration
│   └── main.tsx          # Entry point
├── .gitignore
├── eslint.config.js      # ESLint configuration
├── package.json
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

---

## 🏗️ Architecture

### Feature-Based Organization
The project is organized by features, where each module contains:
- `api/` - API functions and backend calls
- `components/` - Module-specific components
- `hooks/` - Custom hooks for reusable logic
- `types/` - TypeScript type definitions
- `utils/` - Utilities and helpers
- `constants/` - Constants and configurations

### Path Aliases
Uses `@/` alias for absolute imports:
```typescript
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth';
```

### State Management
- **TanStack Query**: For server state (fetching, caching, mutations)
- **React Hook Form**: For form state
- **Local State**: `useState` for simple local state

### Code Quality
- ✅ Strict TypeScript with well-defined types
- ✅ ESLint configured with strict rules
- ✅ No `any` types (using `unknown` when necessary)
- ✅ Unit and integration tests
- ✅ Conditional logger (development only)

---

## 🎨 Design & Styling

### Color System
- **Primary**: `#f60310` (PowerGym Red)
- **Success**: Green for successful actions
- **Warning**: Yellow for warnings
- **Error**: Red for errors
- **Info**: Blue for information

### Typography
- **Font Family**: Inter (system-ui fallback)
- **Sizes**: Responsive with Tailwind

### UI Components
Own component library with:
- Buttons with variants and states
- Inputs with visual validation
- Cards with animations
- Badges for status
- Modals and dialogs
- Loading spinners
- Toast notifications

---

## 🧪 Testing

### Running Tests

```bash
# Tests in watch mode
npm run test:watch

# Tests with coverage
npm run test:coverage

# Visual test interface
npm run test:ui
```

### Test Structure

- **Unit Tests**: For utilities and helpers
- **Component Tests**: For UI components
- **Integration Tests**: For hooks and complete flows

### Coverage
The project maintains coverage thresholds:
- Lines: 70%
- Functions: 75%
- Branches: 65%
- Statements: 70%

---

## 🚢 Build & Deployment

### Production Build

```bash
npm run build
```

The build is generated in `dist/` ready for deployment.

### Netlify Deployment

The project is configured for Netlify with `netlify.toml`. You just need:
1. Connect your repository to Netlify
2. Configure environment variables
3. Automatic deployment on each push

### Required Environment Variables

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_DISABLE_AUTH=false
```

---

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Conventions

- **Commits**: Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- **Branches**: `feature/`, `fix/`, `refactor/`
- **TypeScript**: Strict types, no `any`
- **ESLint**: Pass all rules before commit

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Vite Documentation](https://vitejs.dev)
- [TanStack Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
