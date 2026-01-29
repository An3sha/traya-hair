import { useCallback, useMemo } from 'react';
import type { PhaseData } from './types';

interface TimelineProps {
  currentMonth: number;
  onMonthChange: (month: number) => void;
  phases: Record<string, PhaseData>;
}

const TOTAL_MONTHS = 5;

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    </svg>
  );
}

function TrendingUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

const phaseIcons: Record<number, React.FC<{ className?: string }>> = {
  1: LeafIcon,
  2: SparklesIcon,
  3: TrendingUpIcon,
};

export function Timeline({ currentMonth, onMonthChange, phases }: TimelineProps) {
  const phaseSegments = useMemo(() => {
    return Object.entries(phases).map(([phaseNum, phase]) => ({
      phaseNum: parseInt(phaseNum),
      name: phase.name,
      startMonth: Math.min(...phase.months),
      endMonth: Math.max(...phase.months),
      color: phase.color,
    }));
  }, [phases]);

  const currentPhase = useMemo(() => {
    return phaseSegments.find(
      (segment) => currentMonth >= segment.startMonth && currentMonth <= segment.endMonth
    );
  }, [currentMonth, phaseSegments]);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMonthChange(parseInt(e.target.value));
    },
    [onMonthChange]
  );

  const handleMonthClick = useCallback(
    (month: number) => {
      onMonthChange(month);
    },
    [onMonthChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentMonth > 1) {
        onMonthChange(currentMonth - 1);
      } else if (e.key === 'ArrowRight' && currentMonth < TOTAL_MONTHS) {
        onMonthChange(currentMonth + 1);
      }
    },
    [currentMonth, onMonthChange]
  );

  const progressPercent = ((currentMonth - 1) / (TOTAL_MONTHS - 1)) * 100;

  return (
    <div className="w-full px-5 sm:px-6 py-6 sm:py-8" style={{ minHeight: '200px' }}>
      <div className="relative z-20 flex justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        {phaseSegments.map((segment) => {
          const isActive = currentPhase?.phaseNum === segment.phaseNum;
          const PhaseIcon = phaseIcons[segment.phaseNum];

          return (
            <button
              key={segment.phaseNum}
              onClick={() => onMonthChange(segment.endMonth)}
              className={`
                flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full
                text-xs sm:text-sm font-medium
                transition-all duration-300 ease-out cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-traya-primary focus-visible:ring-offset-2
                ${
                  isActive
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-white text-traya-muted shadow-md border border-traya-border hover:scale-102 hover:shadow-lg'
                }
              `}
              style={{
                backgroundColor: isActive ? segment.color : undefined,
              }}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Go to Phase ${segment.phaseNum}: ${segment.name}`}
            >
              {PhaseIcon && <PhaseIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              <span className="hidden sm:inline">Phase {segment.phaseNum}:</span>
              <span>{segment.name}</span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-10 mb-8 sm:mb-10">
        <div className="h-2 sm:h-3 bg-traya-sand rounded-full overflow-hidden shadow-inner border border-traya-border-light">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out shadow-md"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${phaseSegments[0]?.color || '#1a5f4a'}, ${currentPhase?.color || '#1a5f4a'})`,
            }}
          />
        </div>

        <div className="absolute inset-x-0 -top-1 flex justify-between">
          {Array.from({ length: TOTAL_MONTHS }, (_, i) => i + 1).map((month) => {
            const isActive = month === currentMonth;
            const isPast = month < currentMonth;
            const isFuture = month > currentMonth;
            const phase = phaseSegments.find(
              (s) => month >= s.startMonth && month <= s.endMonth
            );

            return (
              <button
                key={month}
                onClick={() => handleMonthClick(month)}
                onKeyDown={handleKeyDown}
                className={`
                  relative flex flex-col items-center
                  transition-all duration-300 ease-out
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-traya-primary focus-visible:ring-offset-2
                  rounded-xl
                  ${isActive ? 'z-10' : 'z-0'}
                `}
                style={{ width: `${100 / TOTAL_MONTHS}%` }}
                aria-label={`Month ${month}${isActive ? ' (current)' : ''}`}
                aria-current={isActive ? 'step' : undefined}
              >
                <div
                  className={`
                    flex items-center justify-center rounded-full border-2 border-white
                    transition-all duration-300 ease-out
                    ${
                      isActive
                        ? 'w-10 h-10 sm:w-12 sm:h-12 shadow-lg -mt-4 sm:-mt-5'
                        : isPast
                        ? 'w-4 h-4 sm:w-5 sm:h-5 -mt-1 sm:-mt-1.5'
                        : 'w-4 h-4 sm:w-5 sm:h-5 -mt-1 sm:-mt-1.5 bg-traya-sand'
                    }
                  `}
                  style={{
                    backgroundColor: isActive || isPast ? phase?.color : undefined,
                  }}
                >
                  {isActive && (
                    <span className="text-white font-semibold text-sm sm:text-base">
                      {month}
                    </span>
                  )}
                </div>

                <div
                  className={`
                    mt-2 sm:mt-3 text-center transition-all duration-300
                    ${isActive ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
                  `}
                >
                  <span
                    className={`
                      block text-xs sm:text-sm font-medium
                      ${isActive ? 'text-traya-text' : isFuture ? 'text-traya-subtle' : 'text-traya-muted'}
                    `}
                  >
                    Month {month}
                  </span>
                  <span
                    className={`
                      block text-[10px] sm:text-xs mt-0.5 font-medium
                      transition-opacity duration-300
                      ${isActive ? 'opacity-100' : 'opacity-0'}
                    `}
                    style={{ color: phase?.color }}
                    aria-hidden={!isActive}
                  >
                    {phase?.name || '\u00A0'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative -mt-20 sm:-mt-24">
        <input
          type="range"
          min="1"
          max={TOTAL_MONTHS}
          value={currentMonth}
          onChange={handleSliderChange}
          onKeyDown={handleKeyDown}
          className="w-full h-24 sm:h-28 opacity-0 cursor-pointer"
          aria-label="Select month"
          aria-valuemin={1}
          aria-valuemax={TOTAL_MONTHS}
          aria-valuenow={currentMonth}
          aria-valuetext={`Month ${currentMonth}`}
        />
      </div>

      <p className="text-center text-[10px] sm:text-xs text-traya-subtle mt-2 sm:hidden">
        Tap months or swipe to navigate
      </p>
    </div>
  );
}
