# Movie Tracker

A modern, professional movie/TV tracking web application built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Search Movies & TV Shows**: Integrated with TMDB API
- **Track Watched Content**: Add, rate, and take notes on movies and TV shows
- **Watchlist Management**: Keep track of content you want to watch
- **Authentication**: Secure login with GitHub and Google OAuth
- **Responsive Design**: Works on all device sizes
- **Light/Dark Theme**: Automatic theme switching based on system preference

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Auth.js with OAuth providers
- **Caching**: Upstash Redis for session storage
- **Testing**: Jest for unit tests, Playwright for E2E tests

## Prerequisites

- Node.js 18+ 
- pnpm (or npm/yarn)
- TMDB API Key
- GitHub/Google OAuth credentials (for authentication)
- Neon PostgreSQL database
- Upstash Redis instance

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Create a `.env.local` file in the root directory with the following environment variables:

```env
# Database
DATABASE_URL="your_neon_postgres_connection_string"

# Session storage (Upstash Redis)
UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"

# TMDB API
TMDB_API_KEY="your_tmdb_api_key"

# OAuth Providers
GITHUB_ID="your_github_client_id"
GITHUB_SECRET="your_github_client_secret"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

4. Setup the database schema:
```bash
pnpm run db:generate
pnpm run db:migrate
```

5. Run the development server:
```bash
pnpm run dev
# or
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Environment Variables

- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST API URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST API token
- `TMDB_API_KEY`: Your TMDB API key (get it from [themoviedb.org](https://www.themoviedb.org/settings/api))
- `GITHUB_ID` & `GITHUB_SECRET`: GitHub OAuth app credentials
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth app credentials
- `NEXTAUTH_URL`: URL of your application
- `NEXTAUTH_SECRET`: Secret for NextAuth (use `openssl rand -base64 32` to generate)

## Running Tests

### Unit Tests
```bash
pnpm run test
# or
npm run test
```

### E2E Tests
```bash
pnpm run test:e2e
# or
npm run test:e2e
```

## Project Structure

```
movie-tracker/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page with search
│   ├── watched/            # Watched content page
│   ├── watchlist/          # Watchlist page
│   └── api/                # API routes
├── components/             # Reusable React components
│   ├── ui/                 # Shadcn UI components
│   └── navigation.tsx      # Navigation component
├── hooks/                  # React hooks
├── store/                  # Zustand store
├── lib/                    # Utility functions and libraries
├── services/               # Business logic services
├── types/                  # TypeScript type definitions
├── tests/                  # Unit and E2E tests
└── drizzle/                # Database schema and migrations
```

## API Documentation

### TMDB API
The application uses TMDB API for searching movies and TV shows. The search endpoint is available at `/api/tmdb/search?q={query}`.

## Deployment

The application is optimized for deployment on Vercel. When deploying:

1. Set up all required environment variables in your Vercel project
2. Configure your database connection for production
3. Set up OAuth providers with your production domain
4. Add your domain to the allowed callback URLs in OAuth providers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License.
