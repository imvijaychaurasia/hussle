# imvijaychaurasia.github.io

Personal services site for Vijay Chaurasia: a listing of remote, digital-only work on offer (presentations, video, IT, DevOps, security, data, teaching, and more), plus an About page. Live at [imvijaychaurasia.github.io](https://imvijaychaurasia.github.io/).

## Why this exists

The goal is simple: let people in my network see what I can help with and reach out directly, without going through a freelance marketplace. No bidding, no listings competing for attention, no platform cut. Just a page that says what's on offer and a WhatsApp link to start the conversation.

## What's in here

```
public/               the deployed site (this is the only folder that goes live)
  index.html           home page: intro, services, resources, how it works, contact
  about.html            about page: background, skillset, what's been built
  styles.css            all styling (single stylesheet, CSS variables for theming)
  app.js                 renders the services grid from data/services.json, wires WhatsApp/email links
  site.js                 sidebar nav active-state / scroll-spy
  reveal.js                scroll-triggered fade-in animation
  data/services.json        the actual listings, grouped by category (source of truth for "what I offer")
  admin/                     Decap CMS: a form-based editor for data/services.json (see below)
server.js                local/LAN dev server (plain static file server, not used by GitHub Pages)
.github/workflows/deploy.yml   builds nothing, just publishes public/ to GitHub Pages on every push to main
```

There's no build step. Everything in `public/` is served as-is.

## How it runs

**Production**: GitHub Actions (`.github/workflows/deploy.yml`) publishes the `public/` folder to GitHub Pages on every push to `main`. Because this repo is named `imvijaychaurasia.github.io`, Pages serves it at the account's root domain rather than a `/reponame/` subpath.

**Local dev**:
```bash
npm install
npm start        # serves public/ at http://localhost:4173
```

**Editing listings** — two ways:
1. Edit `public/data/services.json` directly (locally, or in GitHub's web editor) and commit. It's a plain array of `{ group, items: [...] }` objects; each item has `title`, `tagline`, `details` (bullet list), and `turnaround`.
2. Use the Decap CMS admin UI at `/admin/` on the live site. It's a form-based editor that commits straight back to this repo on `main`. Requires GitHub login through a small OAuth proxy (see below) — only works when you're able to reach it.

## The OAuth proxy (for /admin)

GitHub Pages is static hosting only, no server code runs there. Decap CMS's GitHub login needs a tiny server to handle the OAuth handshake, so that piece runs separately:

- Code: a sibling project, `hussle-oauth-proxy` (not in this repo — it's infra, not site content)
- Deployed to: `tantra` (home server, `192.168.102.105`), as a systemd user service (`hussle-oauth-proxy.service`), port 4175
- `public/admin/config.yml` points Decap's `base_url` at `http://192.168.102.105:4175`

**This means `/admin` only works when your browser can reach `192.168.102.105`** — i.e., on the home network tantra sits on. Away from that network, `/admin` login will hang or fail. To fix that permanently, move the proxy to a publicly reachable host (a small Cloudflare Worker or Vercel function both work well for this) and update `base_url` accordingly.

The proxy needs a GitHub OAuth App (Settings → Developer settings → OAuth Apps) with:
- Homepage URL: `https://imvijaychaurasia.github.io/`
- Authorization callback URL: `http://192.168.102.105:4175/callback`

Client ID and secret live in `~/apps/hussle-oauth-proxy/.env` on tantra — not committed anywhere.

## Contact wiring

- Each service card's "Request this" link opens WhatsApp with that specific service pre-filled (`app.js`, `whatsappLink()`).
- The sidebar and contact section also expose email and WhatsApp directly.
- WhatsApp number and email live in the `CONTACT` object at the top of `app.js`.

## Troubleshooting

**Pages build failed / site not updating**
Check the Actions tab on GitHub, or `gh run list --repo imvijaychaurasia/imvijaychaurasia.github.io`. The workflow only builds `public/`, so a red run almost always means a bad file path or a broken `data/services.json` (invalid JSON silently breaks the services grid, though it won't fail the build itself — validate locally first: `node -e "JSON.parse(require('fs').readFileSync('public/data/services.json'))"`).

**Services grid shows "Could not load services right now"**
Usually means `public/data/services.json` is invalid JSON, or the fetch path broke. Check the browser console on the live site.

**`/admin` won't log in**
Almost always the OAuth proxy: confirm `hussle-oauth-proxy.service` is running on tantra (`systemctl --user status hussle-oauth-proxy.service`), and that you're on a network that can reach `192.168.102.105:4175`. If the proxy's `.env` is missing the client ID/secret, it exits on startup — check `journalctl --user -u hussle-oauth-proxy -n 50`.

**WhatsApp link not opening the right chat**
The number in `app.js` (`CONTACT.whatsappNumber`) must be digits only, country code first, no `+` or spaces (e.g. `918828287588`).

**Changed something and the live site doesn't reflect it**
Confirm it was actually pushed to `main` — Decap CMS commits directly, but local edits need `git push` like normal. Then give the Actions workflow a minute; check its status as above.

## Deploying elsewhere / renaming again

This repo is deliberately named `imvijaychaurasia.github.io` so it serves at the account root. Renaming it away from that (or to a different `<username>.github.io`) will drop it back to a project-page URL (`imvijaychaurasia.github.io/<reponame>/`) — GitHub Pages keys the root domain off that exact repo name, not a setting.
