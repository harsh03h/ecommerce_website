#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Cloth Store Login Vercel Debug Script ===${NC}\n"

# Check .env file
echo -e "${YELLOW}[1] Checking environment configuration...${NC}"
if [ -f .env ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    if grep -q "MONGODB_URI" .env; then
        echo -e "${GREEN}✓ MONGODB_URI is set${NC}"
    else
        echo -e "${RED}✗ MONGODB_URI is missing${NC}"
    fi
    if grep -q "JWT_SECRET" .env; then
        echo -e "${GREEN}✓ JWT_SECRET is set${NC}"
    else
        echo -e "${RED}✗ JWT_SECRET is missing (using default)${NC}"
    fi
    if grep -q "GOOGLE_CLIENT_ID" .env; then
        echo -e "${GREEN}✓ GOOGLE_CLIENT_ID is set${NC}"
    else
        echo -e "${RED}✗ GOOGLE_CLIENT_ID is missing${NC}"
    fi
else
    echo -e "${YELLOW}⚠ No .env file found. Using .env.example as reference${NC}"
    if [ -f .env.example ]; then
        echo -e "${YELLOW}  → Copy .env.example to .env and fill in your credentials:${NC}"
        echo -e "${YELLOW}     cp .env.example .env${NC}"
    fi
fi

echo -e "\n${YELLOW}[2] Checking dependencies...${NC}"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js $(node -v)${NC}"
else
    echo -e "${RED}✗ Node.js is not installed${NC}"
fi

if [ -f package.json ]; then
    echo -e "${GREEN}✓ package.json exists${NC}"
else
    echo -e "${RED}✗ package.json not found${NC}"
fi

if [ -d node_modules ]; then
    echo -e "${GREEN}✓ node_modules exists${NC}"
else
    echo -e "${YELLOW}⚠ node_modules not found. Run: npm install${NC}"
fi

echo -e "\n${YELLOW}[3] Checking key files...${NC}"
if [ -f server.ts ]; then
    echo -e "${GREEN}✓ server.ts exists${NC}"
else
    echo -e "${RED}✗ server.ts not found${NC}"
fi

if [ -f "src/components/Login.tsx" ]; then
    echo -e "${GREEN}✓ Login.tsx exists${NC}"
else
    echo -e "${RED}✗ Login.tsx not found${NC}"
fi

if [ -f vercel.json ]; then
    echo -e "${GREEN}✓ vercel.json exists${NC}"
    echo "   Content:"
    cat vercel.json | sed 's/^/   /'
else
    echo -e "${YELLOW}⚠ vercel.json not found (deployment might fail)${NC}"
fi

echo -e "\n${YELLOW}[4] Checking build configuration...${NC}"
if grep -q "build" package.json; then
    BUILDCMD=$(grep -A1 '"build"' package.json | tail -1 | sed 's/.*"build": "//' | sed 's/".*//')
    echo -e "${GREEN}✓ Build command: $BUILDCMD${NC}"
else
    echo -e "${YELLOW}⚠ No build script found${NC}"
fi

if grep -q "dev" package.json; then
    echo -e "${GREEN}✓ Dev script exists${NC}"
else
    echo -e "${YELLOW}⚠ No dev script${NC}"
fi

echo -e "\n${YELLOW}[5] Attempting to start server locally (if dependencies installed)...${NC}"
if [ -d node_modules ]; then
    echo -e "${YELLOW}Starting server in background for 5 seconds...${NC}"
    timeout 5 npm run dev &
    sleep 2
    
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Server is responding on localhost:3000${NC}"
        
        echo -e "\n  Testing login endpoint with invalid credentials..."
        RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
          -H "Content-Type: application/json" \
          -d '{"email":"test@example.com","password":"test123"}')
        
        if echo "$RESPONSE" | grep -q "error"; then
            echo -e "${GREEN}✓ Server returns error response (expected)${NC}"
            echo "  Response: $RESPONSE"
        else
            echo -e "${YELLOW}⚠ Unexpected response: $RESPONSE${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Server not responding (might need MongoDB)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Dependencies not installed. Skip local test.${NC}"
    echo -e "${YELLOW}   Run: npm install${NC}"
fi

echo -e "\n${YELLOW}[6] Quick Fix Summary${NC}"
echo -e "${YELLOW}If login still fails on Vercel:${NC}"
echo -e """
1. Add environment variables to Vercel dashboard:
   MONGODB_URI, JWT_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

2. Whitelist Vercel IPs on MongoDB Atlas:
   Network Access → Allow Access From Anywhere (0.0.0.0/0)

3. Check Vercel logs:
   vercel logs your-project-name --follow

4. Check MongoDB connection string format:
   mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority

5. Verify special characters in MongoDB password are URL-encoded
"""

echo -e "\n${GREEN}Debug script complete!${NC}"
