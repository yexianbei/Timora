import { useState, useEffect } from 'react';
import { Play, Square, Clock, Calendar, User } from 'lucide-react';
import { formatTime, formatHours } from '../../utils/dateUtils';
import { useStore } from '../../store/useStore';

interface TimeTrackerProps {
  taskId?: string;
}

export const TimeTracker: React.FC<TimeTrackerProps> = ({ taskId: initialTaskId }) => {
  const { tasks, projects, employees, timeEntries, startTimer, stopTimer, tickTimer, timer } = useStore();
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTaskId || '');
  const [description, setDescription] = useState('');
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  // 定时器 tick
  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      const id = setInterval(() => {
        tickTimer();
      }, 1000);
      setIntervalId(id);
      return () => {
        if (id) clearInterval(id);
      };
    } else {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [timer.isRunning, timer.isPaused, tickTimer]);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const selectedProject = selectedTask
    ? projects.find((p) => p.id === selectedTask.projectId)
    : null;
  const selectedEmployee = selectedTask
    ? employees.find((e) => e.id === selectedTask.assignedTo)
    : null;

  // 获取该任务的时间记录
  const taskTimeEntries = timeEntries.filter((entry) => entry.taskId === selectedTaskId);
  const totalTaskTime = taskTimeEntries.reduce((sum, entry) => sum + entry.duration, 0);

  const handleStart = () => {
    if (selectedTaskId) {
      startTimer(selectedTaskId);
    }
  };

  const handleStop = () => {
    stopTimer();
    setDescription('');
  };

  const isRunning = timer.isRunning && timer.currentTaskId === selectedTaskId;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">时间追踪</h2>

      {/* 任务选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          选择任务
        </label>
        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          disabled={isRunning}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">请选择任务</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      {/* 任务信息 */}
      {selectedTask && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900">{selectedTask.title}</h3>
            {selectedProject && (
              <div
                className="px-2 py-1 text-xs rounded text-white"
                style={{ backgroundColor: selectedProject.color }}
              >
                {selectedProject.name}
              </div>
            )}
          </div>
          {selectedTask.description && (
            <p className="text-sm text-gray-600 mb-3">{selectedTask.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {selectedEmployee && (
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{selectedEmployee.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>已记录: {formatTime(totalTaskTime)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 描述输入 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          工作描述（可选）
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isRunning}
          placeholder="记录你正在做什么..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />
      </div>

      {/* 计时器显示 */}
      <div className="mb-6 text-center">
        <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
          {formatTime(timer.elapsedSeconds)}
        </div>
        <div className="text-sm text-gray-500">
          {isRunning ? '正在追踪...' : '准备开始'}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            disabled={!selectedTaskId}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            <span>开始追踪</span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
          >
            <Square className="w-5 h-5" />
            <span>停止追踪</span>
          </button>
        )}
      </div>

      {/* 时间记录历史 */}
      {taskTimeEntries.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">时间记录</h3>
          <div className="space-y-2">
            {taskTimeEntries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {entry.startTime
                      ? new Date(entry.startTime).toLocaleString('zh-CN')
                      : '未知时间'}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatTime(entry.duration)} ({formatHours(entry.duration)}h)
                </div>
              </div>
            ))}
            {taskTimeEntries.length > 5 && (
              <div className="text-sm text-center text-gray-500 pt-2">
                还有 {taskTimeEntries.length - 5} 条记录...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

