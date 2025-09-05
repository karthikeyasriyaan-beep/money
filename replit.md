# Personal Finance Management App

## Overview

This is a comprehensive personal finance management application built with React, Express.js, and PostgreSQL. The app helps users track subscriptions, manage transactions, monitor savings accounts, set financial goals, and view analytics dashboards. It features a modern dark-themed UI using shadcn/ui components with glassmorphic design elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme and glassmorphic design
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation integration
- **Charts**: Recharts library for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with standardized error handling
- **Validation**: Zod schemas for runtime type checking
- **Development**: Hot reloading with Vite middleware integration
- **Storage Interface**: Abstract storage layer with in-memory implementation

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle migrations and schema definitions
- **Type Safety**: Drizzle-Zod integration for type-safe database operations
- **Connection**: Neon serverless PostgreSQL adapter

### Key Features
- **Subscription Tracking**: Monitor recurring payments and renewal dates
- **Transaction Management**: Record and categorize income/expense transactions
- **Savings Accounts**: Track balances, targets, and interest rates
- **Financial Goals**: Set and monitor progress toward financial objectives
- **Analytics Dashboard**: Visual charts and metrics for financial insights

### Component Architecture
- **Layout Components**: Responsive sidebar navigation with mobile overlay
- **Form Components**: Reusable forms for each data entity with validation
- **Chart Components**: Specialized chart components for different visualizations
- **UI Components**: Complete shadcn/ui component library implementation

### Build System
- **Development**: Concurrent frontend/backend development with Vite
- **Production**: ESBuild bundling for server, Vite for client
- **TypeScript**: Strict type checking across the entire application
- **Path Aliases**: Organized imports with @ and @shared path mappings

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **express**: Node.js web application framework
- **react**: Frontend UI library with hooks
- **@tanstack/react-query**: Server state management and caching

### UI and Styling
- **@radix-ui/react-***: Unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe component variant management
- **lucide-react**: Modern icon library

### Validation and Forms
- **zod**: Runtime type validation and schema definition
- **react-hook-form**: Performant form library with validation
- **@hookform/resolvers**: Validation resolver for Zod integration

### Charts and Visualization
- **recharts**: Composable charting library for React
- **embla-carousel-react**: Touch-friendly carousel component

### Development Tools
- **vite**: Fast build tool and dev server
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production
- **tsx**: TypeScript execution for development

### Routing and Navigation
- **wouter**: Minimalist routing library for React
- **date-fns**: Modern date utility library