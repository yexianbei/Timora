# Cloudflare Pages 部署指南

## ⚠️ 紧急修复：如果遇到 wrangler deploy 错误

如果你看到 `Missing entry-point to Worker script` 或 `npx wrangler deploy` 错误，**问题在 Cloudflare Dashboard 的配置**。

### 必须手动在 Cloudflare Dashboard 中修复：

1. **进入 Cloudflare Dashboard**
   - https://dash.cloudflare.com
   - 进入你的 Timora 项目

2. **进入 Settings → Builds & deployments**

3. **找到 "Deploy command" 字段**
   - ⚠️ **这个字段必须完全为空**
   - 如果里面有 `npx wrangler deploy` 或任何内容，**全部删除**

4. **检查 "Build command" 字段**
   - 应该填写：`npm run build`
   - 如果为空，请填写

5. **检查 "Build output directory" 字段**
   - 应该填写：`dist`

6. **检查 Framework preset**
   - 选择：**Vite**（这会自动配置正确的设置）

7. **检查 Node version**
   - 选择：**20**

8. **保存设置**
   - 点击 "Save"
   - 然后点击 "Retry deployment" 或等待自动重新部署

### 如果还是不行，删除项目重新创建：

1. **删除当前项目**
   - Settings → General → 最底部 "Delete project"

2. **重新创建 Pages 项目**
   - Workers & Pages → Create application
   - **重要**：选择 **"Pages"** → "Connect to Git"
   - **不要**选择 "Workers"！

3. **连接 GitHub**
   - 选择 `yexianbei/Timora` 仓库

4. **配置构建设置**
   - Framework preset: **Vite**（会自动填充）
   - 或者选择 "None" 然后：
     - Build command: `npm run build`
     - Build output directory: `dist`
   - **Deploy command**: **留空**（不要填任何东西）
   - Node version: **20**

5. **保存并部署**

## 部署前准备

项目已经配置好所有 Cloudflare Pages 部署所需的文件：

- ✅ `public/_redirects` - SPA 路由重定向配置
- ✅ `public/_headers` - HTTP 头配置
- ✅ `vite.config.ts` - 构建配置优化
- ✅ `.nvmrc` - Node.js 版本指定（Node.js 20）
- ✅ `package.json` - 包含构建脚本和引擎要求
- ✅ `cloudflare.json` - Cloudflare Pages 配置文件

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
   - **Deploy command**: **必须留空**（不要填任何内容）
   
   ⚠️ **关键检查项**：
   - ✅ 确保选择的是 **Pages** 而不是 **Workers**
   - ✅ **Deploy command** 字段必须完全为空
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
1. **在 Cloudflare Dashboard 中修复**：
   - Settings → Builds & deployments
   - 找到 "Deploy command" 字段
   - **完全清空这个字段**（删除所有内容）
   - 只保留 "Build command": `npm run build`
2. **检查项目类型**：
   - Settings → General
   - 确保项目类型是 **Pages**，不是 **Workers**
3. **如果还是不行**：
   - 删除项目重新创建
   - 确保选择 **Pages** 而不是 **Workers**

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
