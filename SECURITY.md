# Security Guide for BioWe

This document outlines the security practices and configurations implemented in the BioWe application.

## Security Features Implemented

### 1. Environment Variable Security
- All sensitive configuration (API keys, secrets) use environment variables
- `.env*` files are properly excluded in `.gitignore`
- Client-side variables use `NEXT_PUBLIC_` prefix appropriately
- Server-side only variables (private keys) are kept secure

### 2. Authentication & Authorization
- Firebase Authentication for user management
- JWT token verification for API routes
- Admin-only access controls with custom claims
- Session-based middleware for protected routes

### 3. Security Headers
The application sets the following security headers:
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME type sniffing
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `X-XSS-Protection: 1; mode=block` - Enables XSS protection

### 4. Production Logging
- Sensitive information logging is restricted to development mode only
- Error details are not exposed to clients in production
- Token information is never logged in full

### 5. Input Validation
- API routes validate authorization headers
- Firebase Admin SDK handles token verification
- Type validation with TypeScript

## Required Environment Variables

### Core Firebase Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### Server-Side Firebase Admin
```env
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=your-client-email
FIREBASE_ADMIN_PRIVATE_KEY="your-private-key"
```

### Optional Third-Party Services
```env
# Pexels API for dynamic image fetching
NEXT_PUBLIC_PEXELS_API_KEY=your-pexels-api-key

# Google AI API for Genkit functionality
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

## Security Best Practices Followed

### ✅ DO's
- Use environment variables for all sensitive data
- Keep client and server environment variables separate
- Validate all inputs and authentication tokens
- Use HTTPS in production
- Implement proper error handling without exposing internals
- Regular dependency updates and security audits

### ❌ DON'Ts
- Never commit `.env` files or secrets to version control
- Don't log sensitive information (tokens, keys, passwords)
- Don't expose internal error details to clients
- Don't use HTTP in production
- Don't trust client-side data without server-side validation

## Security Monitoring

### Regular Tasks
1. Run `npm audit` regularly to check for vulnerabilities
2. Update dependencies, especially security patches
3. Review and rotate API keys periodically
4. Monitor Firebase authentication logs
5. Review application logs for unusual activity

### Security Auditing
```bash
# Check for dependency vulnerabilities
npm audit

# Fix non-breaking security issues
npm audit fix

# Check for hardcoded secrets (should return no results)
grep -r -i "api.*key\|secret\|password" --include="*.ts" --include="*.tsx" src/
```

## Deployment Security

### Production Checklist
- [ ] Environment variables set in production environment
- [ ] `.env` files not deployed
- [ ] HTTPS enabled and enforced
- [ ] Security headers configured
- [ ] Error logging configured (without sensitive data)
- [ ] Firebase security rules configured
- [ ] CORS policies set appropriately

### Emergency Response
If you suspect a security breach:
1. Immediately rotate all API keys and secrets
2. Check application logs for unusual activity
3. Review Firebase authentication logs
4. Update all environment variables
5. Force logout all users if necessary
6. Review and update security rules

## Vulnerability Reporting

If you discover a security vulnerability, please report it responsibly:
1. Do not create a public issue
2. Contact the development team directly
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before disclosure

## Additional Resources

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Next.js Security](https://nextjs.org/docs/basic-features/security-headers)
- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)