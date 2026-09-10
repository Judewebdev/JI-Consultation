# JI Global Consultancy

Company website covering both arms: the consulting agency and the academy.

## The site

`site/index.html` plus two files in `site/assets/`. No framework, no build step, no dependencies. Eight pages, client-side routed.

| Agency | Academy |
| --- | --- |
| `/agency` | `/academy` |
| `/agency/about` | `/academy/programs` |
| `/agency/services` | `/academy/about` |
| `/agency/contact` | `/academy/contact` |

The nav carries an Agency / Academy switcher. Selecting one swaps the page set, the navigation and the entire accent colour (sky blue for the agency, gold for the academy) through a single `body[data-arm]` attribute.

### Deploy to Netlify

**Drag and drop.** Drop the `site` folder on [app.netlify.com/drop](https://app.netlify.com/drop).

**Connect the repo.** `netlify.toml` sets `publish = "site"`, an empty build command, and the SPA fallback that deep links depend on.

> The fallback redirect must return **200, not 301**. Without it, `/agency/services` 404s on a hard refresh. It is already configured.

### Before you go live

Search `TODO` in `site/index.html`. Five of them:

- Contact email and WhatsApp number (used on both contact pages)
- `og:url`, `canonical` and a 1200x630 `assets/og.png`
- **David Albert's headshot and bio.** His name, title and country are in place on three cards. The bio is a marked placeholder, because I am not going to invent a colleague's background.

Both forms are wired for [Netlify Forms](https://docs.netlify.com/forms/setup/) and need no setup. Submissions arrive in your Netlify dashboard under Forms, as `agency-enquiry` and `academy-application`. They post by AJAX when JS is on and fall back to a native POST when it is off.

Design reasoning, palette, routing notes and gotchas: [docs/design-system.md](docs/design-system.md)

## Tooling

The project is wired for the [21st.dev CLI](https://21st.dev), used for design review and component search.

### Quick start

```bash
npm install                  # installs the pinned 21st CLI locally
npm i -g @21st-dev/cli       # optional, puts `21st` on your PATH
21st login                   # opens a browser, saves the token to ~/.config/21st
```

For scripts and CI, skip the browser and use a key instead:

```bash
cp .env.example .env         # paste your key from https://21st.dev/mcp
export API_KEY_21ST="your-key"
21st review site/ --api-key "$API_KEY_21ST"
```

Full setup, commands and auth options: [docs/21st-cli.md](docs/21st-cli.md)

### What is in here

| Path | What it is |
| --- | --- |
| `site/index.html` | The whole website |
| `site/assets/` | Portrait and logo mark |
| `netlify.toml` | Publish dir, SPA fallback, headers, cache rules |
| `docs/design-system.md` | Palette, type, routing and the reasoning behind them |
| `.claude/skills/ui-ux-pro-max/` | Vendored UI/UX design database, searchable offline |
| `.21st/` | Design context the CLI reads before generating UI |
| `.env.example` | Template for `API_KEY_21ST`. Copy to `.env`, never commit the real one |
