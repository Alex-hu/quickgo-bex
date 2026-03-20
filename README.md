# Quick Go BEX (quickgo-bex)

Go to the specfiy url quickly.

## Install the dependencies

```bash
pnpm install
# or: yarn
```

### Browser extension (BEX) — development

This project is a **browser extension**. Use BEX mode (not the default SPA):

```bash
pnpm dev:bex
# or: quasar dev -m bex
```

### Browser extension — production build

```bash
pnpm build:bex
# or: quasar build -m bex
```

In Chrome, **Load unpacked** and select:

`dist/bex/UnPackaged`

(Packaged zips are also under `dist/bex/chrome/` and `dist/bex/firefox/`.)

### pnpm + Webpack

This repo uses [`.npmrc`](.npmrc) `shamefully-hoist=true` so Webpack can resolve `vue-loader`, `ts-loader`, etc. from `@quasar/app-webpack`.

MV3 manifests use `background.service_worker` instead of `background.scripts`; a **[pnpm patch](patches/@quasar__app-webpack@3.15.1.patch)** adjusts `@quasar/app-webpack`’s BEX pipeline so that:

1. Production manifest path rewrites work for `service_worker` (stock CLI only handled MV2 `background.scripts`).
2. **Chrome / Tabbit zip install works:** the stock packager ran when only the Renderer webpack finished, so `Packaged/chrome/*.zip` could be created **before** `www/js/bex-background.js` existed—leading to “无法加载背景脚本” / empty background script. Packaging now runs from `build.js` after **Main + Renderer** both complete, and zip writing waits for the archive to finish.

After `pnpm install`, the patch applies via `package.json` → `pnpm.patchedDependencies`.

### Lint the files

```bash
pnpm lint
# or: yarn lint
```

### Format the files

```bash
pnpm format
# or: yarn format
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
