# Pardia Deployment Instructions

Complete guide to deploy the Pardia website from GitHub to DigitalOcean using Docker.

## Prerequisites

- A DigitalOcean account (https://cloud.digitalocean.com)
- The `doctl` CLI installed locally (optional, for debugging)
- The GitHub repository: https://github.com/parlo12/Pardia.git

---

## Step 1: Create a DigitalOcean Container Registry (DOCR)

1. Go to **DigitalOcean Dashboard** > **Container Registry**
2. Click **Create Registry**
3. Choose a name (e.g., `pardia-registry`)
4. Select **Starter** plan (free, 500 MB — sufficient to start)
5. Choose the region closest to your users
6. Click **Create Registry**
7. Note down the registry name (e.g., `pardia-registry`) — you'll need it for GitHub secrets

---

## Step 2: Create a DigitalOcean Managed MySQL Database

1. Go to **Databases** > **Create Database Cluster**
2. Choose **MySQL 8**
3. Select plan: **Basic** ($15/mo for 1 GB RAM, 10 GB disk) is sufficient to start
4. Choose the same region as your container registry
5. Name it: `pardia-db`
6. Click **Create Database Cluster**
7. Once created, go to the **Connection Details** tab and note:
   - **Host** (e.g., `pardia-db-do-user-xxxxx-0.db.ondigitalocean.com`)
   - **Port** (`25060`)
   - **Username** (`doadmin`)
   - **Password** (shown once, save it)
   - **Database** — create one called `pardia` via the **Users & Databases** tab
   - **SSL Mode** — download the CA certificate if required

---

## Step 3: Create a DigitalOcean App Platform App

1. Go to **Apps** > **Create App**
2. Choose **DigitalOcean Container Registry** as the source
3. Select your registry and the `pardia-web` image
4. Configure the app:

### Resource Settings
   - **Instance Size**: Basic ($5/mo) or Professional ($12/mo)
   - **Instance Count**: 1 (scale up later)
   - **HTTP Port**: `8080`

### Environment Variables
   Set these in the App Platform **Settings** > **App-Level Environment Variables**:

   ```
   APP_NAME=Pardia
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://your-domain.com
   APP_KEY=base64:GENERATE_THIS_WITH_php_artisan_key_generate

   DB_CONNECTION=mysql
   DB_HOST=your-db-host-from-step-2
   DB_PORT=25060
   DB_DATABASE=pardia
   DB_USERNAME=doadmin
   DB_PASSWORD=your-db-password-from-step-2
   MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt

   SESSION_DRIVER=database
   CACHE_STORE=database
   QUEUE_CONNECTION=database

   STRIPE_KEY=pk_live_your_live_stripe_key
   STRIPE_SECRET=sk_live_your_live_stripe_secret
   VITE_STRIPE_KEY=${STRIPE_KEY}

   MAIL_MAILER=smtp
   MAIL_HOST=smtp.your-email-provider.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email
   MAIL_PASSWORD=your-email-password
   MAIL_FROM_ADDRESS=hello@pardia.com
   MAIL_FROM_NAME=Pardia
   ```

   **To generate APP_KEY locally:**
   ```bash
   php artisan key:generate --show
   ```
   Copy the output (e.g., `base64:xxxxxxx...`) and paste it as the `APP_KEY` value.

### Health Check
   - Set the health check path to `/up`

5. Click **Create Resources**

---

## Step 4: Configure GitHub Secrets

Go to your GitHub repository **Settings** > **Secrets and variables** > **Actions** and add these **Repository Secrets**:

| Secret Name                  | Value                                           |
|-----------------------------|------------------------------------------------|
| `DIGITALOCEAN_ACCESS_TOKEN` | Your DigitalOcean API token (create at API > Tokens) |
| `DOCR_REGISTRY`             | Your registry name (e.g., `pardia-registry`)   |
| `DIGITALOCEAN_APP_ID`       | Your App Platform app ID (find in app URL or via `doctl apps list`) |

### How to create a DigitalOcean API Token:
1. Go to **API** > **Tokens** > **Generate New Token**
2. Name it: `github-deploy`
3. Give it **Read + Write** scope
4. Copy the token immediately (it's only shown once)

### How to find your App ID:
- In the App Platform dashboard URL: `https://cloud.digitalocean.com/apps/YOUR-APP-ID`
- Or run: `doctl apps list` and copy the ID column

---

## Step 5: Configure Custom Domain & SSL

1. In the App Platform dashboard, go to **Settings** > **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `pardia.com` or `shop.pardia.com`)
4. Choose **We manage your domain** or **You manage your domain**:

   **If DigitalOcean manages your domain:**
   - Point your domain's nameservers to DigitalOcean's nameservers

   **If you manage your domain (recommended):**
   - Add a CNAME record pointing to your app's default URL
   - Example: `shop.pardia.com` → `pardia-web-xxxxx.ondigitalocean.app`

5. SSL is automatically provisioned by App Platform via Let's Encrypt

---

## Step 6: Switch to Live Stripe Keys

1. Go to https://dashboard.stripe.com
2. Toggle from **Test mode** to **Live mode**
3. Go to **Developers** > **API keys**
4. Copy your **Publishable key** (`pk_live_...`) and **Secret key** (`sk_live_...`)
5. Update the `STRIPE_KEY` and `STRIPE_SECRET` environment variables in App Platform

---

## Step 7: Verify Deployment

Once the GitHub Action runs and deploys:

1. Visit your app URL (the App Platform default URL or your custom domain)
2. Verify:
   - Home page loads with products
   - User registration works
   - Device linking works
   - Product browsing and cart work
   - Checkout redirects to Stripe
   - `/up` health check returns 200
3. Check logs: App Platform dashboard > **Runtime Logs**

---

## How CI/CD Works

The pipeline is fully automated after setup:

```
Push to main → GitHub Actions triggers →
  1. Builds Docker image (multi-stage: Node + PHP)
  2. Pushes to DigitalOcean Container Registry
  3. Triggers App Platform redeployment
  4. App Platform pulls new image and deploys
```

Every push to `main` automatically deploys to production.

---

## Local Testing with Docker

To test the Docker setup locally before deploying:

```bash
# Copy and configure .env
cp .env.example .env
# Edit .env — set APP_KEY, DB_CONNECTION=mysql, etc.

# Build and start all services
docker compose up --build

# Visit http://localhost
```

This starts the app, MySQL, and Redis locally in containers.

---

## Running Database Seeders in Production

After first deploy, you may want to seed initial product data:

```bash
# SSH into the app container (or use App Platform console)
php artisan db:seed --class=ProductSeeder --force
php artisan db:seed --class=ReplacementPartSeeder --force
```

On App Platform, use the **Console** tab in your app dashboard to run these commands.

---

## Troubleshooting

### App won't start
- Check **Runtime Logs** in App Platform
- Verify all environment variables are set (especially `APP_KEY` and `DB_*`)
- Ensure the database is accessible from the app (same region, trusted sources configured)

### Database connection refused
- In DigitalOcean Database settings, add your App Platform app to **Trusted Sources**
- Verify `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` are correct

### Assets not loading (404 on /build/assets/)
- The Docker build may have failed at the Node stage
- Check the GitHub Actions build log for npm/TypeScript errors

### HTTPS redirect loop
- The `trustProxies(at: '*')` middleware is set in `bootstrap/app.php`
- Ensure `APP_URL` starts with `https://`

### GitHub Action fails
- Verify all 3 secrets are set: `DIGITALOCEAN_ACCESS_TOKEN`, `DOCR_REGISTRY`, `DIGITALOCEAN_APP_ID`
- Check the Actions tab for specific error messages

---

## Cost Estimate (DigitalOcean)

| Service               | Plan         | Monthly Cost |
|-----------------------|-------------|-------------|
| App Platform (1 instance) | Basic        | $5           |
| Managed MySQL         | Basic (1 GB) | $15          |
| Container Registry    | Starter      | Free         |
| **Total**             |              | **~$20/mo**  |

Scale up as needed — App Platform supports horizontal scaling and larger instance sizes.
