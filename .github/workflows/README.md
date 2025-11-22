# GitHub Actions 工作流

## 自动部署到 Cloudflare Pages

此工作流会在推送到 `main` 或 `master` 分支时自动构建并部署到 Cloudflare Pages。

### 设置步骤

1. **获取 Cloudflare API Token**
   - 访问 https://dash.cloudflare.com/profile/api-tokens
   - 点击 **Create Token**
   - 使用 **Edit Cloudflare Workers** 模板
   - 或者自定义权限：
     - Account: Cloudflare Pages: Edit
     - Zone: 如果需要自定义域名
   - 复制生成的 Token

2. **获取 Account ID**
   - 访问 https://dash.cloudflare.com/
   - 在右侧边栏找到 **Account ID**
   - 复制 Account ID

3. **在 GitHub 仓库中添加 Secrets**
   - 进入你的 GitHub 仓库
   - 点击 **Settings** → **Secrets and variables** → **Actions**
   - 添加以下 Secrets：
     - `CLOUDFLARE_API_TOKEN`: 你的 API Token
     - `CLOUDFLARE_ACCOUNT_ID`: 你的 Account ID

4. **创建 Cloudflare Pages 项目**
   - 在 Cloudflare Dashboard 中创建名为 `timora` 的项目
   - 或者修改 `.github/workflows/deploy.yml` 中的 `projectName`

### 手动触发

你也可以在 GitHub Actions 页面手动触发工作流。

### 注意事项

- 确保 Cloudflare Pages 项目名称与工作流中的 `projectName` 一致
- 首次部署前需要在 Cloudflare Dashboard 中创建项目
- 如果项目名称不同，修改 `.github/workflows/deploy.yml` 中的 `projectName` 字段

