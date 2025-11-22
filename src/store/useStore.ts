import { create } from 'zustand';
import { Task, Project, Employee, TimeEntry, TimerState } from '../types';

interface AppState {
  // 数据
  tasks: Task[];
  projects: Project[];
  employees: Employee[];
  timeEntries: TimeEntry[];
  
  // 计时器状态
  timer: TimerState;
  
  // Actions
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  
  addEmployee: (employee: Employee) => void;
  
  addTimeEntry: (entry: TimeEntry) => void;
  updateTimeEntry: (id: string, updates: Partial<TimeEntry>) => void;
  
  // 计时器操作
  startTimer: (taskId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
}

export const useStore = create<AppState>((set) => ({
  // 初始数据
  tasks: [],
  projects: [],
  employees: [],
  timeEntries: [],
  
  timer: {
    isRunning: false,
    isPaused: false,
    elapsedSeconds: 0,
  },
  
  // Task actions
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) })),
  
  // Project actions
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id ? { ...project, ...updates } : project
      ),
    })),
  
  // Employee actions
  addEmployee: (employee) => set((state) => ({ employees: [...state.employees, employee] })),
  
  // Time entry actions
  addTimeEntry: (entry) => set((state) => ({ timeEntries: [...state.timeEntries, entry] })),
  updateTimeEntry: (id, updates) =>
    set((state) => ({
      timeEntries: state.timeEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    })),
  
  // Timer actions
  startTimer: (taskId) =>
    set({
      timer: {
        isRunning: true,
        isPaused: false,
        elapsedSeconds: 0,
        currentTaskId: taskId,
        startTime: new Date(),
      },
    }),
  pauseTimer: () =>
    set((state) => ({
      timer: { ...state.timer, isRunning: false, isPaused: true },
    })),
  resumeTimer: () =>
    set((state) => ({
      timer: { ...state.timer, isRunning: true, isPaused: false },
    })),
  stopTimer: () =>
    set((state) => {
      if (state.timer.currentTaskId && state.timer.startTime) {
        const entry: TimeEntry = {
          id: `entry-${Date.now()}`,
          taskId: state.timer.currentTaskId,
          employeeId: 'current-user', // 实际应用中从认证获取
          startTime: state.timer.startTime,
          endTime: new Date(),
          duration: state.timer.elapsedSeconds,
          createdAt: new Date(),
        };
        return {
          timer: {
            isRunning: false,
            isPaused: false,
            elapsedSeconds: 0,
          },
          timeEntries: [...state.timeEntries, entry],
        };
      }
      return {
        timer: {
          isRunning: false,
          isPaused: false,
          elapsedSeconds: 0,
        },
      };
    }),
  resetTimer: () =>
    set({
      timer: {
        isRunning: false,
        isPaused: false,
        elapsedSeconds: 0,
      },
    }),
  tickTimer: () =>
    set((state) => ({
      timer: {
        ...state.timer,
        elapsedSeconds: state.timer.isRunning ? state.timer.elapsedSeconds + 1 : state.timer.elapsedSeconds,
      },
    })),
}));

