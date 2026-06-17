## GitHub + Render Deployment

### 1. Push to GitHub

Repository remote:

```text
https://github.com/yagneshreddy18/CineVerse.git
```

Push the latest code to `master` or `main`.

### 2. Create Render Static Site

Use the root `render.yaml` Blueprint, or create a Static Site manually with:

```text
Build Command: cd Frontend && npm ci && npm run build
Publish Directory: Frontend/dist
```

The `render.yaml` file includes an SPA rewrite so `/login`, `/dashboard`,
`/movies`, `/booking`, and `/manage` work after refresh.

### 3. Add GitHub Secret For CI/CD Deploy

In GitHub:

```text
Settings -> Secrets and variables -> Actions -> New repository secret
```

Create:

```text
RENDER_DEPLOY_HOOK_URL=<your Render deploy hook URL>
```

Render documents deploy hooks as secret URLs that can be triggered from CI with
a simple HTTP request. The workflow in `.github/workflows/ci.yml` runs tests,
builds the app, verifies the backend contract, and then triggers the deploy
hook when the push is on `master` or `main`.

### 4. Live Link

After Render finishes the first deploy, use the generated URL:

```text
https://cineverse.onrender.com
```

If Render assigns a different subdomain, use that generated live URL instead.
