# Overview

This is a full-stack web application built with React, Express.js, and PostgreSQL. The project uses a modern monorepo structure with a shared schema definition between client and server. The frontend is built with React and TypeScript, styled with Tailwind CSS and shadcn/ui components. The backend is an Express.js server with Drizzle ORM for database management. The application currently has a basic user management system and is set up for rapid development with hot reloading and type safety throughout the stack.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with a simple Switch/Route setup
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **Form Handling**: React Hook Form with Zod validation resolvers

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **API Structure**: RESTful API with routes prefixed under `/api`
- **Development Setup**: Hot reloading with tsx for development mode
- **Build Process**: esbuild for production bundling with ESM output

## Data Storage
- **Database**: PostgreSQL with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Schema Definition**: Shared TypeScript schema in `/shared/schema.ts`
- **Current Schema**: Users table with id, username, and password fields
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Authentication & Authorization
- **Session Management**: Prepared for session-based authentication with connect-pg-simple
- **User Management**: Basic user CRUD operations defined in storage interface
- **Security**: Password handling structure in place, ready for hashing implementation

## Development Features
- **Hot Reloading**: Vite dev server with HMR for frontend, tsx for backend
- **Type Safety**: Full TypeScript coverage across client, server, and shared code
- **Development Tools**: Replit integration with cartographer plugin and runtime error overlay
- **Code Organization**: Path aliases configured for clean imports (@/, @shared/, @assets/)

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL provider via @neondatabase/serverless
- **Connection**: Environment variable DATABASE_URL for database connectivity

## UI Framework
- **Radix UI**: Comprehensive set of unstyled, accessible UI primitives
- **shadcn/ui**: Pre-built component library with consistent styling
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

## Development Tools
- **Vite**: Fast build tool and dev server with React plugin
- **Drizzle Kit**: Database schema management and migration tool
- **TanStack Query**: Server state synchronization and caching
- **Replit Plugins**: Development environment integration for error handling and mapping

## Validation & Forms
- **Zod**: TypeScript-first schema validation
- **React Hook Form**: Performant forms with easy validation
- **Drizzle-Zod**: Integration between Drizzle schemas and Zod validation

## Utility Libraries
- **date-fns**: Modern JavaScript date utility library
- **clsx & tailwind-merge**: Conditional className utilities
- **class-variance-authority**: Type-safe variant API for component styling