# Getting Started with AutoChangelog

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **npm** or **yarn**

## Installation Steps

### 1. Clone and Install Dependencies

```bash
# Install dependencies
npm install
```

### 2. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE autochangelog;

# Exit psql
\q
```

### 3. Set Up GitHub OAuth Application

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: AutoChangelog (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/autochangelog"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Redis
REDIS_URL="redis://localhost:6379"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 5. Set Up Database Schema

Run Prisma migrations to create database tables:

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### 6. Start Redis Server

Make sure Redis is running:

```bash
# On macOS (with Homebrew)
brew services start redis

# On Linux
sudo systemctl start redis

# Or run directly
redis-server
```

### 7. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Verify Installation

1. Open `http://localhost:3000` in your browser
2. You should see the AutoChangelog homepage
3. Try signing in with GitHub to verify OAuth is working

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

```bash
# Check if PostgreSQL is running
pg_isready

# Verify your DATABASE_URL in .env matches your PostgreSQL setup
```

### Redis Connection Issues

```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG
```

### GitHub OAuth Issues

- Verify your callback URL matches exactly: `http://localhost:3000/api/auth/callback/github`
- Check that Client ID and Secret are correct in `.env`
- Make sure NEXTAUTH_URL is set correctly

## Next Steps

Once the application is running, proceed to [USER_GUIDE.md](./USER_GUIDE.md) to learn how to use AutoChangelog.

## Development Tools

### Prisma Studio

View and edit your database:

```bash
npm run db:studio
```

### Database Migrations

When you modify the schema:

```bash
npm run db:migrate
```

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) (coming soon).
