# Quick Start Guide - Fix "Callback" Error

## The Problem

You're getting a "Callback" error because the database isn't set up. Here's the fastest way to fix it:

## 🚀 Super Quick Fix (5 minutes)

### Option 1: Use Docker (Easiest)

If you have Docker installed:

```bash
# 1. Start PostgreSQL
docker run --name autochangelog-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=autochangelog -p 5432:5432 -d postgres:14

# 2. Wait 10 seconds, then setup database
npm run db:push

# 3. Restart dev server
npm run dev
```

Done! Try signing in again.

---

### Option 2: Use Existing PostgreSQL

If PostgreSQL is already installed:

```bash
# 1. Create database
createdb autochangelog

# 2. Update .env with your PostgreSQL password
# Edit .env and change:
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/autochangelog"

# 3. Setup database
npm run db:push

# 4. Restart dev server
npm run dev
```

Done! Try signing in again.

---

### Option 3: Install PostgreSQL First

**Windows:**
1. Download: https://www.postgresql.org/download/windows/
2. Install (remember the password!)
3. Then run:
```bash
createdb autochangelog
npm run db:push
npm run dev
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
createdb autochangelog
npm run db:push
npm run dev
```

**Linux:**
```bash
sudo apt install postgresql
sudo systemctl start postgresql
sudo -u postgres createdb autochangelog
npm run db:push
npm run dev
```

---

## ✅ Verify It Works

After setup, you should see:

```
✔ Database synchronized with Prisma schema
```

Now go to http://localhost:3000 and sign in with GitHub!

---

## Still Having Issues?

### Check if PostgreSQL is running:

```bash
# Windows (PowerShell):
Get-Service -Name postgresql*

# macOS:
brew services list

# Linux:
sudo systemctl status postgresql
```

### Check database connection:

```bash
npx prisma db push
```

If you see errors, check [DATABASE_SETUP.md](./DATABASE_SETUP.md) for detailed troubleshooting.

---

## What's Next?

Once sign-in works:

1. ✅ Sign in with GitHub
2. ✅ Connect a repository
3. ✅ View commits and releases
4. ✅ Generate changelogs

See [USER_GUIDE.md](./USER_GUIDE.md) for full documentation.
