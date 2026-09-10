# 21st.dev CLI

Component search, UI generation and design context for this project.

## Install

Global, so `21st` is on your PATH everywhere:

```bash
npm i -g @21st-dev/cli
```

Or use the local copy that ships with this repo, no global install needed:

```bash
npm install
npx 21st help
```

The CLI is pinned in `devDependencies`, so everyone on the project runs the same version.

## Auth

Three ways in. Pick one.

**1. Interactive login (your own machine).** Opens a browser and saves the token to `~/.config/21st`, outside the repo:

```bash
21st login
21st whoami
```

**2. Environment variable (recommended for scripts).** The CLI picks this up on its own, no flag required:

```bash
cp .env.example .env   # then paste your key into .env
export API_KEY_21ST="your-key"
```

`TWENTYFIRST_TOKEN` works too. Set one or the other, not both.

**3. Explicit flag (CI).** Never rely on a saved login in CI, containers or ephemeral runners. There is no browser there and the token dies with the box:

```bash
21st review . --strict --api-key "$API_KEY_21ST"
```

Get a key at https://21st.dev/mcp

## Design context

`.21st/design.json` and `.21st/DESIGN.md` are committed. They tell 21st what this project already looks like, so generated components match instead of fighting the existing style. This command runs offline.

```bash
npm run 21st:context:check     # verify it is current
npm run 21st:context:refresh   # regenerate after stack or token changes
```

Right now the context is close to empty because the repo has no app code yet. Refresh it the moment you add a real stack, otherwise every generation is a guess.

## Everyday commands

```bash
21st search "pricing table" --limit 5   # components, themes, templates
21st logo "stripe"                      # brand SVGs, free, no login
21st get <id>                           # print a component's code
21st add <user>/<slug>                  # install a published component
21st generate "consulting hero section" # project-aware UI variants
21st review src/ --fix                  # local UI lint rules
```

`search`, `get`, `add` and `generate` hit the 21st API and need auth. `review` and `init --design-context` run locally.

## npm scripts

| Script | Does |
| --- | --- |
| `npm run 21st -- <args>` | Passthrough to the CLI |
| `npm run 21st:whoami` | Who is signed in |
| `npm run 21st:usage` | Retrieval quota and hosted AI access |
| `npm run 21st:context` | Create the design context |
| `npm run 21st:context:check` | Check the design context is current |
| `npm run 21st:context:refresh` | Regenerate the design context |
| `npm run 21st:review` | Local UI review |
| `npm run 21st:ci:whoami` | Auth smoke test using `$API_KEY_21ST` |
| `npm run 21st:ci:review` | Strict JSON review using `$API_KEY_21ST` |

## CI

`.github/workflows/21st-review.yml` runs the local review on every push and pull request. It needs no key. The auth check step only runs when you add an `API_KEY_21ST` repository secret under Settings, Secrets and variables, Actions.

## UI/UX Pro Max skill

`.claude/skills/ui-ux-pro-max/` is vendored into this repo at v2.5.0 (MIT). It is a searchable design database: 50+ styles, 161 palettes, 57 font pairings, 161 product types, 99 UX guidelines, 25 chart types across 10 stacks. Claude Code picks it up automatically from `.claude/skills/`.

Query it directly, plain Python, no dependencies:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "consulting landing page" --domain style -n 3
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "trust professional" --domain color
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "JI Consultation" --design-system
```

Domains: `style`, `color`, `chart`, `landing`, `product`, `ux`, `typography`, `icons`, `react`, `web`, `google-fonts`.

To update it later, on a machine that can reach 21st.dev:

```bash
21st skills install ui-ux-pro-max
```

## Exit codes

Useful when scripting `--json`: `3` auth, `4` rate limit, `5` build, `6` media, `7` conflict.

Full docs: https://help.21st.dev/cli
