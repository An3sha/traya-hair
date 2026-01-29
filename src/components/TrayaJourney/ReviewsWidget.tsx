import { useMemo } from 'react';
import type { Review } from './types';

interface ReviewsWidgetProps {
  reviews: Review[];
  phaseName: string;
}

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          filled={i < rating}
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i < rating ? 'text-traya-star' : 'text-traya-border'}`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article
      className="group relative bg-gradient-to-br from-white to-traya-sand/30 rounded-xl p-4 sm:p-5 border-l-4 border-l-traya-star border border-traya-border
                 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      aria-labelledby={`review-${review.id}-name`}
      style={{ minHeight: '140px' }}
    >
      <QuoteIcon className="absolute top-4 right-4 w-6 h-6 text-traya-sand opacity-60" />

      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-traya-primary/20 to-traya-secondary/20 flex items-center justify-center">
            <span className="text-traya-primary font-semibold text-sm sm:text-base">
              {review.username.charAt(0)}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <h4
                id={`review-${review.id}-name`}
                className="font-medium text-traya-text text-sm sm:text-base"
              >
                {review.username}
              </h4>
              {review.verified && (
                <VerifiedBadge className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <p className="text-xs text-traya-muted">{review.location}</p>
          </div>
        </div>

        <StarRating rating={review.rating} />
      </div>

      <p className="text-sm text-traya-text-secondary leading-relaxed mb-3 line-clamp-2">
        {review.text}
      </p>

      <p className="text-xs text-traya-subtle">{review.date}</p>
    </article>
  );
}

export function ReviewsWidget({ reviews, phaseName }: ReviewsWidgetProps) {
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews]);

  const verifiedCount = useMemo(() => {
    return reviews.filter((r) => r.verified).length;
  }, [reviews]);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="w-full p-5 sm:p-6" aria-labelledby="reviews-heading" style={{ minHeight: '280px' }}>
      <div className="flex items-start justify-between mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 id="reviews-heading" className="text-lg sm:text-xl font-semibold text-traya-text tracking-tight">
              Customer Stories
            </h3>
            <span className="px-2 py-0.5 bg-traya-success/10 text-traya-success text-[10px] sm:text-xs font-medium rounded-full">
              Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-traya-muted">
            Real results during {phaseName} phase
          </p>
        </div>

        <div className="text-right p-1.5 bg-gradient-to-br from-traya-star/10 to-amber-100 rounded-xl border border-traya-star/30 shadow-md">
          <div className="flex items-center justify-end gap-1.5 mb-0.5">
            <span className="text-xl sm:text-2xl font-bold text-traya-text">{averageRating}</span>
            <StarIcon filled className="w-5 h-5 sm:w-6 sm:h-6 text-traya-star" />
          </div>
          <p className="text-[10px] sm:text-xs text-traya-muted">
            {verifiedCount} verified review{verifiedCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {reviews.slice(0, 2).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <div className="mt-5 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-traya-sand rounded-xl border border-blue-200 shadow-md">
        <div className="flex items-center gap-3 text-sm">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <VerifiedBadge className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-traya-text text-xs sm:text-sm">
              All reviews are verified
            </p>
            <p className="text-[10px] sm:text-xs text-traya-muted">
              From real Traya customers with confirmed purchases
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
