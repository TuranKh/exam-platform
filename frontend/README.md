# Application README

## Project Overview

This project is a modern web application built with **React**, **Vite**, and **TypeScript**, leveraging **Supabase** for backend services. It is designed for optimal performance and maintainability.

## Features

- **React 18**
- **Vite**
- **TypeScript**
- **Supabase**
- **Node.js v20**
- **Zustand**

## Requirements

To run this project, you need to have the following installed:

- **Node.js v20**
- **npm** (Node Package Manager)

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_KEY=your-supabase-anon-key
   ```

   Replace `your-supabase-url` and `your-supabase-anon-key` with your actual Supabase credentials.

4. **Start the Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` by default.

5. **Build for Production**

   To create an optimized production build:

   ```bash
   npm run build
   ```

   The build output will be located in the `dist` folder.

## Folder Structure

```
project-root
├── public
│   └── favicon.svg
├── src
│   ├── assets        # Static assets like images
│   ├── components    # React components
│   ├── config        # Configuration files (e.g., HttpClient, Interceptor, QueryConfig)
│   ├── hooks         # Custom React hooks
│   ├── lib           # Utility functions or libraries
│   ├── pages         # Application pages
│   ├── service       # API services and Supabase integration
│   ├── store         # Zustand state management
│   ├── supabase      # Supabase client setup
│   ├── App.css       # Global styles
│   ├── App.tsx       # Main application file
│   ├── index.css     # Index styles
│   ├── main.tsx      # Entry point
│   └── vite-env.d.ts # Vite environment types
├── .gitignore        # Git ignore file
├── .prettierrc       # Prettier configuration
├── components.json   # Component metadata
├── env.ts            # Environment configuration
├── eslint.config.js  # ESLint configuration
├── index.html        # Main HTML file
├── package.json      # Project metadata and dependencies
├── package-lock.json # Dependency lock file
├── postcss.config.js # PostCSS configuration
├── README.md         # Project documentation
├── tailwind.config.js# Tailwind CSS configuration
├── tsconfig.app.json # TypeScript configuration for app
├── tsconfig.json     # TypeScript base configuration
├── tsconfig.node.json# TypeScript configuration for Node
└── vite.config.ts    # Vite configuration
```

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, and Storage)
- **State Management**: Zustand
- **Build Tool**: Vite
- **Runtime**: Node.js v20

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are welcome!

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or feedback, please contact [turan.khidilov@gmail.com].
