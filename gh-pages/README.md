# GitHub Pages Deployment Folder

This folder contains the built static files for the Bookshelf application that will be deployed to GitHub Pages.

## How it works

1. **Pre-push Hook**: When you push to the main branch, a Husky pre-push hook automatically:
   - Runs type checking (`npm run type-check`)
   - Runs linting (`npm run lint`)
   - Runs tests (`npm run test:unit`)
   - Builds the project (`npm run build`)
   - Copies the dist files to this `gh-pages` folder

2. **GitHub Actions**: When changes are pushed to this folder, a GitHub Actions workflow automatically deploys the contents to GitHub Pages.

## Manual Build

If you need to manually update this folder without pushing, you can run:

```bash
npm run build
rm -rf gh-pages/*
cp -r dist/* gh-pages/
```

## Files

The contents of this folder mirror the `dist` folder after a successful build and will include:
- `index.html` - Main application entry point
- `assets/` - CSS, JavaScript, and other static assets
- Other static files needed for the application

## Note

⚠️ **Do not manually edit files in this folder** - they will be overwritten by the pre-push hook.
