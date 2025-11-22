import { useState, useMemo } from 'react';
import { format, startOfMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getMonthDays, isToday, isCurrentMonth, formatDate } from '../../utils/dateUtils';
import { CalendarEvent, Task, Project } from '../../types';
import { useStore } from '../../store/useStore';

interface MonthCalendarProps {
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  onDateClick,
  onEventClick,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { tasks, projects } = useStore();

  // 将任务转换为日历事件
  const events = useMemo<CalendarEvent[]>(() => {
    return tasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const project = projects.find((p) => p.id === task.projectId);
        const dueDate = task.dueDate!;
        
        return {
          id: task.id,
          taskId: task.id,
          title: task.title,
          start: dueDate,
          end: dueDate,
          color: project?.color || '#6b7280',
          projectId: task.projectId,
          priority: task.priority,
        };
      });
  }, [tasks, projects]);

  // 获取当前月份的所有日期
  const days = getMonthDays(currentMonth);

  // 获取某一天的事件
  const getDayEvents = (date: Date): CalendarEvent[] => {
    return events.filter((event) => formatDate(event.start) === formatDate(date));
  };

  // 获取优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const goToPrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      {/* 头部导航 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="上一个月"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {format(currentMonth, 'yyyy年 M月', { locale: zhCN })}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="下一个月"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors"
        >
          今天
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日历网格 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayEvents = getDayEvents(day);
          const isCurrentDay = isToday(day);
          const isMonthDay = isCurrentMonth(day, currentMonth);

          return (
            <div
              key={index}
              className={`
                min-h-[100px] md:min-h-[120px] border border-gray-200 rounded-lg p-2
                ${isMonthDay ? 'bg-white' : 'bg-gray-50'}
                ${isCurrentDay ? 'ring-2 ring-primary-500' : ''}
                hover:bg-gray-50 transition-colors cursor-pointer
              `}
              onClick={() => onDateClick?.(day)}
            >
              {/* 日期数字 */}
              <div
                className={`
                  text-sm font-medium mb-1
                  ${isCurrentDay ? 'text-primary-600' : isMonthDay ? 'text-gray-900' : 'text-gray-400'}
                `}
              >
                {format(day, 'd')}
              </div>

              {/* 事件列表 */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`
                      text-xs px-2 py-1 rounded truncate
                      ${getPriorityColor(event.priority)}
                      text-white cursor-pointer hover:opacity-80
                    `}
                    style={{ backgroundColor: event.color }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    title={event.title}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayEvents.length - 3} 更多
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

