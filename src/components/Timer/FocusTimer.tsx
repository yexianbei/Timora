import { useEffect, useState } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/dateUtils';
import { useStore } from '../../store/useStore';

interface FocusTimerProps {
  taskId?: string;
  onComplete?: (duration: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ taskId, onComplete }) => {
  const { timer, startTimer, pauseTimer, resumeTimer, stopTimer, resetTimer, tickTimer } = useStore();
  const [intervalId, setIntervalId] = useState<number | null>(null);

  // 定时器 tick
  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      const id = window.setInterval(() => {
        tickTimer();
      }, 1000);
      setIntervalId(id);
      return () => {
        if (id) window.clearInterval(id);
      };
    } else {
      if (intervalId !== null) {
        window.clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [timer.isRunning, timer.isPaused, tickTimer, intervalId]);

  const handleStart = () => {
    if (taskId) {
      startTimer(taskId);
    } else {
      // 如果没有 taskId，使用默认任务
      startTimer('default-task');
    }
  };

  const handlePause = () => {
    if (timer.isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  const handleStop = () => {
    stopTimer();
    if (onComplete && timer.elapsedSeconds > 0) {
      onComplete(timer.elapsedSeconds);
    }
  };

  const handleReset = () => {
    resetTimer();
  };

  const isActive = timer.isRunning || timer.elapsedSeconds > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
      <div className="text-center">
        {/* 计时器显示 */}
        <div className="mb-8">
          <div className="text-6xl md:text-7xl font-mono font-bold text-gray-900 mb-2">
            {formatTime(timer.elapsedSeconds)}
          </div>
          <div className="text-sm text-gray-500">
            {timer.isRunning && !timer.isPaused
              ? '专注中...'
              : timer.isPaused
              ? '已暂停'
              : '准备开始'}
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex items-center justify-center gap-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-sm"
            >
              <Play className="w-5 h-5" />
              <span>开始</span>
            </button>
          ) : (
            <>
              {timer.isRunning && !timer.isPaused ? (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-sm"
                >
                  <Pause className="w-5 h-5" />
                  <span>暂停</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium shadow-sm"
                >
                  <Play className="w-5 h-5" />
                  <span>继续</span>
                </button>
              )}

              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
              >
                <Square className="w-5 h-5" />
                <span>停止</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
                <span>重置</span>
              </button>
            </>
          )}
        </div>

        {/* 提示信息 */}
        {timer.currentTaskId && (
          <div className="mt-6 text-sm text-gray-500">
            正在追踪任务: {timer.currentTaskId}
          </div>
        )}
      </div>
    </div>
  );
};

