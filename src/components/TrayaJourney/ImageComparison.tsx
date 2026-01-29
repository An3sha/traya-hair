import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { MonthData } from './types';

interface ImageComparisonProps {
  monthData: MonthData;
  month: number;
}

type ViewMode = 'before' | 'after' | 'slider';

interface ImageLoadState {
  month: number;
  before: boolean;
  after: boolean;
}

export function ImageComparison({ monthData, month }: ImageComparisonProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [imageLoadState, setImageLoadState] = useState<ImageLoadState>({
    month,
    before: false,
    after: false,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const allImagesLoaded = useMemo(() => {
    return (
      imageLoadState.month === month &&
      imageLoadState.before &&
      imageLoadState.after
    );
  }, [imageLoadState, month]);

  const handleImageLoad = useCallback(
    (type: 'before' | 'after') => {
      setImageLoadState((prev) => {
        if (prev.month !== month) {
          return {
            month,
            before: type === 'before',
            after: type === 'after',
          };
        }
        return { ...prev, [type]: true };
      });
    },
    [month]
  );

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current || !isDragging) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    [isDragging]
  );

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        handleMove(e.touches[0].clientX);
      }
    },
    [handleMove]
  );

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('touchend', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const showLoading = imageLoadState.month !== month || !allImagesLoaded;

  return (
    <div className="w-full p-5 sm:p-6" style={{ minHeight: '400px' }}>
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-traya-text tracking-tight">
            Progress Preview
          </h3>
          <p className="text-xs sm:text-sm text-traya-muted mt-0.5">
            Visual transformation at Month {month}
          </p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-traya-secondary to-traya-primary rounded-full shadow-md">
          <span className="text-xs font-semibold text-white">Month {month}</span>
        </div>
      </div>

      <div
        className="inline-flex p-1.5 bg-traya-sand rounded-xl mb-5 sm:mb-6 shadow-inner border border-traya-border-light"
        role="tablist"
        aria-label="Image view options"
      >
        {(['before', 'slider', 'after'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            role="tab"
            aria-selected={viewMode === mode}
            onClick={() => setViewMode(mode)}
            className={`
              px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium
              transition-all duration-200 ease-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-traya-primary focus-visible:ring-offset-1
              ${
                viewMode === mode
                  ? 'bg-gradient-to-r from-traya-primary to-traya-secondary text-white shadow-md'
                  : 'text-traya-muted hover:text-traya-text hover:bg-white/50'
              }
            `}
          >
            {mode === 'slider' ? 'Compare' : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl bg-traya-sand border-2 border-traya-border shadow-lg"
        style={{ aspectRatio: '4 / 3' }}
        onMouseMove={viewMode === 'slider' ? handleMouseMove : undefined}
        onTouchMove={viewMode === 'slider' ? handleTouchMove : undefined}
      >
        {showLoading && (
          <div className="absolute inset-0 bg-traya-sand flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-traya-primary/20 border-t-traya-primary rounded-full animate-spin" />
              <span className="text-xs text-traya-muted">Loading images...</span>
            </div>
          </div>
        )}

        <img
          src={monthData.beforeImage}
          alt={`Before - ${monthData.imageAlt}`}
          className={`
            absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out
            ${viewMode === 'after' ? 'opacity-0' : 'opacity-100'}
            ${showLoading ? 'invisible' : 'visible'}
          `}
          onLoad={() => handleImageLoad('before')}
          draggable={false}
        />

        <img
          src={monthData.afterImage}
          alt={`After - ${monthData.imageAlt}`}
          className={`
            absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out
            ${viewMode === 'before' ? 'opacity-0' : 'opacity-100'}
            ${showLoading ? 'invisible' : 'visible'}
          `}
          style={
            viewMode === 'slider'
              ? { clipPath: `inset(0 0 0 ${sliderPosition}%)` }
              : undefined
          }
          onLoad={() => handleImageLoad('after')}
          draggable={false}
        />

        {viewMode === 'slider' && !showLoading && (
          <>
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white/90 z-10 transition-all duration-75"
              style={{
                left: `${sliderPosition}%`,
                boxShadow: '0 0 8px rgba(0,0,0,0.3)',
              }}
            />

            <button
              className={`
                absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20
                w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white
                flex items-center justify-center cursor-ew-resize
                transition-transform duration-150 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50
                ${isDragging ? 'scale-110 shadow-xl' : 'shadow-lg hover:scale-105'}
              `}
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onKeyDown={handleKeyDown}
              aria-label="Drag to compare before and after images"
              aria-valuenow={sliderPosition}
              aria-valuemin={0}
              aria-valuemax={100}
              role="slider"
            >
              <svg
                className="w-5 h-5 text-traya-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M8 6l-4 6 4 6" />
                <path d="M16 6l4 6-4 6" />
              </svg>
            </button>

            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
              Before
            </div>
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
              After
            </div>
          </>
        )}

        {viewMode !== 'slider' && !showLoading && (
          <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg">
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
          </div>
        )}
      </div>

      <p className="text-[10px] sm:text-xs text-traya-subtle text-center mt-4 leading-relaxed">
        *Results may vary. Images are representative of typical progress with consistent use.
      </p>
    </div>
  );
}
