# Calendar Event Scheduler - Backend API

FastAPI backend implementing OAuth 2.1 security best practices with Google authentication.

## Features

- 🔐 **Secure OAuth 2.1** with Google integration
- 🍪 **Hybrid token storage** (access tokens in memory, refresh tokens in httpOnly cookies)
- 🔄 **Token rotation** for enhanced security
- 🛡️ **PKCE implementation** for authorization code flow
- 🚫 **CSRF protection** with state parameters
- 📝 **Comprehensive security headers**
- ⚡ **FastAPI** with async/await support

## Security Architecture

Following the industry-recommended hybrid storage pattern:
- **Access tokens**: 15-minute lifetime, stored in memory on frontend
- **Refresh tokens**: 7-day lifetime, encrypted and stored in httpOnly cookies
- **PKCE**: S256 code challenge method for OAuth flow
- **Token rotation**: Each refresh invalidates the previous refresh token

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your Google OAuth credentials (see Google Cloud Setup section).

### 3. Run the Server

```bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Or using Python directly
python -m app.main
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive docs**: http://localhost:8000/api/docs
- **Health check**: http://localhost:8000/health

## Google Cloud OAuth Setup

See the [Google Cloud Setup Guide](../docs/google-cloud-setup.md) for detailed instructions on:
1. Creating a Google Cloud Project
2. Configuring OAuth consent screen
3. Creating OAuth 2.0 credentials
4. Setting up redirect URIs

## API Endpoints

### Authentication

- `POST /api/auth/google/authorize` - Initiate OAuth flow
- `POST /api/auth/google/callback` - Handle OAuth callback
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout and clear tokens

### Health

- `GET /health` - Health check endpoint
- `GET /` - API information

## Development

### Code Structure

```
backend/
├── app/
│   ├── api/routes/          # API route handlers
│   ├── core/                # Core configuration and security
│   ├── schemas/             # Pydantic models for validation
│   ├── services/            # Business logic services
│   └── main.py             # FastAPI application
├── tests/                   # Test suite
└── requirements.txt         # Python dependencies
```

### Security Features

1. **CORS**: Restrictive CORS policy for frontend-only access
2. **Headers**: Comprehensive security headers (CSP, HSTS, etc.)
3. **Validation**: Pydantic schemas for request/response validation
4. **Encryption**: Refresh tokens encrypted before cookie storage
5. **Rate limiting**: Planned for production deployment

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## Production Deployment

### Environment Variables

Ensure these are set in production:

- `SECRET_KEY`: Strong secret key for JWT signing
- `COOKIE_SECURE=true`: Enable secure cookies
- `DEBUG=false`: Disable debug mode
- `ALLOWED_ORIGINS`: Restrict to production domains

### Security Checklist

- [ ] HTTPS enforced
- [ ] Strong `SECRET_KEY` configured
- [ ] `COOKIE_SECURE=true` set
- [ ] `DEBUG=false` in production
- [ ] CORS origins restricted to production domains
- [ ] Rate limiting implemented
- [ ] Monitoring and logging configured

## License

MIT License - see LICENSE file for details.

