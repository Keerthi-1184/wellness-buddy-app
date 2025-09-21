# 🐙 GitHub Setup Guide - Wellness Buddy App

This guide will help you push your wellness buddy app to GitHub so you can deploy it!

## 📋 Prerequisites

- A GitHub account (create one at [github.com](https://github.com) if you don't have one)
- Git installed on your computer

## 🔧 Step 1: Install Git

### Option A: Download Git for Windows
1. Go to [git-scm.com/downloads](https://git-scm.com/downloads)
2. Download Git for Windows
3. Run the installer with default settings
4. **Restart your terminal/PowerShell** after installation

### Option B: Install via Package Manager
If you have Chocolatey installed:
```powershell
choco install git
```

If you have Winget installed:
```powershell
winget install --id Git.Git -e --source winget
```

## 🔑 Step 2: Configure Git (First Time Only)

After installing Git, open PowerShell/Terminal and run:

```bash
# Set your name (replace with your actual name)
git config --global user.name "Your Name"

# Set your email (use the same email as your GitHub account)
git config --global user.email "your.email@example.com"
```

## 📁 Step 3: Create GitHub Repository

1. **Go to GitHub.com** and sign in
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Fill in the details**:
   - Repository name: `wellness-buddy-app` (or your preferred name)
   - Description: `A comprehensive wellness tracking and support application`
   - Make it **Public** (so you can deploy for free)
   - **DON'T** initialize with README, .gitignore, or license (we already have these)
5. **Click "Create repository"**

## 🚀 Step 4: Push Your Code

Now let's push your code to GitHub. Run these commands in your project directory:

### Initialize Git Repository
```bash
# Navigate to your project directory
cd C:\Users\Keerthi\Desktop\wellness-buddy-app

# Initialize git repository
git init

# Add all files to staging
git add .

# Create your first commit
git commit -m "Initial commit: Wellness Buddy App with FastAPI backend and React frontend"
```

### Connect to GitHub and Push
```bash
# Add your GitHub repository as remote origin
# Replace 'YOUR_USERNAME' with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/wellness-buddy-app.git

# Push your code to GitHub
git push -u origin main
```

## 🔐 Step 5: Authentication

When you push, GitHub will ask for authentication. You have two options:

### Option A: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Wellness Buddy App"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token** (you won't see it again!)
7. When prompted for password, paste the token instead

### Option B: GitHub CLI (Alternative)
```bash
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login

# Then push normally
git push -u origin main
```

## ✅ Step 6: Verify Upload

1. **Refresh your GitHub repository page**
2. **Check that all your files are there**:
   - `app.py`
   - `requirements.txt`
   - `frontend/` folder
   - `services/` folder
   - `templates/` folder
   - All deployment files we created

## 🔄 Step 7: Future Updates

After the initial push, for future updates:

```bash
# Add changes
git add .

# Commit changes
git commit -m "Description of your changes"

# Push to GitHub
git push
```

## 🚨 Troubleshooting

### "git is not recognized"
- Make sure Git is installed
- Restart your terminal/PowerShell
- Try running `git --version` to verify installation

### "Authentication failed"
- Use Personal Access Token instead of password
- Make sure your GitHub username is correct
- Check that the repository URL is correct

### "Repository not found"
- Verify the repository name and username in the URL
- Make sure the repository exists on GitHub
- Check that you have access to the repository

### "Permission denied"
- Make sure you're using HTTPS URL (not SSH)
- Use Personal Access Token for authentication
- Check that your GitHub account has the right permissions

## 🎯 Next Steps After GitHub Setup

Once your code is on GitHub, you can:

1. **Deploy to Railway**: Connect your GitHub repo to Railway for automatic deployment
2. **Deploy to Render**: Connect your GitHub repo to Render
3. **Deploy to Vercel**: Deploy your frontend separately
4. **Share your project**: Share the GitHub link with others

## 📝 Quick Reference Commands

```bash
# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Check remote URL
git remote -v
```

## 🆘 Need Help?

If you run into issues:
1. Check the error message carefully
2. Make sure Git is properly installed
3. Verify your GitHub repository exists
4. Double-check your authentication method

---

**You're almost ready to deploy! 🌸**

Once your code is on GitHub, you can use any of the deployment platforms we set up earlier.
