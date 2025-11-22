import { useState } from 'react';
import { User, Plus, X, Search } from 'lucide-react';
import { Task, Employee, Project } from '../../types';
import { useStore } from '../../store/useStore';

export const TaskAssignment: React.FC = () => {
  const { tasks, employees, projects, updateTask } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // 过滤任务
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesEmployee =
      filterEmployee === 'all' || task.assignedTo === filterEmployee;

    return matchesSearch && matchesStatus && matchesEmployee;
  });

  const handleAssignTask = (taskId: string, employeeId: string) => {
    updateTask(taskId, { assignedTo: employeeId });
  };

  const handleUnassignTask = (taskId: string) => {
    updateTask(taskId, { assignedTo: undefined });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">任务分配</h2>

      {/* 筛选器 */}
      <div className="mb-6 space-y-4">
        {/* 搜索 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索任务..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* 状态和员工筛选 */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">全部</option>
              <option value="todo">待办</option>
              <option value="in-progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              员工
            </label>
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">全部</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>没有找到匹配的任务</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const assignedEmployee = employees.find((e) => e.id === task.assignedTo);
            const project = projects.find((p) => p.id === task.projectId);
            const showAssignMenu = openMenus[task.id] || false;

            return (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* 任务信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority === 'urgent'
                          ? '紧急'
                          : task.priority === 'high'
                          ? '高'
                          : task.priority === 'medium'
                          ? '中'
                          : '低'}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status === 'todo'
                          ? '待办'
                          : task.status === 'in-progress'
                          ? '进行中'
                          : task.status === 'completed'
                          ? '已完成'
                          : '已取消'}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                      {project && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: project.color }}
                          />
                          <span>{project.name}</span>
                        </div>
                      )}

                      {assignedEmployee ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm">
                            <User className="w-4 h-4" />
                            <span>{assignedEmployee.name}</span>
                            <button
                              onClick={() => handleUnassignTask(task.id)}
                              className="ml-2 hover:text-primary-900"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => {
                              setOpenMenus((prev) => ({
                                ...prev,
                                [task.id]: !prev[task.id],
                              }));
                            }}
                            className="flex items-center gap-1.5 px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                            <span>分配任务</span>
                          </button>

                          {showAssignMenu && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                              {employees.map((emp) => (
                                <button
                                  key={emp.id}
                                  onClick={() => {
                                    handleAssignTask(task.id, emp.id);
                                    setOpenMenus((prev) => ({
                                      ...prev,
                                      [task.id]: false,
                                    }));
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                                >
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span>{emp.name}</span>
                                  {emp.role && (
                                    <span className="text-xs text-gray-500 ml-auto">
                                      {emp.role}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

