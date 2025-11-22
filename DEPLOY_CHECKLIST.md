# Cloudflare Pages 部署检查清单 ✅

## 部署前必须检查的项目

### ✅ 1. 项目配置
- [x] `wrangler.jsonc` 文件已创建（明确指定这是 Pages 项目）
- [x] `cloudflare-pages.json` 文件存在
- [x] `public/_redirects` 文件存在且内容正确
- [x] `vite.config.ts` 中 `base` 设置为 `/`
- [x] `.nvmrc` 文件指定 Node.js 20
- [x] `package.json` 中 `engines` 指定 Node.js >= 20

### ✅ 2. 本地构建测试
```bash
# 1. 检查 Node.js 版本
node --version  # 应该是 v20.x.x

# 2. 安装依赖
npm install

# 3. 构建项目
npm run build

# 4. 检查 dist 目录
ls -la dist/
# 应该看到：
# - index.html
# - _redirects
# - assets/ 目录
```

### ✅ 3. Cloudflare Dashboard 配置

**重要：确保在 Pages 部分创建项目，不是 Workers！**

1. **项目创建**
   - [ ] 在 **Pages** 部分创建项目（不是 Workers）
   - [ ] 项目名称：`timora`（或你选择的名字）

2. **构建设置**
   - [ ] Framework preset: `Vite`（⚠️ 不要选择 Workers）
   - [ ] Build command: `npm run build`
   - [ ] Build output directory: `dist`
   - [ ] Root directory: `/`（留空）

3. **环境变量（必需）**
   - [ ] `NODE_VERSION=20`

4. **保存并部署**
   - [ ] 点击 **Save and Deploy**

## 部署后验证

### ✅ 1. 基本检查
- [ ] 部署成功（没有错误）
- [ ] 可以访问默认域名（`your-project.pages.dev`）

### ✅ 2. 路由测试
访问以下路由，确保都能正常加载：
- [ ] `/` - 日历视图
- [ ] `/tasks` - 今日任务
- [ ] `/timer` - 专注计时
- [ ] `/tracker` - 时间追踪
- [ ] `/assignment` - 任务分配
- [ ] `/stats` - 工时统计

### ✅ 3. 功能测试
- [ ] 页面刷新不会出现 404
- [ ] 所有组件正常显示
- [ ] 交互功能正常

## 如果部署失败

### 错误 1: Node.js 版本错误
**解决**：在 Dashboard 环境变量中添加 `NODE_VERSION=20`

### 错误 2: wrangler 部署命令错误
**解决**：
1. 确保在 **Pages** 部分创建项目（不是 Workers）
2. Framework preset 选择 `Vite`
3. 检查 `wrangler.jsonc` 文件是否存在

### 错误 3: 路由 404
**解决**：检查 `dist/_redirects` 文件是否存在且内容为 `/*    /index.html   200`

## 快速部署命令（CLI）

如果使用 Wrangler CLI：

```bash
# 1. 确保 Node.js 版本正确
node --version  # 应该是 v20.x.x

# 2. 构建
npm run build

# 3. 部署（使用 pages deploy，不是 deploy）
wrangler pages deploy dist --project-name=timora
```

## 配置文件说明

- `wrangler.jsonc` - 明确指定这是 Pages 项目（已创建）
- `cloudflare-pages.json` - Cloudflare Pages 配置
- `public/_redirects` - SPA 路由重定向规则
- `.nvmrc` - Node.js 版本指定

## 完成 ✅

如果所有检查项都通过，部署应该成功！

