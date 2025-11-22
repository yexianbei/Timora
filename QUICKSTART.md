# 快速开始指南

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动，浏览器会自动打开。

## 功能页面

应用包含以下页面，可通过顶部导航栏切换：

1. **日历** (`/`) - 月视图日历，显示所有任务的截止日期
2. **今日任务** (`/tasks`) - 查看和管理当天的任务
3. **专注计时** (`/timer`) - 番茄钟计时器
4. **时间追踪** (`/tracker`) - 类似 Clockify 的时间记录功能
5. **任务分配** (`/assignment`) - 将任务分配给员工
6. **工时统计** (`/stats`) - 项目工时统计 Dashboard

## 组件使用示例

### 在项目中使用日历组件

```tsx
import { MonthCalendar } from './components/Calendar/MonthCalendar';

function MyPage() {
  return (
    <MonthCalendar
      onDateClick={(date) => {
        console.log('点击了日期:', date);
      }}
      onEventClick={(event) => {
        console.log('点击了事件:', event);
      }}
    />
  );
}
```

### 在项目中使用今日任务组件

```tsx
import { TodayTasks } from './components/Task/TodayTasks';

function MyPage() {
  return <TodayTasks />;
}
```

### 在项目中使用计时器组件

```tsx
import { FocusTimer } from './components/Timer/FocusTimer';

function MyPage() {
  return (
    <FocusTimer
      taskId="task-1"
      onComplete={(duration) => {
        console.log('计时完成，时长:', duration, '秒');
      }}
    />
  );
}
```

### 在项目中使用时间追踪组件

```tsx
import { TimeTracker } from './components/Timer/TimeTracker';

function MyPage() {
  return <TimeTracker taskId="task-1" />;
}
```

### 在项目中使用任务分配组件

```tsx
import { TaskAssignment } from './components/Employee/TaskAssignment';

function MyPage() {
  return <TaskAssignment />;
}
```

### 在项目中使用工时统计组件

```tsx
import { TimeStatsDashboard } from './components/Project/TimeStatsDashboard';

function MyPage() {
  return <TimeStatsDashboard />;
}
```

## 数据管理

### 添加任务

```tsx
import { useStore } from './store/useStore';

const { addTask } = useStore();

addTask({
  id: `task-${Date.now()}`,
  title: '新任务',
  description: '任务描述',
  priority: 'high',
  status: 'todo',
  projectId: 'project-1',
  assignedTo: 'emp-1',
  dueDate: new Date('2024-12-31'),
  estimatedHours: 8,
  createdAt: new Date(),
  updatedAt: new Date(),
});
```

### 更新任务

```tsx
const { updateTask } = useStore();

// 更新任务状态
updateTask('task-1', { status: 'completed' });

// 更新任务优先级
updateTask('task-1', { priority: 'urgent' });

// 更新任务分配
updateTask('task-1', { assignedTo: 'emp-2' });
```

### 添加项目

```tsx
const { addProject } = useStore();

addProject({
  id: `project-${Date.now()}`,
  name: '新项目',
  description: '项目描述',
  color: '#3b82f6',
  createdAt: new Date(),
});
```

### 添加员工

```tsx
const { addEmployee } = useStore();

addEmployee({
  id: `emp-${Date.now()}`,
  name: '新员工',
  email: 'employee@example.com',
  role: '前端开发',
});
```

## 自定义样式

所有组件使用 TailwindCSS，你可以通过以下方式自定义：

1. 修改 `tailwind.config.js` 中的主题配置
2. 在组件中直接使用 Tailwind 类名
3. 在 `src/index.css` 中添加全局样式

## 移动端适配

所有组件已经支持移动端响应式设计：
- 使用 `md:` 前缀定义中等屏幕及以上样式
- 导航栏在小屏幕上自动横向滚动
- 表格和列表自动适配小屏幕

## 下一步

- 查看 `README.md` 了解完整功能
- 查看组件源码了解实现细节
- 根据需求自定义组件样式和功能

