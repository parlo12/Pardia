# GitHub Secrets Setup for Pardia CI/CD

Go to **https://github.com/parlo12/Pardia/settings/secrets/actions** and create these 4 repository secrets.

---

## Secret 1: `SSH_PRIVATE_KEY`

Click **New repository secret**, name it `SSH_PRIVATE_KEY`, and paste this exact value:

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

## Secret 2: `DROPLET_IP`

```
45.55.34.241
```

---

## Secret 3: `DIGITALOCEAN_ACCESS_TOKEN`

This one you need to create on DigitalOcean:

1. Go to **https://cloud.digitalocean.com/account/api/tokens**
2. Click **Generate New Token**
3. Name: `github-deploy`
4. Scope: **Read + Write**
5. Copy the token and paste it as this secret's value

---

## Secret 4: `DOCR_REGISTRY`

This is the name of your DigitalOcean Container Registry. You need to create it first:

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

## How It All Connects

The GitHub Actions workflow (`.github/workflows/deploy.yml`) uses these secrets to:

1. **Build** the Docker image on GitHub's servers
2. **Push** the image to `registry.digitalocean.com/DOCR_REGISTRY/pardia-web` (using `DIGITALOCEAN_ACCESS_TOKEN`)
3. **SSH** into the droplet at `DROPLET_IP` as `root` (using `SSH_PRIVATE_KEY`)
4. **Pull** and **run** the latest image on the droplet

Every push to the `main` branch triggers this automatically.

---

## After Adding All 4 Secrets

Your secrets page should show:

| Name                        | Added    |
|----------------------------|----------|
| `DIGITALOCEAN_ACCESS_TOKEN` | Just now |
| `DOCR_REGISTRY`             | Just now |
| `DROPLET_IP`                | Just now |
| `SSH_PRIVATE_KEY`            | Just now |

Once all 4 are set, push any commit to `main` and the deploy will trigger automatically. Watch progress at **https://github.com/parlo12/Pardia/actions**.
