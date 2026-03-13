# GitHub OAuth Setup Guide

## Error: "OAuthSignin - Try signing in with a different account"

This error means your GitHub OAuth credentials are not configured correctly. Follow these steps:

## Step 1: Create GitHub OAuth App

1. Go to **GitHub Settings**: https://github.com/settings/developers
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"** button
4. Fill in the form:

   ```
   Application name: AutoChangelog Local Dev
   Homepage URL: http://localhost:3000
   Application description: (optional) Automated changelog generator
   Authorization callback URL: http://localhost:3000/api/auth/callback/github
   ```

5. Click **"Register application"**
6. You'll see your **Client ID** - copy it
7. Click **"Generate a new client secret"** - copy the secret immediately (you won't see it again!)

## Step 2: Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist):

```bash
# Copy from example
cp .env.example .env
```

2. Edit `.env` and add your GitHub credentials:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/autochangelog"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# GitHub OAuth (REQUIRED!)
GITHUB_CLIENT_ID="your-github-client-id-here"
GITHUB_CLIENT_SECRET="your-github-client-secret-here"

# Redis (for background jobs)
REDIS_URL="redis://localhost:6379"
```

## Step 3: Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

**On Windows (PowerShell):**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `NEXTAUTH_SECRET` value.

## Step 4: Verify Your .env File

Your `.env` should look like this (with your actual values):

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/autochangelog"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="abc123xyz789randomsecrethere=="
GITHUB_CLIENT_ID="Iv1.a1b2c3d4e5f6g7h8"
GITHUB_CLIENT_SECRET="1234567890abcdef1234567890abcdef12345678"
REDIS_URL="redis://localhost:6379"
```

## Step 5: Restart Your Development Server

**IMPORTANT:** After changing `.env`, you MUST restart the server:

1. Stop the server (Ctrl+C)
2. Start it again:
```bash
npm run dev
```

## Step 6: Test Sign In

1. Go to http://localhost:3000
2. Click "Sign in with GitHub"
3. You should be redirected to GitHub
4. Authorize the application
5. You'll be redirected back to your dashboard

## Common Issues & Solutions

### Issue 1: "Invalid client_id"
**Solution:** 
- Double-check your `GITHUB_CLIENT_ID` in `.env`
- Make sure there are no extra spaces or quotes
- Verify it matches the Client ID in your GitHub OAuth app

### Issue 2: "Redirect URI mismatch"
**Solution:**
- Verify the callback URL in GitHub OAuth app is exactly: `http://localhost:3000/api/auth/callback/github`
- Make sure `NEXTAUTH_URL` in `.env` is: `http://localhost:3000`
- No trailing slashes!

### Issue 3: "Invalid client_secret"
**Solution:**
- Regenerate the client secret in GitHub
- Copy it immediately and update `.env`
- Restart your dev server

### Issue 4: Still getting errors
**Solution:**
```bash
# 1. Clear Next.js cache
rm -rf .next

# 2. Verify .env is in the root directory
ls -la .env

# 3. Check .env is not in .gitignore (it should be!)
cat .gitignore | grep .env

# 4. Restart the server
npm run dev
```

## Verify Configuration

Run this command to check if environment variables are loaded:

```bash
node -e "require('dotenv').config(); console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID ? 'Set ✓' : 'Missing ✗'); console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET ? 'Set ✓' : 'Missing ✗'); console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set ✓' : 'Missing ✗');"
```

## Security Notes

⚠️ **NEVER commit your `.env` file to Git!**
⚠️ **NEVER share your `GITHUB_CLIENT_SECRET`**
⚠️ **Use different OAuth apps for development and production**

## Production Setup

For production deployment:

1. Create a new GitHub OAuth App with your production URL
2. Set environment variables in your hosting platform (Vercel, Railway, etc.)
3. Update callback URL to: `https://yourdomain.com/api/auth/callback/github`

## Need Help?

If you're still having issues:

1. Check the terminal for error messages
2. Check browser console for errors (F12)
3. Verify all environment variables are set correctly
4. Make sure PostgreSQL and Redis are running
5. Try creating a new GitHub OAuth app from scratch

## Quick Checklist

- [ ] Created GitHub OAuth App
- [ ] Copied Client ID to `.env`
- [ ] Copied Client Secret to `.env`
- [ ] Generated and set NEXTAUTH_SECRET
- [ ] Callback URL is `http://localhost:3000/api/auth/callback/github`
- [ ] NEXTAUTH_URL is `http://localhost:3000`
- [ ] Restarted dev server after changing `.env`
- [ ] PostgreSQL is running
- [ ] Database is created and migrated

Once all checkboxes are complete, sign-in should work!
