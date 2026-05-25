# Frontend Deployment Checklist

Your frontend is now deployment-ready! Here's what was configured:

## ✅ Files Created/Updated

### Frontend
- ✅ **Dockerfile** - Multi-stage build for optimal size and performance
- ✅ **.env.production** - Points to deployed backend URL (https://hospital-backend-uu07.onrender.com)
- ✅ **.env.development** - Points to local backend (http://localhost:8080)
- ✅ **.gitignore** - Excludes node_modules and build artifacts

### Root
- ✅ **render.yaml** - Updated with frontend service configuration

### Backend
- ✅ **.env** - Updated FRONTEND_URL to https://hospital-frontend.onrender.com
- ✅ **CorsConfig.java** - Now properly restricts CORS to frontend URL only

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure frontend for deployment"
git push origin main
```

### Step 2: Deploy on Render
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. The frontend service should auto-deploy based on render.yaml configuration
3. Once deployed, note your frontend URL (e.g., https://hospital-frontend-xxxxx.onrender.com)

### Step 3: Update Environment Variables on Render
After deployment, update these Render environment variables:

**Backend Service:**
- `FRONTEND_URL` → Your actual frontend URL (from step 2)
- `MONGO_URI` → Your MongoDB Atlas connection string
- `JWT_SECRET` → Your JWT secret key

**Frontend Service:**
- `VITE_API_URL` → https://hospital-backend-uu07.onrender.com (already configured)

### Step 4: Redeploy Backend (to apply new FRONTEND_URL)
1. Go to your hospital-backend service on Render
2. Click "Manual Deploy" → "Deploy latest commit"

## 🔍 Verification

Once deployed:
1. Visit your frontend URL
2. Try logging in - should redirect to login page
3. Submit credentials - should make API calls to backend
4. Check browser DevTools → Network tab to verify API calls are going to:
   - `https://hospital-backend-uu07.onrender.com/api/...`

## ⚠️ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| 404 on frontend routes | Dockerfile uses `serve -s dist` which handles SPA routing |
| CORS errors | Make sure FRONTEND_URL is set correctly on backend |
| API calls fail | Check `VITE_API_URL` matches your backend URL |
| Blank page loads | Check browser console for errors, run `npm run build` locally to test |

## 📝 Local Testing Before Deployment

```bash
# Build frontend
cd frontend
npm install
npm run build

# Preview production build
npm run preview

# Should open at http://localhost:4173
```

## 🔐 Security Notes

- JWT_SECRET is already in backend's .env (keep this private!)
- MongoDB credentials are in MONGO_URI environment variable
- CORS now only allows requests from your frontend URL (production security)
- Frontend doesn't store sensitive data in localStorage except JWT token
