# ITMS Pro Dashboard (Intelligent Traffic Management System)

A futuristic, high-performance web dashboard built with **React**, **Vite**, and **Material-UI (MUI)**. It features a custom "Deep Space" theme with glassmorphism, neon accents, and a component-based architecture.

## 🚀 Getting Started

Follow these instructions to run the dashboard on your local machine.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18 or higher is recommended, but Vite v5 is configured here for maximum compatibility with older versions like v22.1.0).

### Installation & Running

1. **Open your terminal** and navigate to the project directory:
   ```bash
   cd itms-dashboard
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **View the App**: Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

---

## 📁 Folder Architecture

The project is structured following modern React best practices to ensure scalability and maintainability:

```
itms-dashboard/
├── public/                 # Static assets (favicons, etc.)
├── src/
│   ├── assets/             # Images, fonts, and global assets
│   ├── layouts/            # Global layouts
│   │   └── MainLayout.tsx  # The shell containing the Sidebar and Header
│   ├── pages/              # Specific views/pages of the app
│   │   └── Dashboard/      # The main dashboard view
│   │       └── components/ # Components exclusive to the Dashboard
│   │           ├── RecentViolationsPlaceholder.tsx
│   │           ├── StatCard.tsx
│   │           └── TrafficChartPlaceholder.tsx
│   ├── theme/              # Design system and theming
│   │   └── index.ts        # Global MUI Theme configuration (Neon/Glassmorphism)
│   ├── App.tsx             # Root component that assembles Layout and Pages
│   ├── main.tsx            # React entry point
│   └── index.css           # Global CSS overrides (background gradients, scrollbars)
├── package.json            # Project metadata and dependencies
└── vite.config.ts          # Vite build tool configuration
```

## 🎨 Design System

This project uses a custom Material-UI theme configured in `src/theme/index.ts`. 
- **Colors**: Neon Cyan (`#00D2FF`), Purple (`#B100FF`), Red (`#FF0055`), and Amber (`#FFB800`).
- **Glassmorphism**: Components like the Sidebar, Header, and Cards utilize `backdrop-filter: blur()` and transparent backgrounds to create a layered, futuristic UI.
- **Typography**: Uses the 'Inter' Google Font for clean, modern readability.

## 🛠 Tech Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/)
- **UI Library**: [Material-UI (MUI v6)](https://mui.com/)
- **Icons**: Material Icons (`@mui/icons-material`)
