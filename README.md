# bookshelf

TODOS:
- [ ] Refactor it into "features" folders instead of components, views, etc?
      e.g. `src/features/read/components`, `src/features/read/stores`, etc.
- [x] Possibility to choose different fonts
- [ ] Possibility to choose different themes
- [ ] Possibility to choose different colors
- [ ] Possibility to choose a Cover image
- [ ] Possibility to choose a background color or texture for pages
- [ ] Possibility to add images in between text paragraphs ???
- [ ] Style in general of the app
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

Application is deploy using GitHub Pages.
A husky pre-push hook ensures that the built application is generated
and copied to the `gh-pages` folder before pushing to the main branch.
