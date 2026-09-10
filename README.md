# JI-Consultation

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
