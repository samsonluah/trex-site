
// Type definitions for run events and related data

export type RunEvent = {
  id: string;
  date: string;
  location: string;
  formattedDate?: string;
  isPast?: boolean;
};

// Fallback data to use when Supabase is not configured
export const fallbackRuns: RunEvent[] = [
  {
    id: "1",
    date: "2023-12-15",
    location: "East Coast Park",
    formattedDate: "December 15, 2023",
    isPast: new Date("2023-12-15") < new Date()
  },
  {
    id: "2",
    date: "2024-01-20",
    location: "Gardens by the Bay",
    formattedDate: "January 20, 2024",
    isPast: new Date("2024-01-20") < new Date()
  },
  {
    id: "3",
    date: "2024-02-17",
    location: "MacRitchie Reservoir",
    formattedDate: "February 17, 2024",
    isPast: new Date("2024-02-17") < new Date()
  }
];
