# Development Workflow

## Branch Structure

```
main          → production (www.nexova.my)
develop       → staging (staging.nexova.my)
feature/*     → your working branches
```

## Daily Workflow

### 1. Start a new feature

```bash
# Make sure you're on develop and up to date
git checkout develop
git pull origin develop

# Create a feature branch
git checkout -b feature/my-feature-name
```

### 2. Code and test locally

```bash
npm run dev
# Test your changes at http://localhost:3000
```

### 3. Push your feature branch

```bash
git add .
git commit -m "describe what you changed"
git push -u origin feature/my-feature-name
```

### 4. Merge into develop (staging)

1. Go to GitHub: https://github.com/Naim3097/Nexova-PageBuilder
2. Click **"Compare & pull request"** (or create a new PR manually)
3. Set **base** branch to `develop`, **compare** branch to `feature/my-feature-name`
4. Click **"Create pull request"** then **"Merge pull request"**
5. This auto-deploys to **staging.nexova.my**
6. Test your changes on the staging URL

### 5. Push to production

1. On GitHub, create a new PR
2. Set **base** to `main`, **compare** to `develop`
3. Click **"Create pull request"** then **"Merge pull request"**
4. This auto-deploys to **www.nexova.my** (production)

### 6. Clean up

```bash
# After merging, delete your feature branch locally
git checkout develop
git pull origin develop
git branch -d feature/my-feature-name
```

## Quick Reference

| Action                | Command                           |
| --------------------- | --------------------------------- |
| Switch to develop     | `git checkout develop`            |
| Pull latest changes   | `git pull origin develop`         |
| Create feature branch | `git checkout -b feature/name`    |
| Stage all changes     | `git add .`                       |
| Commit changes        | `git commit -m "message"`         |
| Push feature branch   | `git push -u origin feature/name` |
| Delete local branch   | `git branch -d feature/name`      |

## Rules

- **Never** push directly to `main` or `develop`
- Always create a feature branch for new work
- Always test on staging before merging to production
- Keep feature branches small and focused on one thing

## Environments

| Environment | Branch  | URL                   | Purpose                   |
| ----------- | ------- | --------------------- | ------------------------- |
| Local       | any     | http://localhost:3000 | Development               |
| Staging     | develop | staging.nexova.my     | Testing before production |
| Production  | main    | www.nexova.my         | Live for users            |
