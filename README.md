# CodeRabbit Config Generator

A web app that generates [CodeRabbit](https://coderabbit.ai/)'s `.coderabbit.yaml` configuration file through a GUI. Fill in the form and the YAML is live-previewed in the right pane, ready to download.

Every field, label, validation rule, and default value is **derived at runtime** from CodeRabbit's official [JSON Schema (`schema.v2.json`)](https://storage.googleapis.com/coderabbit_public_assets/schema.v2.json). Swap the schema and the entire form follows.

## Features

- **Schema-driven / runtime conversion** — Loads `schema.v2.json` and dynamically produces both a Valibot schema (for validation) and render metadata (labels, descriptions, enums, constraints, widget kinds). No fields are hand-written.
- **Recursive generic renderer** — Renders objects, arrays, and nesting as a tree, handling two-level nested arrays and free-form records naturally.
- **Minimal YAML output** — Deeply compares input against the schema's `default` values and strips keys equal to defaults along with empty arrays/objects, emitting a clean YAML of only what matters (a "include defaults" toggle switches to full output).
- **Live preview** — Updates the YAML instantly as you type, with copy / download / reset.

## Tech Stack

| Area | Choice |
|---|---|
| UI | React 19 |
| Forms | [Formisch](https://github.com/fabian-hiller/formisch) (`@formisch/react`) |
| Validation / schema | [Valibot](https://valibot.dev/) |
| Styling | Tailwind CSS 4 |
| YAML | [`yaml`](https://www.npmjs.com/package/yaml) |
| Build | Vite |
| Testing | Vitest + Testing Library |

## Getting Started

Requires **Node.js 22.x**. This repo vendors [`awesome-coderabbit`](https://github.com/coderabbitai/awesome-coderabbit) as a git submodule to power the "official examples" picker on the Import page, so clone with `--recurse-submodules`.

```bash
git clone --recurse-submodules <repo-url>
cd coderabbit-config-generator
npm ci        # install dependencies
npm run dev   # start the dev server (Vite)
```

Already cloned without submodules? Run `git submodule update --init --recursive` before `npm ci`.

`npm run dev` and `npm run build` automatically regenerate `src/examples/generated/` from the submodule before starting, so the example list always reflects the checked-out submodule commit. See [CONTRIBUTING.md](CONTRIBUTING.md) for more on the development workflow.

Open the URL Vite prints (default `http://localhost:5173`).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check (`tsc -b`) + production build (`dist/`) |
| `npm run preview` | Preview the build locally |
| `npm run typecheck` | Type-check only |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run generate:examples` | Regenerate `src/examples/generated/` from the `awesome-coderabbit` submodule |

## Architecture

```
schema.v2.json (single source of truth)
      │  adapter layer (src/schema/)
 ┌────────────────────────────┬─────────────────────────────┐
 │ jsonSchemaToValibot(node)  │ toFieldMeta(node, path)     │
 │  builds Valibot            │  computes label/desc/enum/  │
 │  recursively (memoized)    │  constraint/widget kind     │
 └────────────────────────────┴─────────────────────────────┘
      │                              │
      ▼                              ▼
 useForm({ schema })          <FieldRenderer meta path> (recursive, generic)
      │                              │  + widget registry
      └──────────────┬───────────────┘
                     ▼
   getInput(form) → buildConfig (strip defaults) → yaml.stringify → download
```

`schema.v2.json` is the single source of truth, converted by two adapters for different purposes:

- **`jsonSchemaToValibot`** — Recursively converts JSON Schema to a Valibot schema (resolving `$ref`, folding `allOf`/`anyOf`/`oneOf`, memoized). Used for Formisch validation.
- **`toFieldMeta`** — Computes render metadata (label, description, enum, constraints, widget kind) for each node.

### Widget selection

`toFieldMeta` picks a widget kind from each node's type and constraints, and `FieldRenderer` dispatches to the matching field component.

| Condition | Widget |
|---|---|
| `boolean` | Toggle |
| `enum` (≤ 4 items) | Radio |
| `enum` (> 4 items) | Select |
| `enum` (99 language values) | Searchable combobox |
| `string` (short) | Input |
| `string` (long) | Textarea |
| `number` / `integer` | Number input (min/max) |
| `array` of string | Tag input |
| `array` of object | Repeatable group |
| `object` (free record) | Key/value list editor |
| `object` (with properties) | Section |

## Project Structure

```
src/
  schema/                    # schema → internal representation adapters
    schema.v2.json           #   vendored official schema (source of truth)
    jsonSchemaToValibot.ts   #   JSON Schema → Valibot (recursive, memoized)
    toFieldMeta.ts           #   JSON Schema node → render metadata
    index.ts                 #   exposes configSchema / rootMeta
    types.ts                 #   FieldMeta types, etc.
  form/
    useConfigForm.ts         # useForm wrapper (builds the root schema)
    FieldRenderer.tsx        # recursive renderer (dispatches on meta.kind)
    fields/                  # widgets (Boolean/Enum/Text/Number/…)
  output/
    buildConfig.ts           # strip-defaults (computes minimal config)
    toYaml.ts                # YAML serialization + download
  ui/
    YamlPreview.tsx          # right-pane live preview
    InfoTip.tsx              # description tooltip
  App.tsx
```

## Testing

Unit and component tests use Vitest (jsdom) + Testing Library, covering the field components, schema conversion, and YAML output.

```bash
npm test                # run
npm run test:coverage   # with coverage
```

CI (GitHub Actions) runs lint, test, and build.
