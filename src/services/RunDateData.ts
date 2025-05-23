
// Define the type for run events
export type RunEvent = {
  id: string;
  date: string;
  location: string;
  formattedDate?: string;
  isPast?: boolean;
};

// Format date helper function
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Parse CSV data
const parseCSV = async (): Promise<RunEvent[]> => {
  try {
    const response = await fetch('/data/community_runs.csv');
    if (!response.ok) {
      console.error('Failed to fetch CSV file:', response.statusText);
      return [];
    }
    
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Skip the header row (index 0)
    const results = lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => {
        const values = line.split(',');
        const date = new Date(values[1]);
        const now = new Date();
        
        // Debug logging
        console.log(`Run date: ${date}, Is past: ${date < now}`);
        
        const run: RunEvent = {
          id: values[0],
          date: values[1],
          location: values[2],
          formattedDate: formatDate(values[1]),
          isPast: date < now
        };
        return run;
      });
      
    console.log('Parsed runs:', results);
    return results;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
};

// Fetch all runs
export const fetchAllRuns = async (): Promise<RunEvent[]> => {
  try {
    console.log('Fetching all runs from CSV');
    const runs = await parseCSV();
    console.log('Successfully fetched runs from CSV:', runs);
    return runs;
  } catch (error) {
    console.error('Error in fetchAllRuns:', error);
    return [];
  }
};

// Get the next upcoming run
export const getNextRun = async (): Promise<RunEvent | undefined> => {
  try {
    console.log('Fetching next run from CSV');
    const runs = await parseCSV();
    const today = new Date();
    
    // Debug logging
    console.log('All runs:', runs);
    console.log('Today:', today);
    
    // Find the first upcoming run
    const upcomingRun = runs
      .filter(run => {
        const runDate = new Date(run.date);
        const isUpcoming = runDate > today;
        console.log(`Run date ${run.date} is upcoming: ${isUpcoming}`);
        return isUpcoming;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    
    console.log('Next upcoming run:', upcomingRun);
    return upcomingRun;
  } catch (error) {
    console.error('Error in getNextRun:', error);
    return undefined;
  }
};

// Get all upcoming runs
export const getUpcomingRuns = async (): Promise<RunEvent[]> => {
  try {
    console.log('Fetching upcoming runs from CSV');
    const runs = await parseCSV();
    const today = new Date();
    
    // Filter to only include upcoming runs
    const upcomingRuns = runs
      .filter(run => {
        const runDate = new Date(run.date);
        return runDate > today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    console.log('Upcoming runs:', upcomingRuns);
    return upcomingRuns;
  } catch (error) {
    console.error('Error in getUpcomingRuns:', error);
    return [];
  }
};
