# 🚀 Deployment Guide - Wellness Buddy App

This guide covers multiple deployment options for your wellness buddy app. Choose the one that best fits your needs!

## 📋 Prerequisites

Before deploying, make sure you have:

1. **GitHub Repository**: Push your code to GitHub
2. **Environment Variables**: Prepare your `.env` file with:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_RECIPIENT=emergency_contact@gmail.com
   HOTLINE_NUMBER=988
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## 🚂 Option 1: Railway (Recommended)

Railway is the easiest option for full-stack apps.

### Steps:

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect GitHub** and select your repository
3. **Deploy**: Railway will auto-detect your FastAPI app
4. **Add Environment Variables**:
   - Go to your project dashboard
   - Click "Variables" tab
   - Add all variables from your `.env` file
5. **Access your app**: Railway provides a URL like `https://your-app-name.railway.app`

### Railway Configuration:
- Uses `railway.json` (already created)
- Automatic deployments on git push
- Built-in database support
- Free tier: $5 credit monthly

---

## 🎨 Option 2: Render

Great alternative with good free tier.

### Steps:

1. **Sign up** at [render.com](https://render.com)
2. **Create New Web Service**
3. **Connect GitHub** repository
4. **Configure**:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
   - Python Version: 3.11
5. **Add Environment Variables** in dashboard
6. **Deploy**

### Render Configuration:
- Uses `render.yaml` (already created)
- Free tier available
- Automatic SSL
- Custom domains supported

---

## ⚡ Option 3: Vercel (Frontend) + Railway/Render (Backend)

Best performance with separate frontend/backend deployment.

### Frontend (Vercel):

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import Project** from GitHub
3. **Configure**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Add Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

### Backend (Railway/Render):
Follow steps from Option 1 or 2 above.

### Update Frontend API Configuration:
Update `frontend/src/config/api.js`:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

---

## 🐳 Option 4: Docker Deployment

Deploy anywhere that supports Docker (DigitalOcean, AWS, Google Cloud, etc.).

### Steps:

1. **Build Docker Image**:
   ```bash
   docker build -t wellness-buddy-app .
   ```

2. **Run Locally** (test):
   ```bash
   docker run -p 8000:8000 --env-file .env wellness-buddy-app
   ```

3. **Deploy to Platform**:
   - Push to Docker Hub or container registry
   - Deploy using platform's Docker support

### Docker Configuration:
- Uses `Dockerfile` (already created)
- Uses `.dockerignore` (already created)
- Optimized for production

---

## 🔧 Option 5: Heroku

Traditional platform with good documentation.

### Steps:

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create App**: `heroku create your-app-name`
4. **Set Environment Variables**:
   ```bash
   heroku config:set EMAIL_USER=your_email@gmail.com
   heroku config:set EMAIL_PASS=your_app_password
   heroku config:set EMAIL_RECIPIENT=emergency_contact@gmail.com
   heroku config:set HOTLINE_NUMBER=988
   heroku config:set GEMINI_API_KEY=your_gemini_api_key_here
   ```
5. **Deploy**: `git push heroku main`

### Heroku Configuration:
- Uses `Procfile` (already created)
- Uses `runtime.txt` (already created)
- Paid service (no free tier)

---

## 🌊 Option 6: DigitalOcean App Platform

Good performance with reasonable pricing.

### Steps:

1. **Sign up** at [DigitalOcean](https://digitalocean.com)
2. **Create App** from GitHub
3. **Configure**:
   - Source: GitHub repository
   - Type: Web Service
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. **Add Environment Variables**
5. **Deploy**

---

## 🔒 Security Considerations

### Environment Variables:
- Never commit `.env` files to git
- Use platform's environment variable management
- Rotate API keys regularly

### Database:
- Consider using managed database services
- Backup your SQLite database regularly
- For production, consider PostgreSQL

### SSL/HTTPS:
- Most platforms provide automatic SSL
- Ensure all communications are encrypted

---

## 📊 Monitoring & Maintenance

### Health Checks:
- Most platforms support health check endpoints
- Monitor your app's uptime
- Set up alerts for downtime

### Logs:
- Check platform logs for errors
- Monitor API usage and performance
- Set up error tracking (Sentry, etc.)

### Updates:
- Keep dependencies updated
- Test updates in staging environment
- Use automated deployments

---

## 🆘 Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**:
   - Check variable names match exactly
   - Ensure no extra spaces
   - Verify platform supports your variable format

2. **Build Failures**:
   - Check Python version compatibility
   - Verify all dependencies in requirements.txt
   - Check platform's build logs

3. **Runtime Errors**:
   - Check application logs
   - Verify database connections
   - Test API endpoints

4. **CORS Issues**:
   - Update CORS settings for production domain
   - Check frontend API configuration

### Getting Help:
- Check platform documentation
- Review application logs
- Test locally with production-like environment

---

## 🎯 Recommended Deployment Strategy

For **beginners**: Use **Railway** - it's the easiest and handles everything automatically.

For **performance**: Use **Vercel + Railway** - separate frontend/backend for optimal performance.

For **enterprise**: Use **Docker** on cloud platforms like AWS, Google Cloud, or Azure.

---

## 📝 Post-Deployment Checklist

- [ ] Test all features work correctly
- [ ] Verify environment variables are set
- [ ] Check SSL certificate is active
- [ ] Test API endpoints
- [ ] Verify database functionality
- [ ] Test email functionality
- [ ] Set up monitoring/alerting
- [ ] Document your deployment process
- [ ] Create backup strategy

---

**Happy Deploying! 🌸**

Remember: Your wellness buddy app is helping people, so make sure it's reliable and secure in production!
