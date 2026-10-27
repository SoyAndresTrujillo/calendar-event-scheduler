# Calendar Event Scheduler

A modern full-stack application for creating shareable calendar event links with secure Google OAuth authentication.

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- 📅 **Calendar Event Creation** - Generate Google Calendar and Outlook event links
- 🎨 **Modern UI** - Clean interface with Ant Design components
- 🌊 **Ocean Minimalist Theme** - Beautiful, accessible color palette
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚛️ **React 18** with TypeScript for type safety

### Backend (FastAPI + Python)
- 🔐 **OAuth 2.1 Security** - Industry-standard Google authentication
- 🍪 **Hybrid Token Storage** - Secure token management with httpOnly cookies
- 🔄 **Token Rotation** - Enhanced security with automatic token refresh
- 🛡️ **PKCE Implementation** - Authorization code flow with PKCE
- 🚫 **CSRF Protection** - State parameters and request validation
- 📝 **Security Headers** - Comprehensive protection headers

## 🏗️ Project Structure

```
calendar-event-scheduler/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # SCSS modules and global styles
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/routes/      # API endpoints
│   │   ├── core/            # Configuration and security
│   │   ├── schemas/         # Pydantic models
│   │   ├── services/        # Business logic
│   │   └── main.py          # FastAPI app entry point
│   ├── tests/               # Backend tests
│   └── requirements.txt     # Python dependencies
├── GOOGLE_CLOUD_SETUP.md    # OAuth setup guide
└── start-dev.sh             # Development startup script
```

## 🛠️ Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+ and pip
- **Google Cloud Account** for OAuth setup

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd calendar-event-scheduler
```

### 2. Google Cloud OAuth Setup

**⚠️ Important:** Before running the application, you need to set up Google OAuth credentials.

Follow the detailed guide: [**GOOGLE_CLOUD_SETUP.md**](./GOOGLE_CLOUD_SETUP.md)

This guide will walk you through:
- Creating a Google Cloud Project
- Configuring OAuth consent screen
- Creating OAuth 2.0 credentials
- Setting up redirect URIs

### 3. Backend Configuration

```bash
cd backend
cp env.example .env
```

Edit `.env` with your Google OAuth credentials:
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
SECRET_KEY="your-strong-secret-key"
```

### 4. Start Development Servers

**Option A: Automatic startup (recommended)**
```bash
./start-dev.sh
```

**Option B: Manual startup**
```bash
# Terminal 1 - Backend
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs

## 🔒 Security Features

Our implementation follows OAuth 2.1 security best practices:

### Token Management
- **Access tokens**: 15-minute lifetime, stored in memory
- **Refresh tokens**: 7-day lifetime, encrypted httpOnly cookies
- **Token rotation**: Each refresh invalidates previous token
- **PKCE flow**: S256 code challenge method

### Security Headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options, X-Content-Type-Options
- Referrer Policy and XSS Protection

### CORS Protection
- Restrictive CORS policy
- Credential support for httpOnly cookies
- Origin validation

## 🧪 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
uvicorn app.main:app --reload  # Start with auto-reload
python -m pytest              # Run tests
black app/                     # Format code
flake8 app/                    # Lint code
```

### Testing OAuth Flow

1. Start both servers using `./start-dev.sh`
2. Open http://localhost:3000
3. Click the "Sign In" button
4. Complete Google OAuth flow
5. Verify token management in browser DevTools

## 📚 Documentation

- [Google Cloud Setup Guide](./GOOGLE_CLOUD_SETUP.md) - Complete OAuth setup
- [Backend README](./backend/README.md) - API documentation
- [Security Guide](./docs/security.md) - Security implementation details

## 🚀 Production Deployment

### Environment Configuration

**Backend Production Settings:**
```env
DEBUG=false
COOKIE_SECURE=true
ALLOWED_ORIGINS=["https://yourdomain.com"]
```

**Security Checklist:**
- [ ] HTTPS enforced everywhere
- [ ] Strong `SECRET_KEY` configured
- [ ] `COOKIE_SECURE=true` enabled
- [ ] CORS origins restricted to production domains
- [ ] Google OAuth redirect URIs updated
- [ ] Rate limiting implemented
- [ ] Monitoring and logging configured

### Deployment Options

- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Railway, Render, Google Cloud Run, or any container platform
- **Database**: PostgreSQL (for user sessions in production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Google Cloud Setup Guide](./GOOGLE_CLOUD_SETUP.md)
2. Review the troubleshooting sections in documentation
3. Open an issue with detailed error messages and steps to reproduce

---

**Built with ❤️ using React, TypeScript, FastAPI, and modern security practices.**