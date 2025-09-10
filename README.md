# BakesNPlates - Bakery Management System

BakesNPlates is a comprehensive bakery management system built with Next.js, Firebase, and Tailwind CSS. It provides a point-of-sale (POS) interface, order management, inventory tracking, customer relationship management, and AI-powered business analytics.

This project was bootstrapped with [Firebase Studio](https://firebase.google.com/docs/studio).

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Features

- **Dashboard**: An at-a-glance overview of key metrics like total revenue, pending orders, and low-stock items.
- **Point of Sale (POS)**: A user-friendly interface for cashiers to quickly place orders for walk-in customers.
- **Order Management**: A comprehensive table to view, filter, sort, and update the status of all orders.
- **Product & Inventory Management**: Easily add, edit, and delete products and track inventory levels with status indicators.
- **Customer & Expense Tracking**: Maintain a customer list and log business expenses.
- **AI-Powered Analytics (Executive Role)**: Visualize business performance with charts for monthly revenue, top products, and expense breakdowns, complete with an AI-generated summary.
- **AI-Powered Reports (Executive Role)**: Generate detailed sales reports for a given date range using generative AI.
- **Authentication & Roles**: A complete authentication system with two user roles: `staff` and `executive`.
- **User Settings**: Users can update their profile information, upload an avatar, and switch between light and dark themes.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/iamkillcode/bakesnplatespos.git
   ```
2. Navigate to the project directory:
   ```sh
   cd bakesnplatespos
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```
4. Set up your Firebase project configuration in `src/lib/firebase.ts`.

### Running the Development Server

You can run the Next.js development server with:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

### Login Credentials

The application is pre-seeded with two users:

- **Executive**: `executive@bakesnplates.com` (Password: `password`)
- **Staff**: `staff@bakesnplates.com` (Password: `password`)
