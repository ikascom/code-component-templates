# my-ikas-components

An ikas code components project.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open the ikas editor and connect to the dev server from the Dev Components panel.

## Commands

- `npm run dev` - Start development server with live editor updates
- `npm run build` - Build components for production
- `npm run add` - Add a new component to the project

## Project Structure

```
my-ikas-components/
├── src/
│   └── components/
│       ├── ExampleComponent/  # A child component (type: "component")
│       │   ├── index.tsx
│       │   ├── styles.css
│       │   └── types.ts
│       ├── ExampleSection/    # A page-level section (type: "section")
│       │   ├── index.tsx
│       │   ├── styles.css
│       │   └── types.ts
│       └── index.ts
├── ikas.config.json
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Sections vs Components

There are two types of code components:

- **Sections** are page-level, full-width containers (e.g. Header, Hero Banner, Footer).
  Set `"type": "section"` on the component entry in `ikas.config.json`.
- **Components** are child elements placed inside sections (e.g. buttons, cards, badges).
  No `type` field needed — it defaults to `"component"`.

## Adding Props

Edit `ikas.config.json` to add props to your components. Available prop types:

- `TEXT` - String input
- `NUMBER` - Number input
- `BOOLEAN` - Checkbox toggle
- `IMAGE` - Image picker
- `LINK` - Link/URL input
- `LIST_OF_LINK` - List of navigation links
- `COLOR` - Color picker
- `SELECT` - Dropdown selection
- `PRODUCT` - Single product selector
- `PRODUCT_LIST` - Multiple products selector
- `CATEGORY` - Single category selector
- `CATEGORY_LIST` - Multiple categories selector
- `BRAND` - Single brand selector
- `BRAND_LIST` - Multiple brands selector
- `BLOG` - Single blog post selector
- `BLOG_LIST` - Multiple blog posts selector

## Building for Production

Run `npm run build` to compile your components. The output will be ready to upload to the ikas editor.
