# Pardia Deployment Instructions

Complete guide to deploy the Pardia website from GitHub to a DigitalOcean Droplet using Docker.

## What's Already Done

- Dockerfile (multi-stage: Node build + PHP-FPM/Nginx runtime)
- docker-compose.yml for local testing
- GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Nginx config, Supervisor, entrypoint script
- Trusted proxies configured for HTTPS behind load balancer
- SSH access configured: `ssh pardia` → `root@45.55.34.241` using `~/.ssh/id_ed25519_pardia`
- **CI/CD deploy SSH key created**: `~/.ssh/id_ed25519_pardia_deploy` (already added to the droplet)

## What Needs to Be Done

The following steps must be completed on DigitalOcean and GitHub to finish the CI/CD pipeline.

---

## Step 1: Install Docker on the Droplet

SSH into the droplet and install Docker:

```bash
ssh pardia
```

Then run these commands on the server:

```bash
# Update packages
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Verify Docker is installed
docker --version
docker compose version

# Enable Docker to start on boot
systemctl enable docker
```

---

## Step 2: Create the Production .env File on the Droplet

Still on the server via `ssh pardia`:

```bash
# Create app config directory
mkdir -p /root/pardia

# Create the .env file
nano /root/pardia/.env
```

Paste the following (fill in your real values):

```
APP_NAME=Pardia
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
APP_KEY=base64:GENERATE_WITH_php_artisan_key_generate_--show

DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=25060
DB_DATABASE=pardia
DB_USERNAME=doadmin
DB_PASSWORD=your-db-password
MYSQL_ATTR_SSL_CA=/etc/ssl/certs/ca-certificates.crt

SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

STRIPE_KEY=pk_live_your_live_stripe_key
STRIPE_SECRET=sk_live_your_live_stripe_secret
VITE_STRIPE_KEY=pk_live_your_live_stripe_key

MAIL_MAILER=smtp
MAIL_HOST=smtp.your-email-provider.com
MAIL_PORT=587
MAIL_USERNAME=your-email
MAIL_PASSWORD=your-email-password
MAIL_FROM_ADDRESS=hello@pardia.com
MAIL_FROM_NAME=Pardia
```

**To generate APP_KEY** (run locally where PHP is installed):
```bash
php artisan key:generate --show
```
Copy the output (e.g., `base64:xxxxxxx...`) and paste it as the `APP_KEY` value.

---

## Step 3: Create a DigitalOcean Container Registry (DOCR)

1. Go to **DigitalOcean Dashboard** → **Container Registry**
2. Click **Create Registry**
3. Choose a name (e.g., `pardia-registry`)
4. Select **Starter** plan (free, 500 MB)
5. Region: **New York** (same as the droplet)
6. Click **Create Registry**
7. Note down the registry name — you'll need it for GitHub secrets

---

## Step 4: Set Up a Database

You have two options:

### Option A: DigitalOcean Managed MySQL (Recommended)

1. Go to **Databases** → **Create Database Cluster**
2. Choose **MySQL 8**
3. Plan: **Basic** ($15/mo, 1 GB RAM, 10 GB disk)
4. Region: **New York** (same as droplet)
5. Name it: `pardia-db`
6. Click **Create Database Cluster**
7. Once created, go to **Users & Databases** tab → create a database called `pardia`
8. Go to **Connection Details** tab and note: Host, Port, Username, Password
9. Go to **Settings** → **Trusted Sources** → add the droplet IP: `45.55.34.241`
10. Update `/root/pardia/.env` on the droplet with the DB credentials

### Option B: MySQL on the Droplet (saves $15/mo but uses droplet RAM)

SSH into the droplet and run:

