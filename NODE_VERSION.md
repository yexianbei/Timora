# Node.js 版本要求

## ⚠️ 重要提示

**Wrangler 和 Cloudflare Pages 需要 Node.js v20.0.0 或更高版本**

当前项目要求：
- **Node.js**: >= 20.0.0
- **npm**: >= 9.0.0

## 检查当前版本

```bash
node --version
npm --version
```

## 升级 Node.js

### 方法一：使用 nvm（推荐）

1. **安装 nvm**（如果还没有）：
   ```bash
   # macOS/Linux
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # 或使用 Homebrew (macOS)
   brew install nvm
   ```

2. **安装并使用 Node.js 20**：
   ```bash
   # 安装 Node.js 20
   nvm install 20
   
   # 使用 Node.js 20
   nvm use 20
   
   # 设置为默认版本
   nvm alias default 20
   
   # 或者直接使用项目中的 .nvmrc 文件
   nvm use
   ```

3. **验证**：
   ```bash
   node --version  # 应该显示 v20.x.x
   ```

### 方法二：使用 Volta

1. **安装 Volta**：
   ```bash
   curl https://get.volta.sh | bash
   ```

2. **安装 Node.js 20**：
   ```bash
   volta install node@20
   ```

### 方法三：直接下载安装

1. 访问 https://nodejs.org/
2. 下载 Node.js v20 LTS 版本
3. 按照安装向导完成安装

## Cloudflare Pages 配置

### 在 Cloudflare Dashboard 中设置

1. 进入你的 Cloudflare Pages 项目
2. 点击 **Settings** → **Environment variables**
3. 添加环境变量：
   - **Variable name**: `NODE_VERSION`
   - **Value**: `20`
4. 保存并重新部署

### 使用 .nvmrc 文件

项目已包含 `.nvmrc` 文件，Cloudflare Pages 会自动识别并使用 Node.js 20。

## 验证配置

### 本地验证

```bash
# 使用项目指定的 Node.js 版本
nvm use

# 验证版本
node --version  # 应该显示 v20.x.x

# 安装依赖
npm install

# 构建项目
npm run build
```

### Cloudflare Pages 验证

1. 查看构建日志
2. 确认显示：`Using Node.js version 20.x.x`
3. 如果显示错误，检查环境变量设置

## 常见问题

### Q: 为什么需要 Node.js 20？

A: Wrangler（Cloudflare 的 CLI 工具）要求 Node.js v20.0.0 或更高版本才能正常工作。

### Q: 我可以在本地使用 Node.js 18 吗？

A: 可以，但部署到 Cloudflare Pages 时必须在环境变量中设置 `NODE_VERSION=20`。

### Q: 如何在不同项目间切换 Node.js 版本？

A: 使用 nvm：
```bash
# 切换到 Node.js 20（当前项目）
nvm use 20

# 切换到其他版本
nvm use 18

# 查看已安装的版本
nvm list
```

## 相关文件

- `.nvmrc` - 指定 Node.js 版本为 20
- `package.json` - 包含 `engines` 字段指定版本要求
- `cloudflare-pages.json` - Cloudflare Pages 配置文件

