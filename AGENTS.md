# AGENTS.md

Quick Go BEX — 基于 Quasar 2 + Vue 3 的浏览器扩展(MV3),用于快速跳转到指定 URL。本项目**只以 BEX 模式构建**,不使用默认 SPA / SSR / Cordova / Capacitor / Electron 形态。

## 命令

- 安装依赖:`pnpm install`(Node >= 16.14;包管理器由 `packageManager` 锁定为 pnpm 9.15.4)
- 开发:`pnpm dev:bex`(= `quasar dev -m bex`,devServer 端口 8080,自动打开浏览器)
- 生产构建:`pnpm build:bex`
- Lint:`pnpm lint`(ESLint,覆盖 `.js` / `.ts` / `.vue`)
- 格式化:`pnpm format`(Prettier 全量写回,遵循 `.gitignore`)
- 测试:**暂无测试框架**,`pnpm test` 是空壳。新增测试前需先引入 Vitest 等 runner。

## 构建产物与加载

- Chrome 开发者模式「加载已解压的扩展程序」→ `dist/bex/UnPackaged`
- 商店打包 zip → `dist/bex/chrome/`、`dist/bex/firefox/`
- `src-bex/www/` 是 dev-server 生成的产物目录,已被 `.gitignore` / `.eslintignore` 忽略,**不要手写或提交其中任何文件**

## 项目结构

- `src/pages/` — 路由级页面:`PopupPage`(工具栏弹窗)、`OptionPage` + `ConfigPage`(配置管理)、`Index`、`Error404`
- `src/components/` — 通用组件(`ConfigFormDialog.vue`、`ImportDialog.vue` 等)与共享类型 `models.ts`
- `src/service/` — 业务逻辑与持久化:`storageKey.ts`(存储 key 常量)、`defaultData.ts`(默认配置数据)
- `src/router/routes.ts` — 路由表;采用 **hash 模式**(`build.vueRouterMode: 'hash'`),manifest 中的页面路径形如 `www/index.html#/popup`
- `src/boot/` — Quasar 启动钩子:`i18n`、`axios`(`quasar.conf.js` 的 `boot` 数组与此处保持一致)
- `src/i18n/` — 国际化,当前仅有 `en-US`;新增语言需同步 `src/i18n/index.ts`
- `src-bex/` — 浏览器扩展专属:`manifest.json`(MV3)、`js/background.js` 等 service worker 与 content script、`css/content-css.css`、`icons/`
- `patches/` — pnpm patch,补丁 `@quasar/app-webpack@3.15.1`;改动构建行为前先看这里

## 关键约束

- **BEX 模式优先**:新增命令一律带 `-m bex`,不要跑 `quasar dev`(默认 SPA 形态)或引入 SPA-only 配置。
- **`.npmrc` 的 `shamefully-hoist=true` 是必需的**:Webpack 需要从根 `node_modules` 扁平解析 `vue-loader` / `ts-loader` 等,不要改成 pnpm 默认隔离布局。
- **manifest 路径改写依赖 patch**:MV3 用 `background.service_worker` 而非 `background.scripts`。若发现生产包路径没被改写、zip 缺文件或 background 为空,先确认 `pnpm.patchedDependencies` 生效(`pnpm install` 后自动应用),不要绕过补丁改 `node_modules`。
- **manifest 版本分散**:`src-bex/manifest.json` 与 `package.json` 的 `version` 各自独立,发布前需手动对齐。

## 代码风格

- TypeScript extends `@quasar/app-webpack/tsconfig-preset`,`baseUrl: "."`;页面/组件用 `<script setup lang="ts">`
- ESLint:`plugin:@typescript-eslint/recommended` + `plugin:vue/vue3-essential` + `prettier`;配置见 `.eslintrc.js`
- Prettier:单引号 + 分号(`.prettierrc`);缩进 2 空格、LF、`*.editorconfig`
- ESLint 已关闭 `no-explicit-any` / 显式返回类型等规则,保持与之一致,不要在个别文件里反向收紧
- Vue 组件命名 PascalCase;路由常量集中在 `src/router/routes.ts`,`catchAll` 404 路由必须保持在最后一项
- 提交前跑 `pnpm lint`,并让 Prettier 参与 VS Code 保存时格式化(`.vscode/settings.json` 已配 `formatOnSave` + `source.fixAll.eslint`)

## 测试说明

本仓库当前**没有自动化测试与 CI**(`test` 脚本为空、无 `.github/workflows`)。改动请通过 `pnpm dev:bex` 手工验证扩展的 popup / options / config 三条路径。

## 提交与分支

- 默认分支为 `master`(本地与 `origin/master`),不要直接推送到它
- 提交信息沿用 conventional commits(`fix(bex):` / `feat:` / `docs:` / `refactor:`),历史上已有 `fix(bex): migrate to @quasar/app-webpack, MV3 manifest & zip packaging` 这类写法
- 涉及构建/打包行为的改动,提交信息需说明是否同步更新了 `patches/`

## 安全

- 扩展权限较宽(`<all_urls>` + `storage` / `tabs` / `activeTab`),不要新增 host 权限或放宽 `content_security_policy` 而不说明原因
- `src-bex/js/` 下的脚本运行在 service worker / 页面上下文,禁止把密钥、token 写入代码或提交进仓库