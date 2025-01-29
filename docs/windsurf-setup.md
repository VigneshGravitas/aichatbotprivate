# Running AI Chatbot on Windsurf Testing Server

## Quick Setup Steps

1. **Copy Project Files**
```bash
# Create a directory for the project
mkdir /path/to/windsurf/ai-chatbot

# Copy all files from your local project
xcopy C:\windsurf\ai-chatbot\* /path/to/windsurf/ai-chatbot /E /H /C /I
```

2. **Install Dependencies**
```bash
# Navigate to project directory
cd /path/to/windsurf/ai-chatbot

# Install all dependencies
npm install
```

3. **Configure Environment**
Create `.env.local` with these settings:
```env
# OpenAI API Key (use your existing key)
OPENAI_API_KEY=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

# Auth Secret (use your existing secret)
AUTH_SECRET=6353417df0559cf8a8f3c5432cd788e8

# Database URL (using internal network access)
POSTGRES_URL=postgresql://SA:Welcom@1234@inf-sw-dbs1-css.u1.niceondemand.com:5432/chatbotDB
```

4. **Create Database and Run Migrations**
```bash
# Generate the migration files
npm run db:generate

# Run the migrations
npm run db:migrate

# Push schema changes
npm run db:push
```

5. **Start Development Server**
```bash
# Start in development mode
npm run dev
```

## Verification Steps

1. **Check Database Connection**
```bash
# The application will log any database connection errors in the console
# Watch the console output when starting the server
```

2. **Verify Application**
- Open browser and navigate to `http://localhost:3000`
- Try to sign in/sign up
- Create a new chat
- Send a message to verify AI responses

## Troubleshooting

### Database Connection Issues
- Verify you can ping the database server: `ping inf-sw-dbs1-css.u1.niceondemand.com`
- Check if PostgreSQL port is accessible: `telnet inf-sw-dbs1-css.u1.niceondemand.com 5432`
- Verify database credentials are correct

### Node.js Issues
- Check Node.js version: `node --version` (should be 18+)
- Clear npm cache if needed: `npm cache clean --force`
- Delete `node_modules` and reinstall if needed:
  ```bash
  rm -rf node_modules
  rm package-lock.json
  npm install
  ```

### Build Issues
- Clear Next.js cache:
  ```bash
  rm -rf .next
  npm run build
  ```

## Important Notes

1. **Node.js Version**
   - Make sure Node.js 18+ is installed
   - You can check with: `node --version`

2. **Port Availability**
   - Default port is 3000
   - Make sure no other service is using this port
   - Check with: `netstat -ano | findstr :3000`

3. **File Permissions**
   - Ensure your user has write permissions in the project directory
   - Particularly important for:
     - `node_modules` directory
     - `.next` directory
     - `.env.local` file

4. **Memory Requirements**
   - At least 4GB RAM recommended
   - Check available memory: `free -h`

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Check database connection
npm run db:check
```
