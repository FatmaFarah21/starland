# Starland Water Company Management System - Deployment Instructions

## Deployment to Production

### Prerequisites
- A Supabase project with your database tables created
- Domain name (optional)
- SSL certificate (optional, provided by hosting service)

### Step 1: Configure Supabase for Production

1. Create a new Supabase project at https://supabase.com
2. Execute the database schema from [db_init.sql](file:///Users/fatumafarah/Desktop/Starland/db_init.sql) in the SQL Editor
3. Note your Supabase URL and ANON KEY from Project Settings > API

### Step 2: Update Application Configuration

1. In [js/supabase.js](file:///Users/fatumafarah/Desktop/Starland/js/supabase.js), update with your production credentials:
   ```javascript
   const SUPABASE_URL = 'your_production_supabase_url';
   const SUPABASE_ANON_KEY = 'your_production_anon_key';
   ```

### Step 3: Deploy the Application

Choose one of the following hosting options:

#### Option A: Deploy to Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory and run:
   ```bash
   vercel
   ```

3. Follow the prompts to connect your GitHub repository or deploy directly

4. Add environment variables in Vercel dashboard:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

#### Option B: Deploy to Netlify

1. Create a `_redirects` file in the root directory:
   ```
   /* /index.html 200
   ```

2. Drag and drop your project folder to Netlify or connect your GitHub repository

3. Add environment variables in Netlify dashboard:
   - SUPABASE_URL
   - SUPABASE_ANON_KEY

#### Option C: Deploy to GitHub Pages

1. Enable GitHub Pages in your repository settings
2. Upload all files to the `docs` folder or `gh-pages` branch
3. Set up environment variables if needed (may require different approach)

### Step 4: Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Add your domain to the "Redirect URLs" (e.g., https://yourdomain.com)
3. Configure email templates if needed

### Step 5: Test the Deployment

1. Visit your deployed application
2. Test user registration and login
3. Verify data entry and management functions
4. Ensure all forms work correctly
5. Test user management and audit logs

### Security Considerations

1. Ensure Row Level Security (RLS) is configured in Supabase if needed
2. Regularly rotate your API keys
3. Monitor authentication logs
4. Set up proper email confirmation if using email authentication

### Custom Domain Setup

1. Purchase a domain name if you don't have one
2. Update DNS records to point to your hosting provider
3. Configure SSL certificate (usually automatic with hosting providers)

### Monitoring and Maintenance

1. Set up error monitoring
2. Regular backups of your Supabase database
3. Monitor usage and scale accordingly
4. Regular updates to dependencies