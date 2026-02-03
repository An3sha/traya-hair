import type { MonthData, PhaseData } from './types';

interface PhaseInfoProps {
  monthData: MonthData;
  phases: Record<string, PhaseData>;
}

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

function LeafIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function SparklesIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

function TrendingUpIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function CheckCircleIcon({ className, style }: IconProps) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

const iconMap: Record<string, React.FC<IconProps>> = {
  leaf: LeafIcon,
  sparkles: SparklesIcon,
  'trending-up': TrendingUpIcon,
};

export function PhaseInfo({ monthData, phases }: PhaseInfoProps) {
  const currentPhase = phases[monthData.phase.toString()];

  const PhaseIcon = iconMap[currentPhase?.icon || 'leaf'];

  return (
    <div
      className="relative w-full p-5 sm:p-6 overflow-hidden bg-gradient-to-br from-traya-primary/20 via-traya-secondary/20 to-traya-accent/40"
      style={{ minHeight: '420px' }}
    >
      <div className="relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105 shadow-lg border-2 bg-white/80 backdrop-blur-sm"
            style={{ borderColor: `${currentPhase?.color}40` }}
          >
            <PhaseIcon
              className="w-6 h-6 sm:w-7 sm:h-7"
              style={{ color: currentPhase?.color }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full text-white shadow-sm"
                style={{ backgroundColor: currentPhase?.color }}
              >
                Phase {monthData.phase}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-traya-text tracking-tight">
              {monthData.phaseName}
            </h3>
          </div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-traya-text mb-3 tracking-tight leading-tight line-clamp-1">
            {monthData.title}
          </h2>
          <p className="text-sm sm:text-base text-traya-text-secondary leading-relaxed line-clamp-3">
            {monthData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {monthData.highlights.map((highlight, index) => (
            <div
              key={index}
              className="group flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-white rounded-xl border border-traya-primary/10 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:border-traya-primary/20"
              style={{ minHeight: '80px' }}
            >
              <div
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${currentPhase?.color}20` }}
              >
                <CheckCircleIcon
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: currentPhase?.color }}
                />
              </div>
              <div className="pt-0.5">
                <h4 className="font-medium text-traya-text text-sm sm:text-base mb-1 tracking-tight">
                  {highlight.title}
                </h4>
                <p className="text-xs sm:text-sm text-traya-muted leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
