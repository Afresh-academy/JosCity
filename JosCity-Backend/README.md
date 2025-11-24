# JosCity Backend

A TypeScript-based Express.js backend API for the JosCity social network platform. This project provides authentication, user management, admin functionality, and business account features.

## 🚀 Features

- **User Authentication**: Registration, login, password reset with activation codes
- **Account Types**: Support for both personal and business accounts
- **Admin Panel**: Dashboard, user management, post moderation, and settings
- **Email Service**: Automated email notifications for account approvals and password resets
- **Database Support**: MySQL and PostgreSQL database configurations
- **TypeScript**: Fully typed codebase for better development experience

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL or PostgreSQL database
- SMTP email service (Gmail, SendGrid, etc.)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd JosCity-Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000

# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
DB_PORT=3306

# PostgreSQL Configuration (Alternative)
DATABASE_URL=postgresql://user:password@localhost:5432/database_name

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="JosCity <noreply@joscity.com>"
```

4. Build the TypeScript project:
```bash
npm run build
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with hot-reload using `ts-node-dev`.

### Production Mode
```bash
npm run build
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## 📁 Project Structure

```
JosCity-Backend/
├── apis/
│   └── modules/
│       ├── config/
│       │   ├── database.ts          # MySQL database configuration
│       │   ├── postgres.ts           # PostgreSQL database configuration
│       │   └── emailConfig.ts        # Email service configuration
│       ├── controllers/
│       │   ├── authController.ts     # Authentication controller
│       │   └── admin/
│       │       ├── dashboardController.ts
│       │       ├── postController.ts
│       │       ├── settingsController.ts
│       │       └── userController.ts
│       ├── middleware/
│       │   └── authMiddleware.ts     # Authentication middleware
│       └── routes/
│           ├── authRoute.ts           # Authentication routes
│           └── admin/
│               ├── index.ts           # Admin routes index
│               ├── auth.ts            # Admin auth routes
│               ├── dashboard.ts       # Dashboard routes
│               ├── users.ts           # User management routes
│               ├── posts.ts           # Post management routes
│               └── settings.ts        # Settings routes
├── dist/                              # Compiled JavaScript (generated)
├── server.ts                          # Main server file
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # Project dependencies
└── README.md                          # This file
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /signup` - User registration (personal or business)
- `POST /signin` - User login with activation code
- `POST /signout` - User logout
- `POST /forget_password` - Request password reset
- `POST /forget_password_confirm` - Confirm reset code
- `POST /forget_password_reset` - Reset password with new password
- `POST /resend_activation` - Resend activation code
- `GET /admin/pending` - Get pending account approvals (Admin)
- `POST /admin/approve` - Approve user account (Admin)
- `POST /admin/reject` - Reject user account (Admin)

### Admin Routes (`/api/admin`)

#### Dashboard
- `GET /dashboard` - Get dashboard insights and statistics

#### Users
- `GET /users` - Get all users with filters
- `GET /users/:id` - Get user details
- `POST /users/:id/approve` - Approve user
- `POST /users/:id/ban` - Ban user
- `POST /users/:id/unban` - Unban user
- `POST /users/:id/verify` - Verify user
- `PUT /users/:id/group` - Update user group
- `DELETE /users/:id` - Delete user

#### Posts
- `GET /posts` - Get all posts with filters
- `GET /posts/:id` - Get post details
- `POST /posts/:id/approve` - Approve post
- `DELETE /posts/:id` - Delete post

#### Settings
- `GET /settings` - Get system settings
- `PUT /settings` - Update system settings
- `GET /settings/registration` - Get registration settings
- `PUT /settings/registration` - Update registration settings

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Account Types

### Personal Accounts
- Require NIN (National Identification Number)
- Standard user registration flow
- Manual approval required

### Business Accounts
- Require business name and type
- Optional CAC (Corporate Affairs Commission) number
- Business-specific fields and validation

## 🗄️ Database

The project supports both MySQL and PostgreSQL:

- **MySQL**: Configured via `apis/modules/config/database.ts`
- **PostgreSQL**: Configured via `apis/modules/config/postgres.ts`

Make sure your database is set up with the required tables before running the application.

## 📧 Email Service

The application uses Nodemailer for sending emails. Configure your SMTP settings in the `.env` file. The service sends:

- Account registration confirmation
- Account approval notifications with activation codes
- Password reset codes
- Account rejection notifications

## 🛠️ Development

### TypeScript Configuration

The project uses TypeScript with strict type checking. Configuration is in `tsconfig.json`.

### Building

```bash
npm run build
```

This compiles TypeScript files to JavaScript in the `dist/` directory.

### Code Structure

- **Controllers**: Handle business logic and request/response
- **Routes**: Define API endpoints and route handlers
- **Middleware**: Authentication and authorization middleware
- **Config**: Database and service configurations

## 📦 Dependencies

### Production Dependencies
- `express` - Web framework
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `mysql2` - MySQL database driver
- `pg` - PostgreSQL database driver
- `nodemailer` - Email service
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Development Dependencies
- `typescript` - TypeScript compiler
- `ts-node-dev` - TypeScript development server
- `@types/*` - TypeScript type definitions

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Activation codes with expiration
- Admin role-based access control
- Input validation on all endpoints

## 📄 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. Use `.gitignore` to exclude sensitive files.

