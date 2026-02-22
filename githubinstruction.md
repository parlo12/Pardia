# GitHub Setup for Pardia CI/CD

Everything needed to configure GitHub for automated deployments to DigitalOcean.

---

## Part 1: Add the Deployment Workflow

The workflow file already exists in the repo at `.github/workflows/deploy.yml` — it was pushed with the code, so **GitHub already has it**. You don't need to create it manually.

But if for any reason it's missing, or you want to verify it matches, here's the full file. It goes at `.github/workflows/deploy.yml` in the repo:

```yaml
name: Build & Deploy to DigitalOcean Droplet

on:
  push:
    branches: [main]

env:
  REGISTRY: registry.digitalocean.com
  IMAGE_NAME: ${{ secrets.DOCR_REGISTRY }}/pardia-web

jobs:
  build-and-push:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Install doctl (DigitalOcean CLI)
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

      - name: Log in to DigitalOcean Container Registry
        run: doctl registry login --expiry-seconds 1200

      - name: Build Docker image
        run: |
          docker build \
            -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
            -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest \
            .

      - name: Push Docker image
        run: |
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

  deploy:
    name: Deploy to Droplet via SSH
    runs-on: ubuntu-latest
    needs: build-and-push

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: root
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            # Log in to container registry
            docker login registry.digitalocean.com -u ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }} -p ${{ secrets.DIGITALOCEAN_ACCESS_TOKEN }}

            # Pull the latest image
            docker pull registry.digitalocean.com/${{ secrets.DOCR_REGISTRY }}/pardia-web:latest

            # Stop and remove old container (if running)
            docker stop pardia-app 2>/dev/null || true
            docker rm pardia-app 2>/dev/null || true

            # Run the new container
            # Port 8080 exposed for Caddy reverse proxy (handles SSL on 80/443)
            docker run -d \
              --name pardia-app \
              --restart unless-stopped \
              -p 8080:8080 \
              --env-file /root/pardia/.env \
              -v pardia_storage:/var/www/html/storage \
              registry.digitalocean.com/${{ secrets.DOCR_REGISTRY }}/pardia-web:latest

            # Clean up old images
            docker image prune -f
```

**Where this file lives in the repo:**
```
Pardia-website/
├── .github/
│   └── workflows/
│       └── deploy.yml    ← THIS FILE
├── Dockerfile
├── docker-compose.yml
└── ...
```

GitHub automatically detects any `.yml` file inside `.github/workflows/` and runs it based on the trigger (in our case, every push to `main`).

---

## Part 2: Add Repository Secrets

Go to **https://github.com/parlo12/Pardia/settings/secrets/actions**

Click **New repository secret** for each of these 4 secrets:

---

### Secret 1: `SSH_PRIVATE_KEY`

Paste this exact value:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACDeqWZ4Ed+Ws5HVrl3TsF3upBg5Emu7gLQZ/tuQLOSOiAAAAKCOgQXsjoEF
7AAAAAtzc2gtZWQyNTUxOQAAACDeqWZ4Ed+Ws5HVrl3TsF3upBg5Emu7gLQZ/tuQLOSOiA
AAAEACmtTE5j9Y1J4rGSp2BdwSBu+caTJuhhXX3rtd8AOzNt6pZngR35azkdWuXdOwXe6k
GDkSa7uAtBn+25As5I6IAAAAHGdpdGh1Yi1hY3Rpb25zLXBhcmRpYS1kZXBsb3kB
-----END OPENSSH PRIVATE KEY-----
```

This is the dedicated CI/CD deploy key. The public key is already added to the droplet.

---

### Secret 2: `DROPLET_IP`

```
45.55.34.241
```

---

### Secret 3: `DIGITALOCEAN_ACCESS_TOKEN`

You need to create this on DigitalOcean:

1. Go to **https://cloud.digitalocean.com/account/api/tokens**
2. Click **Generate New Token**
3. Name: `github-deploy`
4. Scope: **Read + Write**
5. Copy the token and paste it as this secret's value

---

### Secret 4: `DOCR_REGISTRY`

This is the name of your DigitalOcean Container Registry. Create it first:

1. Go to **https://cloud.digitalocean.com/registry**
2. Click **Create Registry**
3. Name: `pardia-registry` (or whatever you choose)
4. Plan: **Starter** (free)
5. Region: **New York**

Then set this secret to just the registry name:

```
pardia-registry
```

---

## Part 3: Verify Setup

After adding all 4 secrets, your secrets page should show:

| Name                        | Status   |
|----------------------------|----------|
| `DIGITALOCEAN_ACCESS_TOKEN` | Added    |
| `DOCR_REGISTRY`             | Added    |
| `DROPLET_IP`                | Added    |
| `SSH_PRIVATE_KEY`            | Added    |

### Trigger a deploy:

Push any commit to `main`:
```bash
git commit --allow-empty -m "Test deployment" && git push
```

Watch progress at: **https://github.com/parlo12/Pardia/actions**

The workflow will:
1. Build the Docker image (~2-3 min)
2. Push it to DigitalOcean Container Registry
3. SSH into the droplet and swap the running container with the new one
