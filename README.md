# 🎬 Movie & TV Show Management App

A full-stack Netflix-inspired application for managing your favorite movies and TV shows. Built with Next.js 15, Turso (SQLite), Drizzle ORM, and Better Auth.

![Netflix-themed UI](https://img.shields.io/badge/UI-Netflix--Inspired-E50914?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality
- **CRUD Operations**: Create, Read, Update, and Delete movies/TV shows
- **Infinite Scrolling**: Smooth pagination for large collections
- **Real-time Search & Filtering**: Find your content instantly
- **Image Management**: Poster thumbnail display with fallback placeholders

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure user sessions with Better Auth
- **Protected Routes**: Middleware-based route protection
- **User-scoped Data**: Users can only access their own entries
- **"Remember Me"**: Persistent login sessions

### 📊 Entry Management
Each entry includes:
- **Title** (required)
- **Type**: Movie or TV Show (required)
- **Director** (required)
- **Genre** (required)
- **Release Year** (required)
- **Budget**: Optional, in dollars
- **Duration**: In minutes (required)
- **Rating**: 0-10 scale (required)
- **Location**: Optional
- **Poster URL**: Optional image link
- **Description** (required)

### 🎨 Design Features
- Netflix-inspired dark theme with red accents
- Gradient backgrounds and glassmorphism effects
- Smooth animations and transitions
- Fully responsive design for all devices
- Modern UI with Shadcn/ui components

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ or **Bun** 1.0+
- **Turso Database** account ([Sign up here](https://turso.tech))
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/movie-management-app.git
cd movie-management-app
```

2. **Install dependencies**
```bash
bun install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=libsql://your-database-url.turso.io
DATABASE_AUTH_TOKEN=your-auth-token

# Authentication
BETTER_AUTH_SECRET=your-secret-key-min-32-characters
BETTER_AUTH_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting Turso Credentials:**
```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Create a database
turso db create movie-app

# Get database URL
turso db show movie-app --url

# Create auth token
turso db tokens create movie-app
```

4. **Run database migrations**
```bash
bun run db:push
```

5. **Start the development server**
```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## 📁 Project Structure

```
movie-management-app/
├── drizzle/
│   ├── meta/
│   ├── 0000_rich_wrecker.sql
│   └── 0001_left_kitty_pryde.sql
├── public/
├── src/
│   ├── app/
│   │   ├── api/              # API routes for CRUD operations
│   │   ├── dashboard/        # Main dashboard page
│   │   ├── login/            # Login page
│   │   ├── profile/          # User profile page
│   │   ├── signup/           # Registration page
│   │   ├── favicon.ico
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing page
│   ├── components/           # Reusable React components
│   ├── db/                   # Database schema and config
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions
├── .env                      # Environment variables
├── .gitignore
├── bun.lock
├── components.json           # Shadcn/ui config
├── drizzle.config.ts         # Drizzle ORM config
├── eslint.config.mjs
├── middleware.ts             # Auth middleware
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## 🛠️ Available Scripts

```bash
# Development
bun run dev              # Start development server

# Database
bun run db:push          # Push schema changes to database
bun run db:studio        # Open Drizzle Studio for database management
bun run db:generate      # Generate migration files

# Build
bun run build            # Build for production
bun run start            # Start production server

# Linting
bun run lint             # Run ESLint
```

## 📖 Usage Guide

### 1. Create an Account
Navigate to `/signup` and register with your email and password.

### 2. Login
Go to `/login` and sign in with your credentials. Check "Remember me" for persistent sessions.

### 3. Add Entries
From the dashboard (`/dashboard`):
- Click "Add Entry" button
- Fill in the form with movie/TV show details
- Optionally add a poster URL for thumbnail display
- Click "Save" to add the entry

### 4. Manage Entries
- **View**: Scroll through your collection with infinite scrolling
- **Edit**: Click the "Edit" button on any entry to modify details
- **Delete**: Click "Delete" and confirm to remove an entry

### 5. Profile
Visit `/profile` to view your account details and statistics.

## 🔧 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Turso](https://turso.tech/) (LibSQL/SQLite)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://www.better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Form Validation**: [Zod](https://zod.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## 🌐 API Routes

### Entries
- `GET /api/entries` - Fetch all entries (paginated)
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout

All API routes require JWT authentication (except signup/login).

## 🎨 Customization

### Changing Theme Colors
Edit `src/app/globals.css`:
```css
:root {
  --primary: 0 0% 98%;           /* Netflix Red */
  --background: 0 0% 8%;         /* Dark background */
  /* ... other variables */
}
```

### Modifying Database Schema
Edit `src/db/schema.ts` and run:
```bash
bun run db:generate
bun run db:push
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Verify Turso connection
turso db show movie-app

# Check if token is valid
turso db tokens list movie-app
```

### Authentication Errors
- Ensure `BETTER_AUTH_SECRET` is at least 32 characters
- Verify `BETTER_AUTH_URL` matches your app URL

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules bun.lock
bun install
bun run build
```


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

Swapnanil Manna - [@yourtwitter](https://x.com/swapnaneel1701)

Project Link: [https://github.com/Swapnanilmanna1701/movie-management-app](https://github.com/Swapnanilmanna1701/media-manager-with-auth--profile)

---

⭐ Star this repo if you found it helpful!
