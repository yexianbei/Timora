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

### 2. wrangler.toml 配置错误

**错误信息**：
```
[WARNING] Because you've defined a [site] configuration, we're defaulting to "workers-site"
[ERROR] The entry-point file at "workers-site/index.js" was not found
```

**原因**：
- `wrangler.toml` 文件是为 Cloudflare Workers 设计的
- Cloudflare Pages 项目不需要这个文件
- 如果存在，Wrangler 会误认为这是一个 Workers 项目

**解决方案**：
```bash
# 删除 wrangler.toml 文件
rm wrangler.toml

# 然后重新部署
npm run build
wrangler pages deploy dist --project-name=timora
```

**说明**：
- Cloudflare Pages 使用 `cloudflare-pages.json` 或 Dashboard 配置
- 不需要 `wrangler.toml` 文件
- 如果以后需要使用 Workers 功能，可以重新创建并正确配置

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

