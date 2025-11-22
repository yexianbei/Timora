// 任务优先级
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// 任务状态
export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';

// 任务
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId?: string;
  assignedTo?: string; // 员工ID
  dueDate?: Date;
  estimatedHours?: number; // 预估工时
  createdAt: Date;
  updatedAt: Date;
}

// 项目
export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string; // 用于日历显示的颜色
  createdAt: Date;
}

// 员工
export interface Employee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

// 时间记录
export interface TimeEntry {
  id: string;
  taskId: string;
  projectId?: string;
  employeeId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // 秒数
  description?: string;
  createdAt: Date;
}

// 日历事件（用于日历视图）
export interface CalendarEvent {
  id: string;
  taskId: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  projectId?: string;
  priority: TaskPriority;
}

// 计时器状态
export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  currentTaskId?: string;
  startTime?: Date;
}

// 项目工时统计
export interface ProjectTimeStats {
  projectId: string;
  projectName: string;
  totalHours: number;
  taskCount: number;
  employeeHours: Record<string, number>; // 员工ID -> 工时
}

