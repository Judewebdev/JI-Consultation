# JI-Consultation

The JI Global website, covering both arms: the consulting agency and the digital skills academy.

## The website

One self-contained file: [`site/index.html`](site/index.html). No build step, no framework, no dependencies. Open it in a browser and it just runs.

### Deploy to Netlify

**Drag and drop.** Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drop the `site` folder in. Live in about ten seconds.

**Connect the repo.** Point Netlify at this repository. `netlify.toml` already sets `publish = "site"` with an empty build command, so `node_modules` and the repo tooling stay out of the deploy.

### Before you go live

The site ships with placeholders that are marked in the HTML. Search for `TODO`:

- Contact email, WhatsApp number and the `og:` domain and preview image
- The portrait in the About section
- Three of the four stat figures
- **Every testimonial.** They are placeholder text, not real quotes. Replace them with genuine ones or delete the section.

The contact form is wired for [Netlify Forms](https://docs.netlify.com/forms/setup/) and needs no extra setup. Submissions land in your Netlify dashboard under Forms. It posts by AJAX with JS on, and falls back to a native POST with JS off.

Design reasoning, palette and interaction rules: [docs/design-system.md](docs/design-system.md)

## Tooling

This project is wired for the [21st.dev CLI](https://21st.dev), used for component search, UI generation and design review.

### Quick start

```bash
npm install                  # installs the pinned 21st CLI locally
npm i -g @21st-dev/cli       # optional, puts `21st` on your PATH
21st login                   # opens a browser, saves the token to ~/.config/21st
21st whoami                  # confirm it took
```

For scripts and CI, skip the browser and use a key instead:

```bash
cp .env.example .env         # paste your key from https://21st.dev/mcp
export API_KEY_21ST="your-key"
21st review . --api-key "$API_KEY_21ST"
```

Full setup, commands, auth options and CI notes: [docs/21st-cli.md](docs/21st-cli.md)

### What is in here

| Path | What it is |
| --- | --- |
| `site/index.html` | The whole website, single file |
| `netlify.toml` | Netlify publish dir, headers and cache rules |
| `docs/design-system.md` | Palette, type scale and the reasoning behind them |
| `.21st/` | Project design context the CLI reads before generating UI |
| `.claude/skills/ui-ux-pro-max/` | Vendored UI/UX design database, searchable offline |
| `.github/workflows/21st-review.yml` | Runs the local UI review on push and PR |
| `.env.example` | Template for `API_KEY_21ST`. Copy to `.env`, never commit the real one |

---

![IMG_7626](https://github.com/user-attachments/assets/f25a258f-a392-44a6-8454-bbdb92ca5a1b)
![IMG_7625](https://github.com/user-attachments/assets/7452bf2a-5dfd-49ed-8cfc-4392b99763a3)
![IMG_7624](https://github.com/user-attachments/assets/0fc112ed-6855-4523-a68b-8444397ee2db)
![IMG_7623](https://github.com/user-attachments/assets/f0af3a39-70ef-4ec8-b228-86e70505d9d8)
![IMG_7622](https://github.com/user-attachments/assets/66447fa9-2e95-4c9b-91a1-d95f2a3445d3)
