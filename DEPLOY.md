# Cloudflare Pages 部署指南

## 部署方式

### 方式一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 登录你的账户

2. **创建新项目**
   - 进入 **Pages** 页面
   - 点击 **Create a project**
   - 选择 **Connect to Git**（如果使用 Git）或 **Upload assets**（直接上传）

3. **连接 Git 仓库（推荐）**
   - 选择你的 Git 提供商（GitHub、GitLab 等）
   - 授权 Cloudflare 访问你的仓库
   - 选择 `Timora` 仓库
   - 选择分支（通常是 `main` 或 `master`）

4. **配置构建设置**
   - **Framework preset**: 选择 `Vite` 或 `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`（留空或填写 `/`）
   - **⚠️ 重要：Node.js 版本设置**
     - 在 **Environment variables** 部分添加环境变量
     - 变量名：`NODE_VERSION`
     - 变量值：`20`
     - 或者使用 `.nvmrc` 文件（项目已包含）

5. **环境变量（必需）**
   - **必须添加**：`NODE_VERSION=20`（Wrangler 需要 Node.js v20+）
   - 其他环境变量根据需要添加

6. **保存并部署**
   - 点击 **Save and Deploy**
   - Cloudflare 会自动构建并部署你的应用

### 方式二：使用 Wrangler CLI

**⚠️ 重要：Wrangler 需要 Node.js v20.0.0 或更高版本**

**注意**：Cloudflare Pages 项目不需要 `wrangler.toml` 文件。如果存在该文件，请删除它以避免部署错误。

1. **检查 Node.js 版本**
   ```bash
   node --version
   ```
   如果版本低于 v20，请先升级 Node.js（见下方说明）

2. **确保没有 wrangler.toml 文件**
   ```bash
   # 如果存在，删除它（Cloudflare Pages 不需要）
   rm wrangler.toml
   ```

3. **安装 Wrangler**
   ```bash
   npm install -g wrangler
   ```

4. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

5. **创建 Pages 项目**（如果还没有）
   ```bash
   wrangler pages project create timora
   ```

6. **部署**
   ```bash
   # 先构建
   npm run build
   
   # 然后部署
   wrangler pages deploy dist --project-name=timora
   ```

**升级 Node.js 的方法：**

- **使用 nvm（推荐）**：
  ```bash
  # 安装 nvm（如果还没有）
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  
  # 安装并使用 Node.js 20
  nvm install 20
  nvm use 20
  
  # 或者使用项目中的 .nvmrc 文件
  nvm use
  ```

- **使用 Volta**：
  ```bash
  volta install node@20
  ```

- **直接下载**：从 https://nodejs.org/ 下载 Node.js v20 LTS

### 方式三：通过 GitHub Actions 自动部署

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
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: timora
          directory: dist
```

## 配置说明

### 构建配置

项目已配置好以下内容：

- **构建命令**: `npm run build`
- **输出目录**: `dist`
- **SPA 路由**: 通过 `public/_redirects` 文件配置，所有路由都重定向到 `index.html`

### 重要文件

1. **`vite.config.ts`**
   - 配置了构建输出目录为 `dist`
   - 优化了代码分割

2. **`public/_redirects`**
   - 配置了 SPA 路由重定向规则
   - 确保所有路由都能正确访问

3. **`cloudflare-pages.json`**（可选）
   - Cloudflare Pages 的配置文件
   - 可以在 Dashboard 中手动配置，也可以使用此文件

### 自定义域名

部署后，你可以：

1. 在 Cloudflare Pages Dashboard 中
2. 进入你的项目设置
3. 在 **Custom domains** 部分添加你的域名
4. Cloudflare 会自动配置 DNS 和 SSL 证书

## 验证部署

部署完成后：

1. 访问 Cloudflare 提供的默认域名（格式：`your-project.pages.dev`）
2. 测试所有路由是否正常工作：
   - `/` - 日历视图
   - `/tasks` - 今日任务
   - `/timer` - 专注计时
   - `/tracker` - 时间追踪
   - `/assignment` - 任务分配
   - `/stats` - 工时统计

## 常见问题

### 1. 路由 404 错误

确保 `public/_redirects` 文件存在且内容正确：
```
/*    /index.html   200
```

### 2. 构建失败 / Node.js 版本错误

**错误信息**：`Wrangler requires at least Node.js v20.0.0`

**解决方案**：
- **在 Cloudflare Dashboard 中**：
  - 进入项目设置 → **Environment variables**
  - 添加 `NODE_VERSION=20`
  - 重新部署

- **使用 Wrangler CLI 时**：
  - 升级本地 Node.js 到 v20+
  - 使用 nvm：`nvm install 20 && nvm use 20`
  - 或使用项目中的 `.nvmrc`：`nvm use`

- **检查 Node.js 版本**：
  - 确保所有依赖都已正确安装
  - 查看 Cloudflare 构建日志中的错误信息

### 3. wrangler.toml 配置错误

**错误信息**：`The entry-point file at "workers-site/index.js" was not found` 或 `Because you've defined a [site] configuration`

**原因**：`wrangler.toml` 文件是为 Cloudflare Workers 设计的，Cloudflare Pages 不需要它。

**解决方案**：
- **删除 `wrangler.toml` 文件**（推荐）
  ```bash
  rm wrangler.toml
  ```
- Cloudflare Pages 使用 `cloudflare-pages.json` 或 Dashboard 配置，不需要 `wrangler.toml`

### 3. 静态资源加载失败

- 确保 `vite.config.ts` 中 `base` 设置为 `/`
- 检查构建输出目录是否为 `dist`

### 4. 环境变量

如果需要环境变量：
- 在 Cloudflare Dashboard 的 Environment variables 中设置
- 在代码中使用 `import.meta.env.VITE_*` 访问

## 更新部署

每次推送到主分支后，Cloudflare Pages 会自动：
1. 检测到新的提交
2. 运行构建命令
3. 部署新版本

你也可以在 Dashboard 中手动触发重新部署。
