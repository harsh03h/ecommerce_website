# Vercel Login 500 Error - Debugging Guide

## Problem
You're getting: `Server returned non-JSON: 500 A server error has occurred`

This typically means one of these issues on Vercel:

1. **Missing Environment Variables** - MongoDB or JWT credentials not set
2. **MongoDB Connection Timeout** - IP not whitelisted or connection string wrong
3. **Unhandled Exception** - Code throwing error before JSON response

## Quick Fix Checklist

### ✅ Step 1: Set Environment Variables on Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables

Add these variables:
```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/cloth-store?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-random-string-min-32-chars
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### ✅ Step 2: Whitelist Vercel IPs on MongoDB Atlas

1. Go to MongoDB Atlas → Network Access
2. Add IP Address → Allow Access From Anywhere (0.0.0.0/0)
3. **IMPORTANT**: This allows any IP, so use strong passwords!

Or add Vercel's IP ranges specifically (check Vercel docs for current IPs)

### ✅ Step 3: Verify Deployment Build

1. Check Vercel build logs for errors
2. Ensure `npm run build` completes successfully
3. Check that `.next` or `dist/` is being generated correctly

### ✅ Step 4: Add Debug Logging

The updated `server.ts` now logs errors to Vercel's console. Check:
1. Vercel project → Deployments → Select deployment → Logs
2. Look for error messages in the logs

## Common Errors Explained

### "MONGODB_URI is missing"
**Fix**: Add MONGODB_URI to Vercel environment variables

### "Failed to connect to MongoDB: ENOTFOUND"
**Fix**: Check MongoDB connection string. Verify IP whitelist includes 0.0.0.0/0

### "GOOGLE_CLIENT_ID not configured"
**Fix**: Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to Vercel environment variables

### "Connection timeout"
**Fix**: This could be:
- MongoDB IP not whitelisted
- Network issue with MongoDB Atlas
- Vercel cold start timeout (increase timeout in vercel.json)

## Testing Locally

```bash
# Copy .env.example to .env
cp .env.example .env

# Update .env with your real credentials
nano .env

# Install dependencies
npm install

# Start server
npm run dev

# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Vercel Logs

To see real-time logs from your Vercel deployment:

```bash
# Install Vercel CLI if you haven't
npm install -g vercel

# Login to Vercel
vercel login

# Tail logs
vercel logs your-project-name --follow
```

## MongoDB Connection String Format

Make sure your MONGODB_URI looks like this:
```
mongodb+srv://username:password@cluster0.abc1234.mongodb.net/dbname?retryWrites=true&w=majority
```

**Important**: If your password has special characters, they must be URL-encoded!
- `@` → `%40`
- `#` → `%23`
- `:` → `%3A`
- `/` → `%2F`

Use this tool to encode: https://www.urlencoder.org/

## Still Not Working?

1. Check Vercel logs: `vercel logs your-project-name`
2. Look for "MongoDB connection error" or specific error message
3. Verify all environment variables are set
4. Ensure database credentials are correct
5. Check MongoDB Atlas IP whitelist is set to 0.0.0.0/0

Need more help? Reply with a screenshot of your Vercel logs!
