import { useMemo } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { CheckCircle2, Circle, Clock, User, Flag } from 'lucide-react';
import { Task, TaskPriority } from '../../types';
import { useStore } from '../../store/useStore';

export const TodayTasks: React.FC = () => {
  const { tasks, employees, projects } = useStore();

  // 获取今天的任务
  const todayTasks = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return format(task.dueDate, 'yyyy-MM-dd') === today;
    });
  }, [tasks]);

  // 按优先级和状态排序
  const sortedTasks = useMemo(() => {
    const priorityOrder: Record<TaskPriority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...todayTasks].sort((a, b) => {
      // 先按状态排序（进行中 > 待办 > 已完成）
      const statusOrder: Record<string, number> = {
        'in-progress': 3,
        'todo': 2,
        'completed': 1,
        'cancelled': 0,
      };
      const statusDiff = statusOrder[b.status] - statusOrder[a.status];
      if (statusDiff !== 0) return statusDiff;

      // 再按优先级排序
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [todayTasks]);

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return '紧急';
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    useStore.getState().updateTask(taskId, { status: newStatus });
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">今天没有任务</p>
        <p className="text-gray-400 text-sm mt-2">好好休息一下吧！</p>
      </div>
    );
  }

  const completedCount = sortedTasks.filter((t) => t.status === 'completed').length;
  const progress = (completedCount / sortedTasks.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">今日任务</h2>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(), 'yyyy年M月d日 EEEE', { locale: zhCN })}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {completedCount}/{sortedTasks.length}
          </div>
          <div className="text-sm text-gray-500">已完成</div>
        </div>
      </div>

      {/* 进度条 */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-3">
        {sortedTasks.map((task) => {
          const employee = employees.find((e) => e.id === task.assignedTo);
          const project = projects.find((p) => p.id === task.projectId);
          const isCompleted = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`
                border rounded-lg p-4 transition-all
                ${isCompleted ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-primary-300'}
              `}
            >
              <div className="flex items-start gap-3">
                {/* 完成按钮 */}
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-primary-500" />
                  )}
                </button>

                {/* 任务内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`
                        font-medium text-gray-900
                        ${isCompleted ? 'line-through text-gray-500' : ''}
                      `}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`
                        px-2 py-1 text-xs font-medium rounded
                        ${getPriorityColor(task.priority)}
                        flex-shrink-0
                      `}
                    >
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>

                  {task.description && (
                    <p
                      className={`
                        text-sm text-gray-600 mt-1
                        ${isCompleted ? 'line-through' : ''}
                      `}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* 任务元信息 */}
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    {project && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span>{project.name}</span>
                      </div>
                    )}

                    {employee && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{employee.name}</span>
                      </div>
                    )}

                    {task.estimatedHours && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{task.estimatedHours} 小时</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