```bash
# Run MySQL in Docker
docker run -d \
  --name pardia-mysql \
  --restart unless-stopped \
  -e MYSQL_ROOT_PASSWORD=rootsecret \
  -e MYSQL_DATABASE=pardia \
  -e MYSQL_USER=pardia \
  -e MYSQL_PASSWORD=secret \
  -p 127.0.0.1:3306:3306 \
  -v mysql_data:/var/lib/mysql \
  mysql:8.0
```

Then update `/root/pardia/.env`:
```
DB_HOST=host.docker.internal
DB_PORT=3306
DB_DATABASE=pardia
DB_USERNAME=pardia
DB_PASSWORD=secret
```

Note: With 1GB RAM on the droplet, this will be tight. Consider upgrading to the 2GB droplet ($12/mo) if using this option.

---

## Step 5: Add Secrets to GitHub

A dedicated CI/CD SSH key has been created and already added to the droplet. You just need to add it to GitHub.

1. Go to your GitHub repository: **https://github.com/parlo12/Pardia**
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of these **4 secrets**:

| Secret Name                  | Value                                                    |
|-----------------------------|----------------------------------------------------------|
| `SSH_PRIVATE_KEY`           | Contents of `~/.ssh/id_ed25519_pardia_deploy` (see below) |
| `DROPLET_IP`               | `45.55.34.241`                                           |
| `DIGITALOCEAN_ACCESS_TOKEN` | Your DigitalOcean API token (see below)                  |
| `DOCR_REGISTRY`             | Your registry name from Step 3 (e.g., `pardia-registry`) |

### Getting the SSH private key:
The deploy key is at `~/.ssh/id_ed25519_pardia_deploy` on your local machine. Copy the entire contents:
```bash
cat ~/.ssh/id_ed25519_pardia_deploy
```
Paste the **full output** (including the `-----BEGIN` and `-----END` lines) as the `SSH_PRIVATE_KEY` secret value.

This key is separate from your personal `id_ed25519_pardia` key — it was created specifically for GitHub Actions and is already authorized on the droplet.

