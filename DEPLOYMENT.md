# Deployment Guide

This document provides instructions for deploying Intelli-Code Secure to various platforms.

## Table of Contents
- [Local Development](#local-development)
- [GitHub Pages](#github-pages)
- [AWS S3 + CloudFront](#aws-s3--cloudfront)
- [Netlify](#netlify)
- [Vercel](#vercel)

## Local Development

### Prerequisites
- Python 3.x OR Node.js 14+
- Modern web browser

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/intelli-code-secure.git
cd intelli-code-secure

# Method 1: Using Python
python -m http.server 8000

# Method 2: Using Node.js
npx serve .

# Method 3: Using npm (after running npm install)
npm start
```

Visit `http://localhost:8000` in your browser.

## GitHub Pages

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select source branch (usually `main` or `gh-pages`)
   - Select root folder

2. **Automatic Deployment**
   ```bash
   # Push to main branch
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Access Your Site**
   - URL: `https://yourusername.github.io/intelli-code-secure`

## AWS S3 + CloudFront

### Prerequisites
- AWS CLI configured
- S3 bucket created
- CloudFront distribution (optional, for CDN)

### Deployment Steps

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-intelli-code-secure-bucket
   ```

2. **Configure Bucket for Web Hosting**
   ```bash
   aws s3 website s3://your-bucket-name \
     --index-document index.html \
     --error-document index.html
   ```

3. **Upload Files**
   ```bash
   aws s3 sync . s3://your-bucket-name --delete \
     --exclude "*.git/*" \
     --exclude "node_modules/*" \
     --exclude "README.md"
   ```

4. **Set Public Read Permissions**
   ```bash
   aws s3api put-bucket-policy \
     --bucket your-bucket-name \
     --policy '{
       "Version": "2012-10-17",
       "Statement": [
         {
           "Sid": "PublicReadGetObject",
           "Effect": "Allow",
           "Principal": "*",
           "Action": "s3:GetObject",
           "Resource": "arn:aws:s3:::your-bucket-name/*"
         }
       ]
     }'
   ```

5. **Access Your Site**
   - URL: `http://your-bucket-name.s3-website-region.amazonaws.com`

### CloudFront Setup (Optional)
```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## Netlify

### Method 1: Drag and Drop
1. Visit [Netlify](https://netlify.com)
2. Drag your project folder to the deployment area
3. Site will be automatically deployed

### Method 2: Git Integration
1. Connect your GitHub repository
2. Configure build settings:
   - Build command: (leave empty for static site)
   - Publish directory: `/` (root)
3. Deploy automatically on git push

### Custom Domain (Optional)
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Configure DNS records

## Vercel

### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow prompts for configuration
```

### Method 2: Git Integration
1. Visit [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure project settings:
   - Framework: Other
   - Build command: (leave empty)
   - Output directory: `./`
4. Deploy

## Environment Variables

For production deployments, consider setting:

```bash
# Analytics tracking
ANALYTICS_ID=your-analytics-id

# Feature flags
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true

# API endpoints (if applicable)
API_BASE_URL=https://api.your-domain.com
```

## Performance Optimization

### Before Deployment
1. **Minify CSS and JavaScript**
   ```bash
   # Using terser for JS minification
   npx terser app.js -o app.min.js

   # Using cssnano for CSS minification
   npx cssnano style.css style.min.css
   ```

2. **Optimize Images**
   - Compress images using tools like TinyPNG
   - Use appropriate formats (WebP for modern browsers)

3. **Enable Gzip Compression**
   - Most hosting platforms enable this automatically
   - For custom servers, configure gzip compression

### CDN Configuration
- Set appropriate cache headers
- Enable compression
- Configure HTTPS redirect
- Set up custom error pages

## Security Considerations

1. **HTTPS Only**
   - Ensure all deployments use HTTPS
   - Set up HTTP to HTTPS redirects

2. **Content Security Policy**
   Add to your HTML head:
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline';">
   ```

3. **Headers Configuration**
   ```
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   Strict-Transport-Security: max-age=31536000; includeSubDomains
   ```

## Monitoring and Analytics

### Google Analytics Setup
1. Create Google Analytics property
2. Add tracking code to index.html
3. Configure goals and events

### Error Tracking
Consider integrating:
- Sentry for error monitoring
- LogRocket for user session recording
- Hotjar for user behavior analytics

## Troubleshooting

### Common Issues

1. **404 Errors on Refresh**
   - Configure server to serve index.html for all routes
   - Update .htaccess or server configuration

2. **CORS Issues**
   - Ensure proper CORS headers are set
   - Check API endpoint configurations

3. **Caching Issues**
   - Clear browser cache
   - Update cache headers
   - Use cache busting techniques

### Debug Mode
Enable debug mode by adding to URL:
```
?debug=true
```

## Backup and Rollback

### Backup Strategy
1. Regular git commits and tags
2. Database backups (if applicable)
3. Configuration backups

### Rollback Procedure
```bash
# Rollback to previous version
git checkout previous-tag
git push --force

# Or use platform-specific rollback features
```

---

For specific deployment issues, please refer to the platform documentation or create an issue in the repository.
