# Setup Instructions for Vercel Deployment

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier ok)
- Vercel account
- Git repository

## Quick Start (5 minutes)

### 1. Local Development Setup

```bash
# Clone the repository
git clone <your-repo>
cd Cloth-Store-Harsh

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your actual credentials
nano .env
```

### 2. Configure Environment Variables

Edit `.env` with:
```
# Get from MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster0.xxx.mongodb.net/cloth-store?retryWrites=true&w=majority

# Generate a random string (min 32 chars)
JWT_SECRET=your-random-secret-string-min-32-character-length

# Get from Google Cloud Console
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
```

### 3. Test Locally

```bash
# Start development server
npm run dev

# In another terminal, test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Should return JSON error or success response, NOT HTML error
```

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

During deployment, when asked:
- **Scope**: Your account/organization
- **Project**: Create new project
- **Framework**: Vite
- **Root directory**: ./
- **Build command**: `npm run build`
- **Install command**: `npm install`

### 5. Add Environment Variables to Vercel

```bash
# Set each environment variable
vercel env add MONGODB_URI
vercel env add JWT_SECRET  
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET

# Or use Vercel dashboard: 
# Project → Settings → Environment Variables
```

### 6. MongoDB Atlas Network Access

```
MongoDB Atlas → Network Access 
→ Add IP Address 
→ Allow Access From Anywhere (0.0.0.0/0)
→ Confirm
```

### 7. Redeploy After Adding Env Vars

```bash
# Push to redeploy
git add .
git commit -m "Fix: Add error handling for login"
git push

# Or manually redeploy
vercel --prod
```

## Troubleshooting

### Test Local Server
```bash
./debug-vercel-login.sh
```

### View Vercel Logs
```bash
vercel logs your-project-name --follow --l=200
```

### Test Endpoint Directly
```bash
npx ts-node test-login-endpoint.ts
```

### Common Issues

| Issue | Solution |
|-------|----------|
| "No .env file" | Run: `cp .env.example .env` and fill in values |
| "Cannot connect to MongoDB" | Check `.env` has correct MONGODB_URI |
| "Server returned non-JSON: 500" | Check Vercel logs, add missing env vars |
| "Invalid credentials" | User doesn't exist yet, use Register endpoint |
| "Timeout on Vercel" | Check MongoDB Atlas IP whitelist includes 0.0.0.0/0 |

## Building for Production

```bash
# Build the app
npm run build

# Preview production build locally
npm run preview

# This creates a 'dist' folder that Vercel serves
```

## Important Notes

1. **MongoDB Connection**: The connection string format is:
   ```
   mongodb+srv://user:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **Special Characters**: If your password has special characters (@, #, $, etc.), they must be URL-encoded in the connection string.

3. **IP Whitelist**: Always allow 0.0.0.0/0 for Vercel (your password provides security, not IP restriction).

4. **Cold Starts**: The vercel.json is configured with 30-second timeout to handle MongoDB cold connections.

5. **Environment Variables**: Must be set in Vercel dashboard BEFORE redeploying after code changes.

## Verify Deployment

```bash
# List your deployments
vercel list

# View specific deployment
vercel inspect <deployment-url>

# Check environment variables
vercel env ls

# View logs
vercel logs <project-name>
```

## Support Files

- `DEBUG_LOGIN_VERCEL.md` - Full debugging guide
- `VERCEL_LOGIN_FIX.md` - Quick fix guide
- `debug-vercel-login.sh` - Automated diagnostics script
- `test-login-endpoint.ts` - Test login endpoint locally

## Next Steps

1. Follow the "Quick Start" section above
2. Test locally with `npm run dev`
3. Deploy with `vercel`
4. Check logs with `vercel logs`
5. Test the deployed endpoint
6. If issues persist, run `./debug-vercel-login.sh` and share the output

Good luck! 🚀
