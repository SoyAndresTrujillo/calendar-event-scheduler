# Google Cloud Project & OAuth Setup Guide

Complete step-by-step guide to set up Google OAuth 2.0 for the Calendar Event Scheduler application.

## Prerequisites

- Google account with access to Google Cloud Console
- Basic understanding of OAuth 2.0 flow

## Step 1: Create a Google Cloud Project

### 1.1 Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### 1.2 Create New Project
1. Click the **project selector** dropdown at the top of the page
2. Click **"New Project"**
3. Enter project details:
   - **Project name**: `calendar-event-scheduler` (or your preferred name)
   - **Organization**: Select your organization (if applicable)
   - **Location**: Select your organization or "No organization"
4. Click **"Create"**
5. Wait for the project to be created (usually takes 30-60 seconds)

### 1.3 Select Your Project
1. Once created, make sure your new project is selected in the project selector
2. You should see the project name in the top navigation bar

## Step 2: Enable Required APIs

### 2.1 Enable Google+ API (for user profile access)
1. In the Google Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on **"Google+ API"**
4. Click **"Enable"**

### 2.2 Enable Google Identity API (recommended)
1. In the API Library, search for **"Google Identity"**
2. Click on **"Identity Toolkit API"**
3. Click **"Enable"**

## Step 3: Configure OAuth Consent Screen

### 3.1 Access OAuth Consent Screen
1. Go to **"APIs & Services" > "OAuth consent screen"**
2. Choose your user type:
   - **External**: For applications used by users outside your Google Workspace organization
   - **Internal**: For applications used only within your Google Workspace organization

### 3.2 Configure App Information
Fill out the required fields:

**App Information:**
- **App name**: `Calendar Event Scheduler`
- **User support email**: Your email address
- **App logo**: (Optional) Upload your app logo

**App Domain:**
- **Application home page**: `http://localhost:3000` (for development)
- **Application privacy policy link**: (Optional) Your privacy policy URL
- **Application terms of service link**: (Optional) Your terms of service URL

**Developer Contact Information:**
- **Email addresses**: Your email address

### 3.3 Scopes Configuration
1. Click **"Add or Remove Scopes"**
2. Add the following scopes:
   - `email` - See your email address
   - `profile` - See your personal info
   - `openid` - Associate you with your personal info on Google

3. Click **"Update"** and then **"Save and Continue"**

### 3.4 Test Users (for External apps)
If you selected "External" user type:
1. Add test users who can access your app during development
2. Add your own email address and any other developers' emails
3. Click **"Save and Continue"**

### 3.5 Summary
Review your configuration and click **"Back to Dashboard"**

## Step 4: Create OAuth 2.0 Credentials

### 4.1 Create Credentials
1. Go to **"APIs & Services" > "Credentials"**
2. Click **"+ Create Credentials"**
3. Select **"OAuth client ID"**

### 4.2 Configure OAuth Client
1. **Application type**: Select **"Web application"**
2. **Name**: `Calendar Event Scheduler Web Client`

### 4.3 Set Authorized Origins
Add the following to **"Authorized JavaScript origins"**:
```
http://localhost:3000
```
*For production, add your production domain like `https://yourdomain.com`*

### 4.4 Set Authorized Redirect URIs
Add the following to **"Authorized redirect URIs"**:
```
http://localhost:8000/api/auth/google/callback
```
*For production, add your production API domain like `https://api.yourdomain.com/api/auth/google/callback`*

### 4.5 Create and Download Credentials
1. Click **"Create"**
2. A popup will show your **Client ID** and **Client Secret**
3. **Copy these values** - you'll need them for your backend configuration
4. You can also download the JSON file for backup

## Step 5: Configure Your Application

### 5.1 Backend Configuration
1. Navigate to your `backend` directory
2. Copy the environment example file:
   ```bash
   cp env.example .env
   ```

3. Edit the `.env` file and add your Google OAuth credentials:
   ```env
   # Google OAuth 2.0 Settings
   GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret-here"
   GOOGLE_REDIRECT_URI="http://localhost:8000/api/auth/google/callback"
   ```

4. Set a strong secret key:
   ```bash
   # Generate a random secret key
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Add this to your `.env` file:
   ```env
   SECRET_KEY="your-generated-secret-key-here"
   ```

### 5.2 Frontend Configuration
The frontend will communicate with your backend API, so no direct Google credentials are needed in the frontend code.

## Step 6: Test Your Setup

### 6.1 Start Your Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 6.2 Start Your Frontend
```bash
cd frontend
npm install
npm run dev
```

### 6.3 Test OAuth Flow
1. Open http://localhost:3000 in your browser
2. Click the **"Sign In"** button
3. You should be redirected to Google's authentication page
4. After signing in, you should be redirected back to your application

## Production Deployment

### Update OAuth Configuration
When deploying to production:

1. **Update OAuth consent screen** with production domains
2. **Add production origins** to authorized JavaScript origins:
   ```
   https://yourdomain.com
   ```
3. **Add production redirect URI**:
   ```
   https://api.yourdomain.com/api/auth/google/callback
   ```
4. **Update environment variables** with production values
5. **Enable HTTPS** and set `COOKIE_SECURE=true`

### Security Considerations
- ✅ Always use HTTPS in production
- ✅ Restrict CORS origins to your domains only
- ✅ Use strong, unique secret keys
- ✅ Enable secure cookies in production
- ✅ Monitor authentication logs
- ✅ Implement rate limiting

## Troubleshooting

### Common Issues

**"redirect_uri_mismatch" error:**
- Verify the redirect URI in your Google Cloud Console matches exactly what your backend is using
- Check for trailing slashes or protocol mismatches (http vs https)

**"invalid_client" error:**
- Verify your Client ID and Client Secret are correctly configured
- Ensure there are no extra spaces or characters in your environment variables

**CORS errors:**
- Verify your frontend URL is listed in authorized JavaScript origins
- Check that your backend CORS configuration allows your frontend domain

**Cookie not being set:**
- Ensure `credentials: 'include'` is set in your frontend fetch requests
- Verify cookie settings match your environment (secure flag for HTTPS)

### Getting Help

1. **Google Cloud Console Logs**: Check the "Logs" section for detailed error messages
2. **Backend Logs**: Check your FastAPI server logs for detailed error information
3. **Browser DevTools**: Check the Network and Console tabs for client-side errors

## Security Best Practices

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive configuration
3. **Implement proper error handling** to avoid information leakage
4. **Regularly rotate secrets** in production
5. **Monitor authentication attempts** for suspicious activity
6. **Use HTTPS everywhere** in production
7. **Implement rate limiting** on authentication endpoints

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [FastAPI Security Documentation](https://fastapi.tiangolo.com/tutorial/security/)
- [OAuth 2.1 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)

---

✅ **Setup Complete!** Your Google OAuth integration is now ready for secure authentication.

