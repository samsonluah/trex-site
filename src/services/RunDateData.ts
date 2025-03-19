
export type RunEvent = {
  id: string;
  date: string;
  location: string;
  formattedDate: string;
  isPast?: boolean;
};

// This would normally come from a database or API
export const upcomingRuns: RunEvent[] = [
  {
    id: "june-24",
    date: "2023-06-24",
    location: "East Coast Park",
    formattedDate: "June 24, 2023"
  },
  {
    id: "july-22",
    date: "2023-07-22",
    location: "Marina Bay",
    formattedDate: "July 22, 2023"
  },
  {
    id: "august-26",
    date: "2023-08-26",
    location: "Gardens by the Bay",
    formattedDate: "August 26, 2023"
  }
];

export const getNextRun = (): RunEvent | undefined => {
  const today = new Date();
  
  // Find the next upcoming run that hasn't passed yet
  return upcomingRuns.find(run => {
    const runDate = new Date(run.date);
    return runDate >= today;
  });
};

export const getUpcomingRuns = (): RunEvent[] => {
  const today = new Date();
  
  // Return all future runs
  return upcomingRuns
    .map(run => ({
      ...run,
      isPast: new Date(run.date) < today
    }))
    .filter(run => !run.isPast);
};
