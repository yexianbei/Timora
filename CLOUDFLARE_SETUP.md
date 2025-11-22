# Cloudflare Pages 配置完成 ✅

项目已完全配置好，可以部署到 Cloudflare Pages。

## ✅ 已完成的配置

### 1. 构建配置
- ✅ `vite.config.ts` - 已配置构建输出目录为 `dist`
- ✅ 代码分割优化（react-vendor, utils-vendor）
- ✅ 构建测试通过

### 2. SPA 路由配置
- ✅ `public/_redirects` - 配置了所有路由重定向到 `index.html`
  ```
  /*    /index.html   200
  ```

### 3. Cloudflare Pages 配置文件
- ✅ `cloudflare-pages.json` - Cloudflare Pages 配置文件
- ✅ `.cloudflare/cloudflare-pages.json` - 备用配置文件
- ✅ `wrangler.jsonc` - 明确指定这是 Pages 项目（不是 Workers）

### 4. GitHub Actions 自动部署
- ✅ `.github/workflows/deploy.yml` - 自动部署工作流
- ✅ `.github/workflows/README.md` - 工作流使用说明

### 5. 文档
- ✅ `DEPLOY.md` - 详细部署指南
- ✅ `README.md` - 已添加部署说明

## ⚠️ Node.js 版本要求

**重要**：Wrangler 和 Cloudflare Pages 需要 Node.js v20.0.0 或更高版本。

- 如果使用 Wrangler CLI，请先升级本地 Node.js 到 v20+
- 在 Cloudflare Dashboard 中，必须在环境变量中设置 `NODE_VERSION=20`

详细说明请查看 [NODE_VERSION.md](./NODE_VERSION.md)。

## 🚀 快速部署

### 方式一：通过 Cloudflare Dashboard（最简单）

1. 访问 https://dash.cloudflare.com/
2. 进入 **Pages** → **Create a project**
3. 选择 **Connect to Git**
4. 选择你的仓库
5. 配置构建设置：
   - **Framework preset**: `Vite`（⚠️ 重要：选择 Vite，不要选择 Workers）
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`（留空）
   - **⚠️ 确保这是 Pages 项目，不是 Workers 项目**
6. **⚠️ 重要：设置 Node.js 版本**
   - 在 **Environment variables** 部分
   - 添加变量：`NODE_VERSION=20`
7. 点击 **Save and Deploy**

### 方式二：使用 Wrangler CLI

**⚠️ 必须先升级 Node.js 到 v20+**

```bash
# 1. 检查并升级 Node.js（如果需要）
node --version  # 应该显示 v20.x.x
# 如果版本低于 v20，使用 nvm 升级：
nvm install 20
nvm use 20

# 2. 删除 wrangler.toml（如果存在）
# Cloudflare Pages 不需要这个文件，它会导致部署错误
rm wrangler.toml

# 3. 安装 Wrangler
npm install -g wrangler

# 4. 登录
wrangler login

# 5. 构建
npm run build

# 6. 部署
wrangler pages deploy dist --project-name=timora
```

### 方式三：GitHub Actions 自动部署

1. 在 GitHub 仓库中添加 Secrets：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. 推送代码到 `main` 分支
3. GitHub Actions 会自动构建并部署

## 📋 部署检查清单

部署前确认：
- [ ] **Node.js 版本 >= 20.0.0**（使用 Wrangler CLI 时必需）
- [ ] 代码已推送到 Git 仓库
- [ ] 本地构建成功（`npm run build`）
- [ ] `dist` 目录已生成
- [ ] `public/_redirects` 文件存在
- [ ] 在 Cloudflare Dashboard 中设置了 `NODE_VERSION=20` 环境变量

部署后验证：
- [ ] 访问默认域名（`your-project.pages.dev`）
- [ ] 测试所有路由：
  - [ ] `/` - 日历视图
  - [ ] `/tasks` - 今日任务
  - [ ] `/timer` - 专注计时
  - [ ] `/tracker` - 时间追踪
  - [ ] `/assignment` - 任务分配
  - [ ] `/stats` - 工时统计
- [ ] 刷新页面不会出现 404

## 🔧 常见问题

### 问题 1: 路由返回 404
**解决方案**: 确保 `public/_redirects` 文件存在且内容为 `/*    /index.html   200`

### 问题 2: 构建失败 / Node.js 版本错误
**错误信息**：`Wrangler requires at least Node.js v20.0.0. You are using v18.x.x`

**解决方案**: 
- **使用 Wrangler CLI**：升级本地 Node.js 到 v20+
  ```bash
  nvm install 20
  nvm use 20
  ```
- **Cloudflare Dashboard**：在环境变量中设置 `NODE_VERSION=20`
- 查看 [NODE_VERSION.md](./NODE_VERSION.md) 了解详细步骤

### 问题 3: wrangler 部署命令错误
**错误信息**：`If are uploading a directory of assets, you can either...`

**原因**：Cloudflare 误认为这是 Workers 项目

**解决方案**: 
1. **在 Dashboard 中**：
   - 确保在 **Pages** 部分创建项目（不是 Workers）
   - Framework preset 选择 `Vite`
   - 重新部署

2. **使用 CLI 时**：
   - 使用 `wrangler pages deploy`，不是 `wrangler deploy`
   ```bash
   wrangler pages deploy dist --project-name=timora
   ```

3. **检查配置文件**：
   - 项目已包含 `wrangler.jsonc` 文件，明确指定这是 Pages 项目

### 问题 4: 静态资源加载失败
**解决方案**: 确保 `vite.config.ts` 中 `base` 设置为 `/`

## 📚 相关文档

- [DEPLOY.md](./DEPLOY.md) - 详细部署指南
- [NODE_VERSION.md](./NODE_VERSION.md) - **Node.js 版本要求和升级指南** ⚠️
- [README.md](./README.md) - 项目说明
- [.github/workflows/README.md](./.github/workflows/README.md) - GitHub Actions 说明

## 🎉 完成！

配置已完成，可以开始部署了！

