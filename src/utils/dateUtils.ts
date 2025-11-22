import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd') => {
  return format(date, formatStr, { locale: zhCN });
};

export const getMonthDays = (date: Date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // 周一开始
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

export const isToday = (date: Date) => {
  return isSameDay(date, new Date());
};

export const isCurrentMonth = (date: Date, currentMonth: Date) => {
  return isSameMonth(date, currentMonth);
};

export const getNextMonth = (date: Date) => {
  return addMonths(date, 1);
};

export const getPrevMonth = (date: Date) => {
  return subMonths(date, 1);
};

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const formatHours = (seconds: number) => {
  return (seconds / 3600).toFixed(2);
};