### How to create a DigitalOcean API Token:
1. Go to **DigitalOcean Dashboard** → **API** → **Tokens**
2. Click **Generate New Token**
3. Name it: `github-deploy`
4. Give it **Read + Write** scope
5. Copy the token immediately (it's only shown once)

---

## Step 6: Log the Droplet into DOCR (One-Time Setup)

SSH into the droplet and authenticate Docker with the container registry:

```bash
ssh pardia

# Install doctl (DigitalOcean CLI)
snap install doctl
doctl auth init
# Paste your DigitalOcean API token when prompted

# Log Docker into the registry
doctl registry login
```

---

## Step 7: Configure Domain & SSL

### Point your domain to the droplet

Add an **A record** in your DNS provider:
- **Type**: A
- **Name**: `@` (or `shop` for a subdomain)
- **Value**: `45.55.34.241`
- **TTL**: 3600

### Set up SSL with Caddy (Recommended — automatic HTTPS)

On the droplet, install Caddy as a reverse proxy for automatic SSL:

```bash
ssh pardia

# Install Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy
```

Create the Caddy config:

```bash
nano /etc/caddy/Caddyfile
```

Paste (replace `your-domain.com` with your actual domain):

```
your-domain.com {
    reverse_proxy localhost:8080
}
```

Then restart Caddy:

```bash
systemctl restart caddy
```

Caddy automatically provisions and renews Let's Encrypt SSL certificates.

**Important**: If using Caddy on port 80/443, update the Docker run command in the GitHub Actions workflow. Change `-p 80:8080` to `-p 8080:8080` so Caddy handles external traffic and proxies to the container on port 8080. The current workflow already uses port 8080 internally.

### Alternative: Use Nginx + Certbot for SSL

If you prefer Nginx over Caddy:

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## Step 8: Switch to Live Stripe Keys

1. Go to https://dashboard.stripe.com
2. Toggle from **Test mode** to **Live mode**
3. Go to **Developers** → **API keys**
4. Copy your **Publishable key** (`pk_live_...`) and **Secret key** (`sk_live_...`)
5. Update `STRIPE_KEY` and `STRIPE_SECRET` in `/root/pardia/.env` on the droplet
6. Restart the container: `docker restart pardia-app`

---

## Step 9: Test the Deployment

Push a commit to `main` to trigger the CI/CD pipeline:

```bash
git add . && git commit --allow-empty -m "Test deployment" && git push
```

Then monitor the deployment:

1. Go to **GitHub** → **Actions** tab → watch the workflow run
2. Once it completes, visit your domain (or `http://45.55.34.241`)
3. Verify:
   - Home page loads with products
   - User registration works
   - Device linking works
   - Product browsing and cart work
   - Checkout redirects to Stripe
   - `http://your-domain.com/up` returns 200

---

## How CI/CD Works

The pipeline is fully automated after setup:

```
Push to main → GitHub Actions triggers →
  1. Builds Docker image (multi-stage: Node frontend + PHP app)
  2. Pushes image to DigitalOcean Container Registry
  3. SSHs into droplet (45.55.34.241)
  4. Pulls latest image and restarts container
```

Every push to `main` automatically deploys to production.

---

## Useful Commands

### On the droplet (via `ssh pardia`):

```bash
# View running containers
docker ps

# View app logs
docker logs pardia-app -f

# Restart the app
docker restart pardia-app

# Run artisan commands inside the container
docker exec pardia-app php artisan migrate:status
docker exec pardia-app php artisan db:seed --class=ProductSeeder --force
docker exec pardia-app php artisan db:seed --class=ReplacementPartSeeder --force

# Enter the container shell
docker exec -it pardia-app sh

# View Nginx logs
docker exec pardia-app cat /var/log/nginx/error.log

# Check disk usage
df -h

# Check memory usage
free -h
```

---

## Running Database Seeders (First Deploy)

After the first deployment, seed the product data:

```bash
ssh pardia
docker exec pardia-app php artisan db:seed --class=ProductSeeder --force
docker exec pardia-app php artisan db:seed --class=ReplacementPartSeeder --force
```

---

## Troubleshooting

### Container won't start
```bash
ssh pardia
docker logs pardia-app
```
Check for missing env vars (especially `APP_KEY` and `DB_*`).

### Database connection refused
- If using Managed MySQL: ensure the droplet IP (`45.55.34.241`) is in **Trusted Sources**
- If using local MySQL: ensure the MySQL container is running (`docker ps`)
- Test connection: `docker exec pardia-app php artisan migrate:status`

### 502 Bad Gateway
- The app container may not be running: `docker ps`
- Check if port 8080 is in use: `ss -tlnp | grep 8080`

### Assets not loading (404 on /build/assets/)
- The Docker build may have failed at the Node stage
- Check GitHub Actions build log for npm/TypeScript errors

### HTTPS not working
- Ensure Caddy is running: `systemctl status caddy`
- Ensure your DNS A record points to `45.55.34.241`
- Ensure Caddyfile has the correct domain
- Caddy needs ports 80 and 443 free — stop anything else using those ports

### GitHub Action fails at SSH step
- Verify `SSH_PRIVATE_KEY` secret contains the full private key (including `-----BEGIN` and `-----END` lines)
- Verify `DROPLET_IP` is `45.55.34.241`
- Test SSH locally: `ssh pardia` should connect without password prompt

---

## Cost Estimate

| Service                      | Monthly Cost |
|-----------------------------|-------------|
| Droplet (1 GB, already exists) | $6           |
| Managed MySQL (optional)     | $15          |
| Container Registry (Starter) | Free         |
| Domain (if purchasing)       | ~$12/year    |
| **Total (with managed DB)**  | **~$21/mo**  |
| **Total (MySQL on droplet)** | **~$6/mo**   |

If running MySQL on the droplet, consider upgrading to 2 GB RAM ($12/mo) for better performance.
