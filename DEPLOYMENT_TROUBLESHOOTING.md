# Deployment Troubleshooting Guide

## Issue: Site Not Working After Deployment

### Step 1: Create `.env` File

The `.env` file is missing! Create it in the project root:

```bash
# Create .env file
touch .env
```

Add your environment variables:
```env
VITE_API_KEY=your-actual-xano-api-key-here
VITE_RECAPTCHA_SITE_KEY=your-actual-recaptcha-site-key-here
```

**Important**: Replace the placeholder values with your actual keys!

### Step 2: Verify `.env` File

```bash
# Check if file exists
ls -la .env

# View contents (make sure values are set, not placeholders)
cat .env
```

### Step 3: Rebuild with Environment Variables

```bash
# Clean previous build
rm -rf dist

# Build with environment variables
npm run build

# Verify environment variables are embedded
# (This should show your actual API key, not "undefined")
grep -r "x8ki-letl-twmt" dist/ || echo "API URL not found in build"
```

### Step 4: Test Locally Before Deploying

```bash
# Preview the build locally
npm run preview

# Open http://localhost:4173
# Test the contact form and check browser console (F12) for errors
```

### Step 5: Deploy Again

```bash
# Deploy to GitHub Pages
npm run deploy
```

### Step 6: Verify Deployment

1. **Check GitHub Pages Settings**:
   - Go to your repository → Settings → Pages
   - Source should be: `gh-pages` branch
   - Custom domain (if any)

2. **Check Browser Console**:
   - Visit your deployed site
   - Press F12 → Console tab
   - Look for errors like:
     - `API_KEY is undefined`
     - `CORS errors`
     - `404 Not Found`

3. **Check Network Tab**:
   - Press F12 → Network tab
   - Submit the contact form
   - Check if API calls are being made
   - Check response status codes

## Common Issues and Solutions

### Issue 1: Environment Variables Not Working

**Symptoms**: API calls fail, console shows `undefined` for API keys

**Solution**:
1. Make sure `.env` file exists in project root (same level as `package.json`)
2. Make sure values don't have quotes: `VITE_API_KEY=actual-key` (not `VITE_API_KEY="actual-key"`)
3. Rebuild: `npm run build`
4. Redeploy: `npm run deploy`

### Issue 2: CORS Errors

**Symptoms**: Network tab shows CORS errors when calling Xano API

**Solution**:
- Make sure your Xano backend allows requests from your GitHub Pages domain
- Add your domain to Xano CORS settings: `https://yourusername.github.io`

### Issue 3: 404 Errors on Routes

**Symptoms**: Page shows 404 when navigating

**Solution**:
- Check `vite.config.js` - `base` should match your repository name
- If repo is `Portfolio`, use `base: "/Portfolio/"`
- If repo is `username.github.io`, use `base: "/"`

### Issue 4: reCAPTCHA Not Showing

**Symptoms**: reCAPTCHA widget doesn't appear

**Solution**:
1. Check if `VITE_RECAPTCHA_SITE_KEY` is set in `.env`
2. Make sure the domain is added in Google reCAPTCHA console
3. Check browser console for reCAPTCHA errors

### Issue 5: Form Submission Fails

**Symptoms**: Form shows error message on submit

**Solution**:
1. Check browser console (F12) for specific error messages
2. Check Network tab to see the API response
3. Verify Xano endpoint `/submit_form` is correct
4. Verify API key has correct permissions

## Quick Fix Checklist

- [ ] `.env` file exists in project root
- [ ] `.env` file contains actual values (not placeholders)
- [ ] Rebuilt project: `npm run build`
- [ ] Tested locally: `npm run preview`
- [ ] Deployed: `npm run deploy`
- [ ] Checked browser console for errors
- [ ] Verified GitHub Pages is set to `gh-pages` branch
- [ ] Checked Xano backend CORS settings

## Still Not Working?

1. **Check the built files**:
   ```bash
   # After building, check if variables are embedded
   cat dist/assets/index-*.js | grep -o "VITE_API_KEY" | head -1
   # Should show the actual key value, not "undefined"
   ```

2. **Check GitHub Pages deployment**:
   - Go to repository → Actions tab
   - Check if `gh-pages` branch was updated
   - Verify files are in the branch

3. **Clear browser cache**:
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or open in incognito/private window

4. **Verify API endpoints**:
   - Make sure Xano backend is accessible
   - Test endpoints directly: `https://x8ki-letl-twmt.n7.xano.io/api:WpZv-jLF/submit_form`

