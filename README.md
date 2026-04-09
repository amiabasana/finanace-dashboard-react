# Finance Dashboard

A modern, interactive personal finance dashboard built with React and Vite. Track your income and expenses, visualize spending patterns, and gain insights into your financial habits with an intuitive and responsive interface.

## Overview

The Finance Dashboard is a single-page application that helps you manage your personal finances. It provides real-time financial metrics, transaction history, and analytical insights through an attractive and user-friendly interface. All data is stored locally in your browser using localStorage, ensuring your financial information stays private.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Lightning-fast build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization and charts
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **ESLint** - Code quality and linting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm or npm package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd finanace-dashboard-react
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
pnpm build
# or
npm run build
```

The optimized build output will be in the `dist/` directory.

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
```

### Linting

```bash
pnpm lint
# or
npm run lint
```

## Architecture & Approach

### Context-Driven State Management

The application uses React Context API to manage global financial state through `FinanceContext`. This centralized approach provides:

- **Single Source of Truth**: All transaction and UI state flows through one context
- **Efficient Data Persistence**: Automatic localStorage synchronization for transactions and UI preferences
- **Theme Management**: System-aware dark/light mode detection and user preferences
- **Filtering & Sorting**: Centralized transaction filtering and sorting logic

### Component Structure

- **AppLayout**: Main layout wrapper with sidebar navigation
- **RoleSwitcher**: Toggle between different dashboard views
- **RevealOnScroll**: Scroll-triggered animations for engaging UX
- **Pages**: Dashboard, Transactions, and Insights sections

### Data Approach

- **Mock Data**: Initial financial data is seeded with mock transactions
- **In-Browser Storage**: All changes persist to localStorage automatically
- **CSV Export**: Users can export transaction data for external analysis

## Features

### 📊 Dashboard

The Dashboard provides a comprehensive overview of your financial status:

- **Key Metrics**: Display total income, expenses, and current balance
- **Income/Expense Charts**: Visual bar charts showing monthly breakdown
- **Trend Analysis**: Line chart displaying balance trends over time
- **Distribution Visualization**: Area chart showing income vs. expense distribution
- **Quick Stats**: Card-based summary of important financial metrics with color-coded indicators

### 💰 Transactions

Comprehensive transaction management with powerful filtering capabilities:

- **Transaction List**: Organized table view of all transactions
- **Advanced Filtering**:
  - Search by description
  - Filter by transaction type (income/expense)
  - Filter by spending category
  - Sort by multiple criteria (date, amount)
- **Add Transactions**: Easy-to-use form for adding new income or expense entries
- **Edit/Delete**: Modify or remove transactions from your history
- **Category Management**: Automatic category detection and custom category support
- **CSV Export**: Download transaction data for spreadsheet analysis

### 💡 Insights

Actionable financial intelligence:

- **Top Spending Category**: Identify your largest expense category
- **Monthly Trends**: Month-over-month comparison of spending patterns
- **Smart Observations**: AI-driven insights about your financial behavior
- **Balance Summary**: Quick view of current financial status
- **Spending Distribution**: Category-based breakdown of where your money goes

### 🎨 User Experience

- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop
- **Theme Support**: Automatic dark/light mode detection with user preference override
- **Smooth Animations**: Scroll-triggered reveal animations for visual polish
- **Toast Notifications**: Real-time feedback for user actions
- **Persistent State**: All preferences and transactions saved locally
- **Accessible Navigation**: Clean sidebar navigation with role-switching capabilities

## Data Storage

The application uses browser localStorage for data persistence:

- `finance-dashboard-data-v1`: Stores all transactions
- `finance-dashboard-ui-v1`: Stores UI preferences (theme, filters)

Clear your browser's localStorage to reset to default mock data.

## Browser Support

- Modern browsers with ES6+ support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
