# 故障排除指南

## 常见部署错误及解决方案

### 1. Node.js 版本错误

**错误信息**：
```
Wrangler requires at least Node.js v20.0.0. You are using v18.x.x
```

**解决方案**：
- **Cloudflare Dashboard**：在环境变量中添加 `NODE_VERSION=20`
- **本地 Wrangler CLI**：升级 Node.js 到 v20+
  ```bash
  nvm install 20
  nvm use 20
  ```

详细说明请查看 [NODE_VERSION.md](./NODE_VERSION.md)。

---

### 2. wrangler 部署命令错误

**错误信息**：
```
If are uploading a directory of assets, you can either:
- Specify the path to the directory of assets via the command line
- Or create a "wrangler.jsonc" file containing...
```

**原因**：
- Cloudflare 构建系统误认为这是 Workers 项目
- 使用了错误的部署命令或配置

**解决方案**：

**方案 A：在 Dashboard 中正确配置（推荐）**
1. 确保在 **Pages** 部分创建项目（不是 Workers）
2. Framework preset 选择 `Vite`
3. 构建命令：`npm run build`
4. 输出目录：`dist`
5. 环境变量：`NODE_VERSION=20`

**方案 B：检查 wrangler.jsonc 文件**
- 项目已包含 `wrangler.jsonc` 文件
- 确保文件内容正确（已自动配置）

**方案 C：使用正确的 CLI 命令**
```bash
# 错误：wrangler deploy（这是 Workers 命令）
# 正确：wrangler pages deploy（这是 Pages 命令）
wrangler pages deploy dist --project-name=timora
```

**说明**：
- Cloudflare Pages 和 Workers 是不同的产品
- Pages 使用 `wrangler pages deploy`
- Workers 使用 `wrangler deploy`
- 项目已配置 `wrangler.jsonc` 来明确这是 Pages 项目

---

### 3. 路由返回 404

**错误信息**：访问 `/tasks`、`/timer` 等路由时返回 404

**原因**：SPA 路由没有正确配置

**解决方案**：
1. 确保 `public/_redirects` 文件存在
2. 文件内容应该是：
   ```
   /*    /index.html   200
   ```
3. 重新构建并部署：
   ```bash
   npm run build
   # 检查 dist/_redirects 文件是否存在
   ```

---

### 4. 构建失败

**错误信息**：构建过程中出现 TypeScript 或依赖错误

**解决方案**：
1. 清理并重新安装依赖：
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. 检查 Node.js 版本：
   ```bash
   node --version  # 应该是 v20.x.x
   ```
3. 本地测试构建：
   ```bash
   npm run build
   ```
4. 查看 Cloudflare 构建日志中的详细错误信息

---

### 5. 静态资源加载失败

**错误信息**：CSS 或 JS 文件无法加载

**解决方案**：
1. 检查 `vite.config.ts` 中 `base` 设置为 `/`：
   ```typescript
   export default defineConfig({
     base: '/',
     // ...
   })
   ```
2. 确保构建输出目录正确（`dist`）
3. 检查 `dist` 目录中的 `index.html` 文件，资源路径应该是相对路径

---

### 6. GitHub Actions 部署失败

**错误信息**：GitHub Actions 工作流失败

**解决方案**：
1. 检查 Secrets 是否正确设置：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
2. 检查项目名称是否匹配：
   - 在 `.github/workflows/deploy.yml` 中的 `projectName`
   - 在 Cloudflare Dashboard 中的项目名称
3. 查看 GitHub Actions 日志获取详细错误信息

---

## 快速检查清单

部署前请确认：

- [ ] Node.js 版本 >= 20.0.0
- [ ] 已删除 `wrangler.toml` 文件（如果存在）
- [ ] `public/_redirects` 文件存在且内容正确
- [ ] 本地构建成功：`npm run build`
- [ ] `dist` 目录已生成
- [ ] 在 Cloudflare Dashboard 中设置了 `NODE_VERSION=20` 环境变量

## 获取帮助

如果以上解决方案都无法解决问题：

1. 查看 Cloudflare 构建日志中的详细错误信息
2. 检查 [DEPLOY.md](./DEPLOY.md) 中的详细部署步骤
3. 查看 [NODE_VERSION.md](./NODE_VERSION.md) 了解 Node.js 版本要求
4. 查看 Cloudflare Pages 文档：https://developers.cloudflare.com/pages/

