# Cloudflare Pages 部署指南

## ⚠️ 重要：修复部署错误

如果你遇到 `Missing entry-point to Worker script` 错误，说明 Cloudflare Pages 误判了项目类型。

### 快速修复步骤：

1. **进入 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 进入你的 Timora 项目

2. **检查项目类型**
   - 确保项目类型是 **Pages**，不是 **Workers**
   - 如果创建错了，需要删除并重新创建

3. **重新创建项目（如果必要）**
   - 进入 "Workers & Pages"
   - 点击 "Create application"
   - **重要**：选择 **"Pages"** → **"Connect to Git"**
   - **不要**选择 "Workers"

4. **配置构建设置**
   - **Framework preset**: 选择 **"Vite"**（会自动填充配置）
   - 或者选择 **"None"** 然后手动配置：
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - **Root directory**: 留空
   - **Node version**: `20`

5. **检查部署命令**
   - 在 "Builds & deployments" 设置中
   - **确保 "Deploy command" 字段完全为空**
   - 如果看到 `npx wrangler deploy`，请删除它
   - 只保留 **Build command**: `npm run build`

6. **保存并重新部署**

## 部署前准备

项目已经配置好所有 Cloudflare Pages 部署所需的文件：

- ✅ `public/_redirects` - SPA 路由重定向配置
- ✅ `vite.config.ts` - 构建配置优化
- ✅ `.nvmrc` - Node.js 版本指定（Node.js 20）
- ✅ `package.json` - 包含构建脚本和引擎要求

## 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 登录你的账户

2. **创建新项目**
   - 进入 "Workers & Pages"
   - 点击 "Create application"
   - **选择 "Pages"** → "Connect to Git"
   - ⚠️ **重要**：确保选择的是 **Pages**，不是 **Workers**

3. **连接 GitHub 仓库**
   - 选择 GitHub 作为 Git 提供商
   - 授权 Cloudflare 访问你的仓库
   - 选择 `yexianbei/Timora` 仓库

4. **配置构建设置**
   - **Framework preset**: 选择 **"Vite"**（推荐，会自动配置）
   - 如果选择 "None"，手动配置：
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
   - **Root directory**: `/` (留空)
   - **Node version**: `20`
   
   ⚠️ **关键检查项**：
   - ✅ 确保选择的是 **Pages** 而不是 **Workers**
   - ✅ **Deploy command** 字段必须为空（不要填写任何内容）
   - ✅ 只使用 **Build command**: `npm run build`
   - ✅ Framework preset 选择 **Vite** 会自动配置正确的设置

5. **环境变量**（如果需要）
   - 通常不需要额外的环境变量
   - 如果需要，可以在 "Environment variables" 中添加

6. **保存并部署**
   - 点击 "Save and Deploy"
   - Cloudflare 会自动构建并部署你的应用

### 方法二：使用 Wrangler CLI（仅用于 Pages）

⚠️ **注意**：此方法需要 Node.js 20+，因为 wrangler 4.x 需要 Node.js 20+

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```
   确保你的 Node.js 版本 >= 20：
   ```bash
   node --version  # 应该显示 v20.x.x 或更高
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建项目**
   ```bash
   npm run build
   ```

4. **部署到 Cloudflare Pages**
   ```bash
   wrangler pages deploy dist --project-name=timora
   ```
   
   ⚠️ **重要**：使用 `wrangler pages deploy` 而不是 `wrangler deploy`

### 方法三：通过 GitHub Actions（自动部署）

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: timora
          directory: dist
```

## 构建配置说明

### 构建命令
```bash
npm run build
```

这会执行：
1. TypeScript 类型检查 (`tsc`)
2. Vite 构建 (`vite build`)

### 输出目录
构建后的文件会输出到 `dist/` 目录，包含：
- `index.html`
- `assets/` (JS, CSS 文件)
- 其他静态资源

### SPA 路由配置
`public/_redirects` 文件确保所有路由都重定向到 `index.html`，这样 React Router 可以正常工作。

## 部署后验证

部署成功后，你可以：

1. **访问你的网站**
   - Cloudflare 会提供一个 `*.pages.dev` 域名
   - 例如：`https://timora-xxx.pages.dev`

2. **测试功能**
   - 访问各个页面（日历、任务、计时器等）
   - 确保路由正常工作
   - 检查移动端响应式布局

3. **自定义域名**（可选）
   - 在 Cloudflare Pages 设置中添加自定义域名
   - 配置 DNS 记录

## 常见问题

### 1. 错误：Missing entry-point to Worker script

**问题**：Cloudflare Pages 误判为 Workers 项目，尝试使用 `wrangler deploy`

**解决方案**：
1. **检查项目类型**：确保在 Cloudflare Dashboard 中项目类型是 **Pages**，不是 **Workers**
2. **删除并重新创建项目**（如果项目类型错误）：
   - 删除当前项目
   - 重新创建，**确保选择 "Pages"** 而不是 "Workers"
3. **检查部署命令**：
   - 进入项目设置 → "Builds & deployments"
   - 确保 **"Deploy command"** 字段完全为空
   - 只保留 **"Build command"**: `npm run build`
4. **检查 Framework preset**：
   - 选择 **"Vite"** 作为 Framework preset
   - 这会自动配置正确的构建设置

### 2. 错误：Wrangler requires at least Node.js v20.0.0

**问题**：Cloudflare Pages 误用了 `wrangler deploy` 命令

**解决方案**：
- 在 Cloudflare Pages 设置中，确保 **Deploy command** 字段为空
- 只保留 **Build command**: `npm run build`
- 确保 **Framework preset** 选择 `Vite` 或 `None`
- 确保项目类型是 **Pages** 而不是 **Workers**

### 3. 构建失败
- 检查 Node.js 版本（需要 >= 20）
- 确保所有依赖都已安装
- 查看构建日志中的错误信息

### 4. 路由 404 错误
- 确保 `public/_redirects` 文件存在
- 检查文件内容是否正确：`/*    /index.html   200`

### 5. 静态资源加载失败
- 检查 `vite.config.ts` 中的 `base` 配置（如果需要）
- 确保所有资源路径都是相对的

### 6. 环境变量
如果需要环境变量，在 Cloudflare Pages 设置中添加：
- 进入项目设置
- 找到 "Environment variables"
- 添加变量（如 `VITE_API_URL`）

## 持续部署

一旦配置完成，每次推送到 `main` 分支时，Cloudflare Pages 会自动：
1. 检测到新的提交
2. 运行构建命令
3. 部署新版本

你可以在 Cloudflare Dashboard 中查看部署历史和状态。

## 性能优化

Cloudflare Pages 自动提供：
- ✅ CDN 加速
- ✅ 全球边缘节点
- ✅ HTTPS 加密
- ✅ 自动压缩
- ✅ 缓存优化

## 支持

如有问题，请查看：
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
