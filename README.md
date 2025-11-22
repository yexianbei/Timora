# Timora - 企业日程管理软件

一款面向企业的任务与日程管理工具，集成了日历视图、时间追踪、任务分配和工时统计功能。

## 功能特性

- 📅 **月视图日历** - 类似苹果日历的日历视图，支持任务展示
- ✅ **今日任务** - 查看和管理当天的任务
- ⏱️ **专注计时器** - 支持暂停、继续、重置的番茄钟功能
- ⏰ **时间追踪** - 类似 Clockify 的时间记录功能
- 👥 **任务分配** - 将任务分配给不同员工
- 📊 **工时统计** - 项目工时统计 Dashboard

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **TailwindCSS** - 样式框架（选择理由：轻量、灵活、移动端友好、开发效率高）
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **React Router** - 路由管理
- **date-fns** - 日期处理
- **lucide-react** - 图标库

## 项目结构

```
Timora/
├── src/
│   ├── components/          # 组件目录
│   │   ├── Calendar/        # 日历组件
│   │   │   └── MonthCalendar.tsx
│   │   ├── Task/            # 任务组件
│   │   │   └── TodayTasks.tsx
│   │   ├── Timer/           # 计时器组件
│   │   │   ├── FocusTimer.tsx
│   │   │   └── TimeTracker.tsx
│   │   ├── Employee/        # 员工组件
│   │   │   └── TaskAssignment.tsx
│   │   └── Project/          # 项目组件
│   │       └── TimeStatsDashboard.tsx
│   ├── store/               # 状态管理
│   │   └── useStore.ts
│   ├── types/               # 类型定义
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   │   ├── dateUtils.ts
│   │   └── demoData.ts
│   ├── App.tsx              # 主应用
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── public/                  # 静态资源
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 系统要求

- **Node.js**: >= 20.0.0（必需，Wrangler 要求）
- **npm**: >= 9.0.0

> ⚠️ **重要**：如果使用 Wrangler CLI 部署，必须使用 Node.js v20 或更高版本。
> 查看 [NODE_VERSION.md](./NODE_VERSION.md) 了解如何升级 Node.js。

## 安装与运行

### 1. 检查 Node.js 版本

```bash
node --version  # 应该显示 v20.x.x 或更高
```

如果版本低于 v20，请先升级（见 [NODE_VERSION.md](./NODE_VERSION.md)）。

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 3. 构建生产版本

```bash
npm run build
```

构建输出将在 `dist` 目录中。

## 部署到 Cloudflare Pages

项目已配置好 Cloudflare Pages 部署。详细部署指南请查看 [DEPLOY.md](./DEPLOY.md)。

### 快速部署步骤

1. **通过 Cloudflare Dashboard**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 **Pages** → **Create a project**
   - 连接你的 Git 仓库
   - 配置构建设置：
     - Build command: `npm run build`
     - Build output directory: `dist`
     - Framework preset: `Vite`
   - 点击 **Save and Deploy**

2. **使用 Wrangler CLI**
   ```bash
   npm install -g wrangler
   wrangler login
   npm run build
   wrangler pages deploy dist --project-name=timora
   ```

### 重要配置

- ✅ `public/_redirects` - 配置 SPA 路由重定向
- ✅ `vite.config.ts` - 已配置构建输出目录
- ✅ `cloudflare-pages.json` - Cloudflare Pages 配置文件（可选）

## 组件使用说明

### 月视图日历组件

```tsx
import { MonthCalendar } from './components/Calendar/MonthCalendar';

<MonthCalendar
  onDateClick={(date) => console.log('Date clicked:', date)}
  onEventClick={(event) => console.log('Event clicked:', event)}
/>
```

### 今日任务组件

```tsx
import { TodayTasks } from './components/Task/TodayTasks';

<TodayTasks />
```

### 专注计时器组件

```tsx
import { FocusTimer } from './components/Timer/FocusTimer';

<FocusTimer
  taskId="task-1"
  onComplete={(duration) => console.log('Completed:', duration)}
/>
```

### 时间追踪组件

```tsx
import { TimeTracker } from './components/Timer/TimeTracker';

<TimeTracker taskId="task-1" />
```

### 任务分配组件

```tsx
import { TaskAssignment } from './components/Employee/TaskAssignment';

<TaskAssignment />
```

### 工时统计 Dashboard

```tsx
import { TimeStatsDashboard } from './components/Project/TimeStatsDashboard';

<TimeStatsDashboard />
```

## 数据管理

应用使用 Zustand 进行状态管理，所有数据存储在 `useStore` 中。组件会自动从 store 中读取数据并更新 UI。

### 添加任务

```tsx
import { useStore } from './store/useStore';

const { addTask } = useStore();

addTask({
  id: 'task-1',
  title: '新任务',
  priority: 'high',
  status: 'todo',
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### 更新任务

```tsx
const { updateTask } = useStore();

updateTask('task-1', { status: 'completed' });
```

## 移动端适配

所有组件都使用 TailwindCSS 的响应式类，支持移动端自适配：
- 使用 `md:` 前缀定义中等屏幕及以上样式
- 使用 `flex-wrap` 和 `grid` 实现响应式布局
- 导航栏在小屏幕上自动横向滚动

## 后续迭代建议

- 添加拖拽排序功能（使用 react-beautiful-dnd 或 @dnd-kit）
- 实现日历左右滑动切换月份
- 添加任务详情弹窗
- 实现数据持久化（localStorage 或后端 API）
- 添加用户认证
- 实现实时协作功能

## 许可证

MIT

