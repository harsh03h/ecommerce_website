# Quick Fix for Vercel Login 500 Error

## 🔴 Your Error
```
Server returned non-JSON: 500 A server error has occurred
FUNCTION_INVOCATION_FAILED
```

---

## ✅ IMMEDIATE ACTIONS (Do These First!)

### Step 1: Add Vercel Environment Variables

1. Go to: **https://vercel.com/dashboard**
2. Select your project → **Settings → Environment Variables**
3. Add these 4 variables:

```
MONGODB_URI = mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/cloth-store?retryWrites=true&w=majority
JWT_SECRET = your-random-secret-string-min-32-characters-long
GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET = your-client-secret
```

**Getting your MongoDB URI:**
- Go to MongoDB Atlas → Database → Connect → Drivers → Node.js
- Copy the connection string and replace `<password>` with your actual password
- Replace `myFirstDatabase` with `cloth-store`

### Step 2: Whitelist Vercel IPs on MongoDB Atlas

1. Go to: **MongoDB Atlas → Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access From Anywhere" (0.0.0.0/0)**
4. Click **"Confirm"**

⚠️ This allows any IP, so ensure your MongoDB password is strong!

### Step 3: Redeploy on Vercel

```bash
# Push changes to trigger redeploy
git add .
git commit -m "Fix: Improve error handling for login"
git push origin main
```

Then check Vercel dashboard - deployment should start automatically.

---

## 🔍 VERIFY THE FIX

### Option A: Check Vercel Logs
```bash
# Install Vercel CLI
npm install -g vercel

# View logs
vercel logs your-project-name --follow --l=200
```

Look for:
- ✅ "Connected to MongoDB successfully!" = Good
- ❌ "MongoDB connection error" = Check IP whitelist
- ❌ "MONGODB_URI is missing" = Add env variable

### Option B: Test Locally
```bash
# Create .env file
cp .env.example .env

# Edit .env with your real MongoDB credentials
nano .env

# Install dependencies (if not done)
npm install

# Start server
npm run dev

# In another terminal, test login:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

You should get a JSON response like:
```json
{"error": "Invalid credentials"}
```

NOT:
```
Server returned non-JSON: 500
```

---

## 🆘 STILL NOT WORKING? DIAGNOSE HERE

### Debug Script
```bash
# Run the automatic debug script
chmod +x debug-vercel-login.sh
./debug-vercel-login.sh
```

This will check:
- ✓ Environment variables
- ✓ MongoDB settings
- ✓ Dependencies
- ✓ Build configuration
- ✓ Server responsiveness

### Common Issues

| Error | Cause | Fix |
|-------|-------|-----|
| "MONGODB_URI is missing" | Env variable not set | Add to Vercel dashboard |
| "Failed to connect to MongoDB" | IP not whitelisted | Set MongoDB Atlas to 0.0.0.0/0 |
| "ENOTFOUND" | Wrong connection string | Verify MongoDB URI format |
| "Connection timeout" | MongoDB cluster too slow | Check cluster is running (Atlas dashboard) |
| "Invalid credentials" | Wrong DB setup | Test locally with correct `.env` |

---

## 📋 CHECKLIST (Before asking for help)

- [ ] Added MONGODB_URI to Vercel environment variables
- [ ] Added JWT_SECRET to Vercel environment variables  
- [ ] Added GOOGLE_CLIENT_ID to Vercel environment variables
- [ ] Added GOOGLE_CLIENT_SECRET to Vercel environment variables
- [ ] Whitelisted 0.0.0.0/0 on MongoDB Atlas Network Access
- [ ] Redeployed on Vercel after adding env variables
- [ ] Checked Vercel logs for specific error messages
- [ ] Tested login endpoint locally with correct `.env` file
- [ ] MongoDB connection string format is correct

---

## 🆔 MongoDB Connection String Help

### Format Must Be:
```
mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
```

### Example:
```
mongodb+srv://admin:MyP@ssw0rd@cluster0.a1b2c3d.mongodb.net/cloth-store?retryWrites=true&w=majority
```

### Special Characters in Password Must Be URL-Encoded:
| Char | Encoded |
|------|---------|
| @ | %40 |
| # | %23 |
| $ | %24 |
| / | %2F |
| : | %3A |
| ? | %3F |

**Tool**: Use https://www.urlencoder.org/ to encode your password

---

## 📝 Files Modified for Better Error Handling

- ✅ `server.ts` - Added error logging and JSON response guarantees
- ✅ `vercel.json` - Increased timeout to 30 seconds
- ✅ `.env.example` - Shows required variables
- ✅ `DEBUG_LOGIN_VERCEL.md` - Full debugging guide
- ✅ `debug-vercel-login.sh` - Automated diagnostics

---

## 💬 Still Need Help?

Provide:
1. Screenshot of your Vercel Build Logs (Deployments → your deployment → Logs)
2. Screenshot of your Environment Variables (Settings → Environment Variables)
3. Output of `/debug-vercel-login.sh` script
4. Your MongoDB Atlas Network Access settings screenshot

This will help identify the exact issue!
