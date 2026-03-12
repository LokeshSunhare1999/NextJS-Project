# Setup Instructions for AutoChangelog

## Quick Fix for Current Error

The error you're seeing is because the `@next-auth/prisma-adapter` package was missing. I've already installed it, but you need to regenerate Prisma client.

### Step 1: Close any running processes

If you have `npm run dev` running, stop it (Ctrl+C).

### Step 2: Generate Prisma Client

Try one of these methods:

**Method 1 (Recommended):**
```bash
npx prisma generate
```

**Method 2 (If Method 1 fails):**
```bash
# Delete the .prisma folder
rm -rf node_modules/.prisma

# Regenerate
npx prisma generate
```

**Method 3 (If you get permission errors on Windows):**
```bash
# Close VS Code and any terminals
# Then run as Administrator:
npx prisma generate
```

### Step 3: Set up your database

Make sure PostgreSQL is running, then:

```bash
# Push the schema to your database
npm run db:push
```

### Step 4: Configure Environment Variables

Make sure your `.env` file has all required values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/autochangelog"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
REDIS_URL="redis://localhost:6379"
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### Step 5: Start the development server

```bash
npm run dev
```

## Complete Setup from Scratch

If you're starting fresh, follow these steps:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up PostgreSQL

```bash
# Create database
createdb autochangelog

# Or using psql:
psql -U postgres
CREATE DATABASE autochangelog;
\q
```

### 3. Set up Redis

**On Windows:**
- Download Redis from: https://github.com/microsoftarchive/redis/releases
- Or use Docker: `docker run -d -p 6379:6379 redis`

**On macOS:**
```bash
brew install redis
brew services start redis
```

**On Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

### 4. Configure GitHub OAuth

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: `AutoChangelog Dev`
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a Client Secret

### 5. Create .env file

```bash
cp .env.example .env
```

Edit `.env` with your values.

### 6. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

### 7. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Troubleshooting

### Error: "Can't resolve '@next-auth/prisma-adapter'"

**Solution:**
```bash
npm install @next-auth/prisma-adapter
npx prisma generate
```

### Error: "EPERM: operation not permitted" (Windows)

**Solution:**
1. Close all terminals and VS Code
2. Open terminal as Administrator
3. Run: `npx prisma generate`

### Error: "Can't reach database server"

**Solution:**
- Check if PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in .env
- Test connection: `psql -U postgres -d autochangelog`

### Error: "Redis connection refused"

**Solution:**
- Check if Redis is running: `redis-cli ping` (should return PONG)
- Start Redis: `redis-server`

### Error: "Invalid client_id or client_secret"

**Solution:**
- Verify GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env
- Make sure callback URL matches: `http://localhost:3000/api/auth/callback/github`

### Error: "Module not found" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Verify Installation

After setup, verify everything works:

1. **Homepage loads**: http://localhost:3000
2. **Sign in button appears**: Click "Sign in with GitHub"
3. **GitHub OAuth works**: Authorize the app
4. **Dashboard loads**: You should see the dashboard after sign-in
5. **Database connection**: Check Prisma Studio: `npm run db:studio`

## Next Steps

Once everything is running:

1. Sign in with GitHub
2. Click "Connect Repository"
3. Select a repository to connect
4. View commits and releases

For more details, see:
- [USER_GUIDE.md](./USER_GUIDE.md) - How to use the application
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Detailed setup guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical documentation
