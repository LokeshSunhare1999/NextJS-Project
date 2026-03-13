# Database Setup Guide

## Error: "Callback" - Database Connection Failed

This error means NextAuth cannot connect to your PostgreSQL database to save your session.

## Quick Fix (Choose One Method)

### Method 1: Using PostgreSQL (Recommended for Production)

#### Step 1: Install PostgreSQL

**Windows:**
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the `postgres` user
4. Default port is `5432`

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Step 2: Create Database

**Windows (using pgAdmin or psql):**
```bash
# Open Command Prompt or PowerShell
psql -U postgres

# In psql:
CREATE DATABASE autochangelog;
\q
```

**macOS/Linux:**
```bash
# Create database
createdb autochangelog

# Or using psql:
psql -U postgres
CREATE DATABASE autochangelog;
\q
```

#### Step 3: Update .env

Edit your `.env` file with the correct password:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/autochangelog"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

#### Step 4: Push Database Schema

```bash
npm run db:push
```

You should see:
```
✔ Database synchronized with Prisma schema
```

---

### Method 2: Using Docker (Easiest)

If you have Docker installed:

```bash
# Start PostgreSQL in Docker
docker run --name autochangelog-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=autochangelog \
  -p 5432:5432 \
  -d postgres:14

# Wait 5 seconds for it to start
# Then push schema
npm run db:push
```

Your `.env` should have:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/autochangelog"
```

---

### Method 3: Using SQLite (Quick Testing Only)

For quick testing without PostgreSQL:

#### Step 1: Update Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

#### Step 2: Update .env

```env
DATABASE_URL="file:./dev.db"
```

#### Step 3: Push Schema

```bash
npm run db:push
```

**Note:** SQLite is only for testing. Use PostgreSQL for production.

---

## Verify Database Connection

Test if PostgreSQL is running:

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Test connection
psql -U postgres -c "SELECT version();"
```

**macOS/Linux:**
```bash
# Check if PostgreSQL is running
pg_isready

# Test connection
psql -U postgres -c "SELECT version();"
```

## Common Issues

### Issue 1: "Can't reach database server"

**Solution:**
```bash
# Check if PostgreSQL is running
# Windows:
Get-Service -Name postgresql*

# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Start PostgreSQL if not running
# Windows: Start from Services app
# macOS: brew services start postgresql@14
# Linux: sudo systemctl start postgresql
```

### Issue 2: "Authentication failed for user postgres"

**Solution:**
- Check your password in `.env`
- Reset PostgreSQL password:

```bash
# Windows/macOS/Linux:
psql -U postgres
ALTER USER postgres PASSWORD 'newpassword';
\q

# Update .env with new password
```

### Issue 3: "Database does not exist"

**Solution:**
```bash
# Create the database
createdb autochangelog

# Or using psql:
psql -U postgres
CREATE DATABASE autochangelog;
\q
```

### Issue 4: "Port 5432 already in use"

**Solution:**
```bash
# Find what's using port 5432
# Windows:
netstat -ano | findstr :5432

# macOS/Linux:
lsof -i :5432

# Kill the process or change the port in .env
```

## Complete Setup Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `autochangelog` created
- [ ] `.env` file has correct DATABASE_URL
- [ ] Password in DATABASE_URL is correct
- [ ] Ran `npm run db:push` successfully
- [ ] Restarted dev server (`npm run dev`)

## Test Your Setup

Run this command to test the database connection:

```bash
npx prisma db push
```

Expected output:
```
✔ Database synchronized with Prisma schema
```

If you see this, your database is set up correctly!

## After Database Setup

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Try signing in again:**
   - Go to http://localhost:3000
   - Click "Sign in with GitHub"
   - Should work now!

## View Your Database

Open Prisma Studio to see your data:

```bash
npm run db:studio
```

This opens a web interface at http://localhost:5555 where you can view and edit your database.

## Need More Help?

If you're still having issues:

1. Check the terminal for error messages
2. Verify PostgreSQL is running: `pg_isready`
3. Test database connection: `psql -U postgres -d autochangelog`
4. Check the logs: Look for error messages in your terminal
5. Try the Docker method if PostgreSQL installation is problematic

## Production Deployment

For production, use managed PostgreSQL services:

- **Vercel**: Vercel Postgres
- **Railway**: Railway PostgreSQL
- **Heroku**: Heroku Postgres
- **AWS**: RDS PostgreSQL
- **DigitalOcean**: Managed PostgreSQL

These services provide the DATABASE_URL automatically.
