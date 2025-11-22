import { useMemo } from 'react';
import { BarChart3, Clock, Users, TrendingUp } from 'lucide-react';
import { formatHours, formatTime } from '../../utils/dateUtils';
import { ProjectTimeStats } from '../../types';
import { useStore } from '../../store/useStore';

export const TimeStatsDashboard: React.FC = () => {
  const { projects, tasks, timeEntries, employees } = useStore();

  // 计算项目工时统计
  const projectStats = useMemo<ProjectTimeStats[]>(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter((t) => t.projectId === project.id);
      const projectTimeEntries = timeEntries.filter((entry) => {
        return projectTasks.some((task) => task.id === entry.taskId);
      });

      const totalSeconds = projectTimeEntries.reduce(
        (sum, entry) => sum + entry.duration,
        0
      );

      // 按员工统计工时
      const employeeHours: Record<string, number> = {};
      projectTimeEntries.forEach((entry) => {
        if (!employeeHours[entry.employeeId]) {
          employeeHours[entry.employeeId] = 0;
        }
        employeeHours[entry.employeeId] += entry.duration;
      });

      return {
        projectId: project.id,
        projectName: project.name,
        totalHours: totalSeconds / 3600,
        taskCount: projectTasks.length,
        employeeHours,
      };
    });
  }, [projects, tasks, timeEntries]);

  // 总体统计
  const totalStats = useMemo(() => {
    const totalHours = projectStats.reduce((sum, stat) => sum + stat.totalHours, 0);
    const totalTasks = tasks.length;
    const totalEmployees = employees.length;
    const totalTimeEntries = timeEntries.length;

    return {
      totalHours,
      totalTasks,
      totalEmployees,
      totalTimeEntries,
    };
  }, [projectStats, tasks, employees, timeEntries]);

  // 获取员工名称
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee?.name || employeeId;
  };

  // 按工时排序
  const sortedStats = [...projectStats].sort((a, b) => b.totalHours - a.totalHours);

  return (
    <div className="space-y-6">
      {/* 总体统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">总工时</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.totalHours.toFixed(1)}h
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-lg">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">总任务数</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalTasks}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">员工数</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.totalEmployees}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">时间记录</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalStats.totalTimeEntries}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 项目工时统计 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">项目工时统计</h2>

        {sortedStats.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>暂无项目工时数据</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedStats.map((stat) => {
              const project = projects.find((p) => p.id === stat.projectId);
              const maxHours = Math.max(...sortedStats.map((s) => s.totalHours), 1);

              return (
                <div key={stat.projectId} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                  {/* 项目头部 */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {project && (
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{stat.projectName}</h3>
                        <p className="text-sm text-gray-500">
                          {stat.taskCount} 个任务
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {stat.totalHours.toFixed(1)}h
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(Math.round(stat.totalHours * 3600))}
                      </p>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${(stat.totalHours / maxHours) * 100}%`,
                          backgroundColor: project?.color || '#6b7280',
                        }}
                      />
                    </div>
                  </div>

                  {/* 员工工时明细 */}
                  {Object.keys(stat.employeeHours).length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">员工工时分布</p>
                      {Object.entries(stat.employeeHours)
                        .sort(([, a], [, b]) => b - a)
                        .map(([employeeId, seconds]) => {
                          const hours = seconds / 3600;
                          const percentage = (hours / stat.totalHours) * 100;

                          return (
                            <div key={employeeId} className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-gray-700">
                                    {getEmployeeName(employeeId)}
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {hours.toFixed(1)}h
                                  </span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full transition-all duration-300"
                                    style={{
                                      width: `${percentage}%`,
                                      backgroundColor: project?.color || '#6b7280',
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

