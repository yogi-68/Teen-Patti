# MongoDB Atlas Connection Issue - Solution

## Problem
You're experiencing SSL/TLS errors when connecting to MongoDB Atlas from Node.js v22.17.1:
```
ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR
```

This is a known incompatibility between Node.js v22 (which uses OpenSSL 3.x) and MongoDB Atlas.

## Recommended Solution: Downgrade Node.js

### Option 1: Use Node.js LTS v20 (Recommended)
1. Download and install Node.js v20.x LTS from: https://nodejs.org/
2. Verify installation: `node --version` (should show v20.x.x)
3. Navigate to your project: `cd C:\Users\yoges\OneDrive\Desktop\teenpatti.angular\code`
4. Reinstall dependencies: `npm install`
5. Run the app: `node app.js`

### Option 2: Use Node.js v18 LTS
1. Download and install Node.js v18.x LTS from: https://nodejs.org/
2. Follow steps 2-5 from Option 1

### Option 3: Use NVM (Node Version Manager) for Windows
1. Install nvm-windows from: https://github.com/coreybutler/nvm-windows
2. Install Node v20: `nvm install 20`
3. Use Node v20: `nvm use 20`
4. Navigate to project and reinstall: `cd code && npm install`
5. Run: `node app.js`

## What Has Been Updated

The following files have been modified to work with MongoDB Atlas:

1. **`code/lib/dal.js`** - Updated to use MongoDB native driver with proper connection handling
2. **`code/bin/www`** - Modified to wait for database connection before starting server
3. **`code/routes/user.js`** - Updated database queries to use MongoDB native driver API
4. **`code/lib/tabledecks.js`** - Updated database update queries

## MongoDB Connection String
Your connection string has been set to:
```
mongodb+srv://yogi:1234@cluster0.3rtayk3.mongodb.net/teenpatti?retryWrites=true&w=majority
```

**Database name:** `teenpatti`

## After Switching Node.js Version

Once you've switched to Node.js v18 or v20:

1. Run the application:
   ```powershell
   cd C:\Users\yoges\OneDrive\Desktop\teenpatti.angular\code
   node app.js
   ```

2. You should see:
   ```
   Connected to MongoDB Atlas
   Express server listening on port 3000
   ```

3. Test user registration at: `http://localhost:3000`

## Security Note
- Your MongoDB credentials are currently hardcoded
- Consider moving them to environment variables for production:
  ```javascript
  const dbUrl = process.env.MONGODB_URI || "mongodb+srv://...";
  ```

## Troubleshooting
If you still face issues after switching Node versions:
1. Clear node_modules: `rm -r node_modules`
2. Clear package-lock.json: `rm package-lock.json`
3. Reinstall: `npm install`
4. Run: `node app.js`
