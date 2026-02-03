import { useState } from 'react';
import { Timeline } from './Timeline';
import { PhaseInfo } from './PhaseInfo';
import { ImageComparison } from './ImageComparison';
import { ReviewsWidget } from './ReviewsWidget';
import type { JourneyData, MonthData, PhaseData } from './types';
import journeyData from '../../data/journeyData.json';

const data = journeyData as JourneyData;

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function StethoscopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}

export function TrayaJourney() {
  const [currentMonth, setCurrentMonth] = useState(1);

  const currentMonthData: MonthData = data.months[currentMonth.toString()];
  const phases: Record<string, PhaseData> = data.phases;

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
  };

  return (
    <div className="min-h-screen bg-traya-cream">
      <header className="w-full bg-gradient-to-r from-traya-primary to-traya-secondary backdrop-blur-md border-b border-traya-primary-dark sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm border border-white/30">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                  Your Hair Journey
                </h1>
                <p className="text-xs sm:text-sm text-white/80 font-medium">
                  5-Month Treatment Timeline
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full shadow-sm">
              <StethoscopeIcon className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold text-white">Doctor Monitored</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <section
          className="bg-gradient-to-b from-traya-primary/5 to-white border-b border-traya-primary/10"
          aria-label="Treatment timeline"
          style={{ minHeight: '200px' }}
        >
          <Timeline
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
            phases={phases}
          />
        </section>

        <div className="px-4 sm:px-6 py-6 sm:py-8 space-y-5 sm:space-y-6">
          <section
            className="rounded-2xl border-2 border-traya-primary border border-traya-primary/20 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            aria-label="Phase information"
            style={{ minHeight: '320px' }}
          >
            <PhaseInfo monthData={currentMonthData} phases={phases} />
          </section>

          <section
            className="bg-gradient-to-br from-white to-traya-primary/5 rounded-2xl border-l-4 border-l-traya-secondary border border-traya-secondary/20 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            aria-label="Before and after comparison"
            style={{ minHeight: '400px' }}
          >
            <ImageComparison monthData={currentMonthData} month={currentMonth} />
          </section>

          <section
            className="bg-gradient-to-br from-white to-traya-primary/15 rounded-2xl border-1 border-traya-accent border-traya-accent/20 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            aria-label="Customer reviews"
            style={{ minHeight: '280px' }}
          >
            <ReviewsWidget
              reviews={currentMonthData.reviews}
              phaseName={currentMonthData.phaseName}
            />
          </section>

          <section className="pt-4 sm:pt-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-traya-primary via-traya-primary to-traya-secondary rounded-2xl p-6 sm:p-8 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full mb-4">
                  <ShieldCheckIcon className="w-4 h-4 text-white" />
                  <span className="text-xs font-medium text-white">Results Guaranteed</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 tracking-tight">
                  Start Your Transformation Today
                </h2>
                <p className="text-white/80 mb-6 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                  Join over 5 lakh Indians who have transformed their hair with Traya's personalized treatment plan.
                </p>

                <button
                  className="inline-flex items-center justify-center bg-white text-traya-primary font-semibold
                             py-3.5 px-8 rounded-xl shadow-lg
                             hover:shadow-xl hover:bg-traya-cream active:scale-[0.98]
                             transition-all duration-200
                             focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-traya-primary"
                  aria-label="Start your hair journey with Traya"
                >
                  Get Your Free Hair Test
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 text-white/70 text-xs">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-traya-accent rounded-full" />
                    100% Natural
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-traya-accent rounded-full" />
                    Doctor Monitored
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-traya-accent rounded-full" />
                    Free Consultation
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Trust indicators" className="py-4 sm:py-6">
            <div className="grid grid-cols-4 gap-3 sm:gap-6">
              {[
                { value: '5L+', label: 'Happy Customers', subtext: 'and counting', color: 'from-traya-primary to-traya-secondary' },
                { value: '93%', label: 'See Results', subtext: 'in 5 months', color: 'from-traya-primary to-traya-secondary' },
                { value: '4.8', label: 'App Rating', subtext: 'on Play Store', color: 'from-traya-secondary to-traya-accent' },
                { value: '50+', label: 'Expert Doctors', subtext: 'on board', color: 'from-traya-primary to-traya-secondary' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="relative text-center p-3 sm:p-4 bg-gradient-to-br from-white to-traya-primary/5 rounded-xl shadow-md border border-traya-primary/10 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ minHeight: '90px' }}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                  <p className="text-xl sm:text-2xl font-bold text-traya-primary tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-traya-text mt-0.5">
                    {stat.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-traya-muted hidden sm:block">
                    {stat.subtext}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-traya-primary/5 to-traya-secondary/5 border-t border-traya-primary/10 py-5 sm:py-6">
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p className="text-xs text-traya-muted leading-relaxed">
              *Individual results may vary. Consult your doctor before starting any treatment.
            </p>
            <div className="flex items-center gap-4 text-xs text-traya-muted">
              <span>Privacy Policy</span>
              <span className="w-1 h-1 bg-traya-border rounded-full" />
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
