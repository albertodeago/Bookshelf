# bookshelf

Bookshelf is a web application for reading and sharing short books.
It allows users to create, read, and share books through a simple interface.

The book is stored in the browser URL, making it easy to share via links and keeping
the application free forever and for everyone.

## Limitations

### URL Length Constraints for Book Sharing

Bookshelf uses URL-based sharing, which has inherent length limitations that affect what content can be reliably shared.

#### Browser & Server Limits
- **Chrome**: ~8,192 characters (but recommends staying under 2,000 for compatibility)
- **Firefox**: ~65,536 characters
- **Safari**: ~80,000 characters
- **Apache/Nginx**: 4,096-8,192 characters (server-configurable)

#### Safe Practical Limit
**8,000 characters** - This ensures compatibility across all browsers and most server configurations.

#### Content Size Impact
Our encoding process (JSON → Base64 → URL encoding) results in a **1.5-4x size increase** from the original content:

| Content Type     | Original Size | Final URL Length | Sharing Status |
|------------------|---------------|------------------|----------------|
| Short story/poem | ~500 chars    | ~950 chars       | ✅ Safe for all browsers |
| Medium article   | ~2,000 chars  | ~3,250 chars     | ⚠️ May fail in some browsers |
| Long chapter     | ~10,000 chars | ~15,050 chars    | ❌ Will fail in most cases |
| Full book        | 50,000+ chars | 75,000+ chars    | ❌ Will definitely fail |


## Roadmap

TODOS:
- [x] Fix: the share on deployed env doesn't work because it's not considering the base path (`/Bookshelf/`, probably only reads the hostname)
- [ ] Fix: next page in mobile scrolls up, terrible
- [ ] See if we can shorten the URL for sharing books to mitigate the limitations of URL length
- [ ] Refactor it into "features" folders instead of components, views, etc?
      e.g. `src/features/read/components`, `src/features/read/stores`, etc.
- [x] Possibility to choose different fonts
- [x] Possibility to choose different themes
- [ ] Possibility to choose a Cover image
- [ ] Better homepage (explaining the app and using the icon)
- [ ] Possibility to add images in between text paragraphs ???
- [ ] Style in general of the app - feels cheap
- [ ] Error cases - show error messages when something goes wrong
- [ ] Add a link to create another book from the read view

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Deployment

Application is deployed using GitHub Pages.
A husky pre-push hook ensures that the built application is generated
and copied to the `docs` folder before pushing to the main branch.
