import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calendar, CheckSquare, Clock, Users, BarChart3, Timer } from 'lucide-react';
import { MonthCalendar } from './components/Calendar/MonthCalendar';
import { TodayTasks } from './components/Task/TodayTasks';
import { FocusTimer } from './components/Timer/FocusTimer';
import { TimeTracker } from './components/Timer/TimeTracker';
import { TaskAssignment } from './components/Employee/TaskAssignment';
import { TimeStatsDashboard } from './components/Project/TimeStatsDashboard';
import { useStore } from './store/useStore';
import { demoProjects, demoEmployees, demoTasks } from './utils/demoData';

// 导航组件
const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Calendar, label: '日历', exact: true },
    { path: '/tasks', icon: CheckSquare, label: '今日任务' },
    { path: '/timer', icon: Timer, label: '专注计时' },
    { path: '/tracker', icon: Clock, label: '时间追踪' },
    { path: '/assignment', icon: Users, label: '任务分配' },
    { path: '/stats', icon: BarChart3, label: '工时统计' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Timora</h1>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

// 主布局
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

// 首页 - 日历视图
const CalendarPage = () => {
  return (
    <Layout>
      <MonthCalendar
        onDateClick={(date) => {
          console.log('Date clicked:', date);
        }}
        onEventClick={(event) => {
          console.log('Event clicked:', event);
        }}
      />
    </Layout>
  );
};

// 今日任务页面
const TasksPage = () => {
  return (
    <Layout>
      <TodayTasks />
    </Layout>
  );
};

// 专注计时页面
const TimerPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <FocusTimer />
      </div>
    </Layout>
  );
};

// 时间追踪页面
const TrackerPage = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <TimeTracker />
      </div>
    </Layout>
  );
};

// 任务分配页面
const AssignmentPage = () => {
  return (
    <Layout>
      <TaskAssignment />
    </Layout>
  );
};

// 工时统计页面
const StatsPage = () => {
  return (
    <Layout>
      <TimeStatsDashboard />
    </Layout>
  );
};

// 初始化数据
const DataInitializer = () => {
  const { projects, employees, tasks, addProject, addEmployee, addTask } = useStore();

  useEffect(() => {
    // 只在数据为空时初始化
    if (projects.length === 0) {
      demoProjects.forEach((project) => addProject(project));
    }
    if (employees.length === 0) {
      demoEmployees.forEach((employee) => addEmployee(employee));
    }
    if (tasks.length === 0) {
      demoTasks.forEach((task) => addTask(task));
    }
  }, [projects.length, employees.length, tasks.length, addProject, addEmployee, addTask]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <DataInitializer />
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/assignment" element={<AssignmentPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

