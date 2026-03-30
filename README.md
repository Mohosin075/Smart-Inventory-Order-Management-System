# Smart Inventory Order Management System Server

A robust, scalable, and feature-rich backend system for managing inventory and orders. Built with a modern tech stack, this system provides real-time communication, automated workflows, and secure payment processing.

---

# Live URL : https://195.35.6.13:3003

## 🚀 Key Features

### 🔐 Authentication & Security
- **Multi-Auth Support**: Custom email/password authentication and social login (Google, Facebook) via Passport.js.
- **RBAC**: Role-Based Access Control (Admin, User, etc.) to ensure secure data access.
- **JWT Protection**: Secure token-based session management with access and refresh tokens.
- **Validation**: Strict request validation using Zod schemas.

### 📦 Inventory & Product Management
- **Modular Inventory**: Manage products, categories, and stock levels with ease.
- **Stock Tracking**: Real-time updates on stock availability and low-stock alerts.
- **Restock Management**: Automated and manual restocking workflows to keep inventory optimized.
- **Search & Discovery**: Powerful search capabilities to find products and orders quickly.

### 🛒 Order Management
- **Workflow Automation**: Seamlessly handle the entire order lifecycle from placement to fulfillment.
- **Real-time Status**: Track order progress with real-time updates for both admins and users.
- **Conflict Resolution**: Built-in mechanisms to handle order conflicts and discrepancies.

### 💬 Communication & Notifications
- **Real-time Chat**: Instant messaging between users and support using Socket.IO.
- **Multi-channel Notifications**: Push notifications (Firebase), In-app notifications, and Email (Nodemailer/Resend).
- **Scheduled Tasks**: Automated notification crons for reminders and system alerts.

### 💳 Payments & Finance
- **Stripe Integration**: Secure payment processing with support for webhooks.
- **Subscription Management**: Recurring billing and subscription tier handling.
- **Financial Analytics**: Dashboard overview of revenue and order statistics.

### 🛠️ Developer & System Features
- **File Management**: Secure media uploads to AWS S3 with on-the-fly image resizing (Sharp).
- **Error Handling**: Centralized global error handling for consistent API responses.
- **Logging**: Structured activity logs and system monitoring with Winston.
- **Scalability**: Designed with a modular architecture for easy feature expansion.

---

## 💻 Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Real-time**: [Socket.IO](https://socket.io/)
- **State Management/Queue**: [Redis](https://redis.io/) & [BullMQ](https://docs.bullmq.io/)
- **Storage**: [AWS S3](https://aws.amazon.com/s3/)
- **Payment Gateway**: [Stripe](https://stripe.com/)
- **Communication**: [Twilio](https://www.twilio.com/) (SMS), [Firebase](https://firebase.google.com/) (Push Notifications), [Nodemailer](https://nodemailer.com/) & [Resend](https://resend.com/) (Email)
- **AI Integration**: [OpenAI API](https://openai.com/api/)
- **Tools**: [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [Husky](https://typicode.github.io/husky/)

---

## 📁 Project Structure

```text
src/
├── builder/        # Reusable query builders (filtering, sorting, pagination)
├── config/         # App configurations & environment variables
├── enum/           # System-wide enums (roles, statuses, etc.)
├── errors/         # Custom error classes and global error handler
├── helpers/        # Utility helpers (JWT, Email, S3, Socket)
├── interfaces/     # Shared TypeScript types and interfaces
├── middleware/     # Custom Express middlewares (auth, validation, file upload)
├── modules/        # Feature-based modules (each containing routes, controllers, services, models)
├── routes/         # Centralized API route definitions
├── shared/         # Shared logic across multiple modules
├── task/           # Background tasks and cron jobs
├── utils/          # Miscellaneous utility functions
├── app.ts          # Express application setup
└── server.ts       # Server entry point & DB connection
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- Node.js installed on your machine.
- MongoDB instance (local or Atlas).
- Redis server (required for Socket.IO adapter and background tasks).

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/Mohosin075/Smart-Inventory-Order-Management-System.git
cd Smart-Inventory-Order-Management-System
npm install
```

### 3. Environment Configuration
Copy the example environment file and fill in your credentials:
```bash
cp .env.example .env
```
Key variables to configure:
- `DATABASE_URL`: Your MongoDB connection string.
- `JWT_SECRET`: Secret for signing access tokens.
- `AWS_*`: AWS S3 credentials for file storage.
- `STRIPE_*`: Stripe API keys for payments.
- `FIREBASE_*`: Firebase Admin SDK credentials for push notifications.

### 4. Running the Application
**Development Mode:**
```bash
npm run start
```
**Production Mode:**
```bash
npm run build
npm run start:prod
```

---

## 📜 Available Scripts

- `npm run start`: Starts the server in development mode with `ts-node-dev`.
- `npm run build`: Compiles TypeScript to JavaScript in the `dist/` folder.
- `npm run start:prod`: Runs the compiled production code.
- `npm run lint:fix`: Automatically fixes linting errors.
- `npm run prettier:fix`: Formats the entire codebase.
- `npm run lint-and-format`: Runs both linting and formatting.

---

## 🤝 Contribution
Contributions are welcome! Please follow the existing coding style and ensure all tests/linting pass before submitting a PR.

---

## 📄 License
This project is licensed under the [ISC License](LICENSE).
