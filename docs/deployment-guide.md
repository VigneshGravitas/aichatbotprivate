# Deploying AI Chatbot to Testing Server

This guide explains how to deploy the AI Chatbot application to the testing server and configure it with a remote PostgreSQL database.

## Database Setup on inf-sw-dbs1-css.u1.niceondemand.com

1. **Connect to PostgreSQL Server**
```bash
# Connect to the remote PostgreSQL server
psql -h inf-sw-dbs1-css.u1.niceondemand.com -U SA
# When prompted, enter password: Welcom@1234
```

2. **Create Database**
```sql
CREATE DATABASE chatbotDB;
\c chatbotDB

-- Create extension for UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

3. **Update Environment Variables**
```env
# Update .env.local with the remote database connection
POSTGRES_URL=postgresql://SA:Welcom@1234@inf-sw-dbs1-css.u1.niceondemand.com:5432/chatbotDB
```

## Application Deployment

### Prerequisites
1. Node.js 18+ installed on the testing server
2. Access to the testing server via SSH
3. Git installed on the testing server
4. PostgreSQL client tools for database migrations

### Deployment Steps

1. **Clone Repository on Testing Server**
```bash
git clone https://github.com/vercel/ai-chatbot.git
cd ai-chatbot
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Setup**
Create `.env.local` with production settings:
```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_key

# Auth Secret (generate new one for production)
AUTH_SECRET=generate_new_secret_here

# Database URL
POSTGRES_URL=postgresql://SA:Welcom@1234@inf-sw-dbs1-css.u1.niceondemand.com:5432/chatbotDB

# Add any additional environment variables needed
```

4. **Database Migration**
```bash
# Generate database schema
npm run db:generate

# Apply migrations
npm run db:migrate
npm run db:push
```

5. **Build and Start Application**
```bash
# Build the application
npm run build

# Start in production mode
npm run start
```

6. **Configure Reverse Proxy (Nginx Example)**
```nginx
server {
    listen 80;
    server_name your-test-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Considerations

1. **Database Security**
   - Use strong passwords
   - Configure PostgreSQL for remote access in pg_hba.conf
   - Enable SSL for database connections
   - Limit database user permissions

2. **Application Security**
   - Generate new AUTH_SECRET for production
   - Secure all API endpoints
   - Enable rate limiting
   - Use HTTPS only
   - Set secure cookie options

3. **Server Security**
   - Configure firewall rules
   - Keep system packages updated
   - Enable security updates
   - Use SSH key authentication

## Monitoring and Maintenance

1. **Application Monitoring**
   - Set up application logs
   - Monitor server resources
   - Track API usage
   - Set up error notifications

2. **Database Maintenance**
   - Regular backups
   - Performance monitoring
   - Index optimization
   - Regular vacuum operations

3. **Server Maintenance**
   - Regular security updates
   - Log rotation
   - Disk space monitoring
   - SSL certificate renewal

## Troubleshooting

1. **Database Connection Issues**
   - Check PostgreSQL connection string
   - Verify network connectivity
   - Check database user permissions
   - Verify pg_hba.conf configuration

2. **Application Issues**
   - Check application logs
   - Verify environment variables
   - Check Node.js version
   - Verify build output

3. **Server Issues**
   - Check server resources
   - Verify port availability
   - Check firewall rules
   - Verify domain configuration

## Backup and Recovery

1. **Database Backup**
```bash
# Create database backup
pg_dump -h inf-sw-dbs1-css.u1.niceondemand.com -U SA -d chatbotDB > backup.sql

# Restore database
psql -h inf-sw-dbs1-css.u1.niceondemand.com -U SA -d chatbotDB < backup.sql
```

2. **Application Backup**
```bash
# Backup application files
tar -czf app-backup.tar.gz /path/to/ai-chatbot

# Backup environment files
cp .env.local .env.local.backup
```

## Testing the Deployment

1. **Database Connection**
```bash
# Test database connection
npx drizzle-kit check
```

2. **Application Health**
```bash
# Check application status
curl http://your-test-domain.com/api/health

# Test authentication
curl http://your-test-domain.com/api/auth/session
```

3. **Load Testing**
```bash
# Install artillery for load testing
npm install -g artillery

# Run basic load test
artillery quick --count 10 -n 20 http://your-test-domain.com/
```

## Useful Commands

```bash
# View application logs
pm2 logs ai-chatbot

# Restart application
pm2 restart ai-chatbot

# Monitor resources
pm2 monit

# Check database status
psql -h inf-sw-dbs1-css.u1.niceondemand.com -U SA -d chatbotDB -c "SELECT version();"
