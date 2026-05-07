# code-component-templates

Project templates for the ikas code-component scaffolder, consumed by `ikas code-component create` (in [`@ikas/cli-beta`](https://github.com/ikascom/ikas-cli)).

## Layout

- `blank/` — minimal starter with a single example component and section. Edited by hand.
- `full/` — complete reference theme with 20 sections and 30+ components. **Auto-generated** from `apps/reference-theme/` in the editor monorepo. Do not edit `full/` directly.

## How `full/` is regenerated

The `full/` directory is rebuilt by `scripts/regenerate-templates.ts` in the editor monorepo. The script reads `apps/reference-theme/`, replaces project-specific IDs with `{{PROJECT_ID}}` placeholders, and pushes a new commit here when the diff is non-empty.

## Versioning

The CLI pins templates by git tag (e.g. `v1.0.0`). When templates are updated:

1. Land changes on `main` here.
2. Tag a new release (`vMAJOR.MINOR.PATCH`).
3. Bump `TEMPLATES_VERSION` in `packages/code-component/src/helpers/template-fetcher.ts` in the CLI repo.

## Filename conventions

Files in templates use these renames at scaffold time:

| Template file | Scaffolded as |
|---|---|
| `gitignore` | `.gitignore` |
| `mcp.json` | `.mcp.json` |
| `claude-md` | `CLAUDE.md` |
| `cursorrules` | `.cursorrules` |

Placeholders like `{{PROJECT_ID}}`, `{{PROJECT_NAME}}`, `{{EXAMPLE_COMPONENT_ID}}` are replaced by the scaffolder.
