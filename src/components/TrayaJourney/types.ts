export interface Highlight {
  title: string;
  description: string;
}

export interface Review {
  id: string;
  username: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface MonthData {
  phase: number;
  phaseName: string;
  title: string;
  description: string;
  highlights: Highlight[];
  beforeImage: string;
  afterImage: string;
  imageAlt: string;
  reviews: Review[];
}

export interface PhaseData {
  name: string;
  months: number[];
  color: string;
  icon: string;
}

export interface JourneyData {
  phases: Record<string, PhaseData>;
  months: Record<string, MonthData>;
}
