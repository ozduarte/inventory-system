# Restaurant Inventory Management System

A web-based restaurant inventory management system that helps restaurant staff track inventory, manage stock levels, and organize purchase orders. The application provides a centralized interface for viewing inventory and managing orders.

## Features

- **Dashboard:** View an overview of restaurant inventory.
- **Inventory management:** View, search, add, edit, and delete inventory items, depending on the user's role.
- **Order management:** View and manage purchase orders.
- **Order items:** View items associated with an order and manage their quantities and unit costs when permitted.
- **Order status tracking:** Track orders through the statuses Requested, Ordered, Shipped, Delivered, and Cancelled.
- **Inventory updates:** Delivered orders can update inventory quantities.
- **Login:** Sign in using one of the project's demo accounts.
- **Role-based permissions:** Different roles have different access to inventory and order-management actions.

## Technologies Used

- React 19
- Vite 8
- Tailwind CSS 4
- React Router 7
- JavaScript
- Node.js
- Express
- PostgreSQL

## Prerequisites

Before running the project, install:

- [Node.js](https://nodejs.org/) — download the LTS version. This also installs npm.
- Git
- A modern web browser

The application also requires access to its configured backend API and PostgreSQL database. If the team changes the backend or database hosting configuration, make sure the frontend is configured to use the correct API address.

## Getting Started

### 1. Install Node.js

1. Visit [https://nodejs.org/](https://nodejs.org/).
2. Download the LTS version.
3. Run the installer and follow the prompts.

### 2. Verify Installation

Open a terminal and run:

```bash
node -v
npm -v
```

Both commands should display version numbers.

### 3. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/ozduarte/inventory-system.git
cd inventory-system
```

### 4. Install Dependencies

From the project folder, run:

```bash
npm install
```

This installs the project's dependencies.

### 5. Run the Project

From the project folder, run:

```bash
npm run dev
```

Vite will start the development server and display a local URL in the terminal. Open that URL in your browser to use the application.

## Demo Accounts

The application currently uses shared demo accounts for testing:

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@stockroom.com` | `admin123` |
| Manager | `manager@stockroom.com` | `manager123` |
| Employee | `employee@stockroom.com` | `employee123` |

These are demonstration credentials, not production user accounts. Do not reuse these credentials for real services.

## User Roles and Permissions

| Feature | Administrator | Manager | Employee |
|---|---:|---:|---:|
| View dashboard | Yes | Yes | Yes |
| View inventory | Yes | Yes | Yes |
| Add inventory items | Yes | Yes | Yes |
| Edit inventory items | Yes | Yes | Yes |
| Delete inventory items | Yes | Yes | No |
| View orders | Yes | Yes | Yes |
| Create, edit, and delete orders | Yes | Yes | No |
| Manage order status | Yes | Yes | No |
| Manage order items | Yes | Yes | No |

Employees can view orders and their associated items, but cannot make changes to orders or order items.

## Project Structure

The project is organized around the React frontend and the Express backend.

### Frontend

- `src/App.jsx` — Sets up the application's routes and authentication provider.
- `src/AppLayout.jsx` — Provides the shared application layout.
- `src/AuthContext.jsx` — Handles demo-account login state and logout.
- `src/ProtectedRoute.jsx` — Prevents users who are not logged in from accessing protected pages.
- `src/permissions.js` — Defines role-based permissions used by the frontend.
- `src/api.js` — Contains functions used by the frontend to communicate with the backend API.
- `src/pages/` — Contains the main application pages, including the dashboard, login, inventory, and orders.
- `src/components/` — Contains reusable interface components, such as the sidebar, inventory table, and item modals.

### Backend

The Express backend handles API requests and communicates with the PostgreSQL database. Its code includes the server entry point, database connection, and routes for inventory, orders, and order items.

## Application Flow

1. A user signs in through the login page using a demo account.
2. The authentication context stores the current demo user and keeps the session available across page refreshes.
3. Protected routes restrict access to users who are not logged in.
4. The permissions module determines which actions are available to the signed-in user's role.
5. Frontend API functions send requests to the Express backend.
6. The backend reads or updates data in PostgreSQL and returns the results to the frontend.

## Current Limitations

- Login currently uses hardcoded demo accounts rather than a full database-backed authentication system.
- Role-based restrictions are implemented in the frontend. They should not be treated as production-grade security unless equivalent authorization checks are also enforced by the backend.
- Order status tracking records workflow states; it does not provide live delivery GPS tracking.
- The application does not place orders directly with external supplier systems.
- The application requires the configured backend API and database to be available for data-dependent features.

## Troubleshooting

### `node` or `npm` is not recognized

Make sure Node.js LTS is installed. Close and reopen the terminal after installation, then run `node -v` and `npm -v` again.

### Dependencies fail to install

Confirm that you are in the `inventory-system` project folder and run:

```bash
npm install
```

### The application does not load data

The frontend may be running while the backend API or database is unavailable. Check that the backend service is running, that the API address configured in the frontend is correct, and that the backend can connect to PostgreSQL.

### Login does not work

Use one of the demo email/password combinations listed in the Demo Accounts section. Check that the email and password are entered correctly.

## Project Status

This project implements a restaurant inventory and purchase order management interface with demo-account login and role-based frontend permissions. Some production features, including database-backed authentication and backend-enforced role authorization, are not currently implemented.