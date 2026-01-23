# Starland Water Company Management System

A comprehensive, fully integrated management system for water companies built with HTML, CSS, JavaScript, and Supabase for backend services. All system components are now seamlessly connected with centralized authentication, real-time data synchronization, and complete audit trails.

## Features

### Authentication
- Fully integrated authentication system across all modules
- Role-based access control (Admin, Management, Entry)
- Session management with Supabase Auth
- Cross-module authentication state sharing

### Data Entry
- Sales tracking with manual receipt number entry
- Expense management with user attribution
- Diesel purchase records with creator tracking
- Repair logs with complete audit trails
- Damage reports with user identification
- Real-time synchronization between data entry and management views

### Management Interface
- Real-time dashboard with KPIs
- Data management for all transaction types
- User attribution showing who entered what data
- Responsive design for desktop and mobile

### Administration
- Complete audit trail showing all system activities
- User management with role assignment
- Activity monitoring and reporting
- System oversight capabilities

### Reporting
- Comprehensive reporting system
- CSV export functionality
- Multiple report types available
- Real-time data access across all modules

### System Integration
- Centralized configuration and event management
- Real-time data synchronization
- Cross-module communication layer
- Unified navigation system
- Shared state management

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL database, Authentication, APIs)
- **CDN**: Supabase JavaScript client library

## Architecture

```
Frontend Components:
├── index.html (Main login page)
├── entry/
│   ├── sales.html
│   ├── expenses.html
│   ├── diesel.html
│   ├── repairs.html
│   └── damages.html
├── management/
│   ├── dashboard.html
│   ├── sales.html
│   ├── expenses.html
│   ├── reports.html
│   ├── diesel.html
│   ├── repairs.html
│   └── damages.html
├── css/main.css
├── js/
│   ├── supabase.js (Supabase client setup)
│   ├── auth.js (Authentication logic)
│   ├── entry.js (Data entry functionality)
│   ├── dashboard.js (Dashboard and management functionality)
│   └── guards.js (Authorization guards)
└── admin/
    ├── dashboard.html
    ├── users.html
    └── audit.html
```

## Setup

### Development Setup

1. Clone or download the repository
2. Open `index.html` in a web browser to start the application
3. For full functionality, configure your own Supabase project (see below)

### Supabase Configuration

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Update the configuration in `js/supabase.js`:
   ```javascript
   const SUPABASE_URL = 'your_supabase_project_url';
   const SUPABASE_ANON_KEY = 'your_supabase_anon_key';
   ```
4. Run the database initialization script in `db_init.sql` in your Supabase SQL editor

### Database Schema

The system requires the following tables:

- `sales_transactions` - Stores sales records
- `expense_transactions` - Stores expense records  
- `diesel_transactions` - Stores diesel purchase records
- `repair_transactions` - Stores repair records
- `damage_transactions` - Stores damage records

See `db_init.sql` for complete schema.

## Environment Configuration

### Supabase Authentication Setup

1. Go to your Supabase dashboard
2. Navigate to Authentication > Settings
3. Configure:
   - Enable Email Signups
   - Set Site URL to your domain
   - Configure redirect URLs as needed
   - Disable "Email confirmations" for development

### User Roles

The system supports three user roles:
- `admin` - Full system access
- `management` - Dashboard and reporting access
- `entry` - Data entry access only

Roles are stored in user metadata in the Supabase authentication system.

## Deployment

### Production Deployment

1. Set up a production Supabase project
2. Update API keys in production environment
3. Run database initialization script
4. Configure custom domain and SSL certificate
5. Test all functionality thoroughly

### Security Considerations

- Never commit Supabase keys to version control
- Set up Row Level Security (RLS) policies in Supabase
- Configure proper authentication providers
- Implement rate limiting
- Regular security audits

## Running the Application

The application runs in the browser. Simply open `index.html` to begin. For full functionality:

1. Ensure internet connectivity for Supabase communication
2. Have valid user credentials for your Supabase project
3. Make sure database tables exist (run initialization script if needed)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact the development team with specific error messages and reproduction steps.

---

*Built with ❤️ for Starland Water Company*