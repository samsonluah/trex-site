
import { createClient } from '@supabase/supabase-js';

// Define the type for run events
export type RunEvent = {
  id: string;
  date: string;
  location: string;
  formattedDate?: string;
  isPast?: boolean;
};

// Get Supabase credentials from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Add logging to debug environment variables
console.log('Supabase URL available:', !!supabaseUrl);
console.log('Supabase key available:', !!supabaseKey);

// Check if Supabase credentials are available
const isSupabaseConfigured = supabaseUrl && supabaseKey;

// Create client only if credentials are available
const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Format date helper function
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Fallback data to use when Supabase is not configured
const fallbackRuns: RunEvent[] = [
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

// Fetch all runs from Supabase or use fallback
export const fetchAllRuns = async (): Promise<RunEvent[]> => {
  // If Supabase is not configured, return fallback data
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured, using fallback data');
    return fallbackRuns;
  }
  
  try {
    console.log('Attempting to fetch runs from Supabase');
    const { data, error } = await supabase
      .from('community_runs')
      .select('*')
      .order('date', { ascending: true });
      
    if (error) {
      console.error('Error fetching runs:', error);
      return fallbackRuns;
    }
    
    if (!data || data.length === 0) {
      console.warn('No runs found in Supabase, using fallback data');
      return fallbackRuns;
    }
    
    console.log('Successfully fetched runs from Supabase:', data);
    return data.map(run => ({
      id: run.id,
      date: run.date,
      location: run.location,
      formattedDate: formatDate(run.date),
      isPast: new Date(run.date) < new Date()
    }));
  } catch (error) {
    console.error('Error in fetchAllRuns:', error);
    return fallbackRuns;
  }
};

// Get the next upcoming run
export const getNextRun = async (): Promise<RunEvent | undefined> => {
  // If Supabase is not configured, return first non-past fallback run
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured, using fallback data');
    const upcomingFallbackRun = fallbackRuns.find(run => !run.isPast);
    return upcomingFallbackRun || fallbackRuns[0];
  }
  
  try {
    console.log('Attempting to fetch next run from Supabase');
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('community_runs')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true })
      .limit(1);
      
    if (error) {
      console.error('Error fetching next run:', error);
      const upcomingFallbackRun = fallbackRuns.find(run => !run.isPast);
      return upcomingFallbackRun || fallbackRuns[0];
    }
    
    if (!data || data.length === 0) {
      console.warn('No upcoming runs found in Supabase, using fallback data');
      const upcomingFallbackRun = fallbackRuns.find(run => !run.isPast);
      return upcomingFallbackRun || fallbackRuns[0];
    }
    
    console.log('Successfully fetched next run from Supabase:', data[0]);
    return {
      id: data[0].id,
      date: data[0].date,
      location: data[0].location,
      formattedDate: formatDate(data[0].date)
    };
  } catch (error) {
    console.error('Error in getNextRun:', error);
    const upcomingFallbackRun = fallbackRuns.find(run => !run.isPast);
    return upcomingFallbackRun || fallbackRuns[0];
  }
};

// Get all upcoming runs
export const getUpcomingRuns = async (): Promise<RunEvent[]> => {
  // If Supabase is not configured, return all non-past fallback runs
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured, using fallback data');
    return fallbackRuns.filter(run => !run.isPast) || fallbackRuns;
  }
  
  try {
    console.log('Attempting to fetch upcoming runs from Supabase');
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    const { data, error } = await supabase
      .from('community_runs')
      .select('*')
      .gte('date', today)
      .order('date', { ascending: true });
      
    if (error) {
      console.error('Error fetching upcoming runs:', error);
      return fallbackRuns.filter(run => !run.isPast) || fallbackRuns;
    }
    
    if (!data || data.length === 0) {
      console.warn('No upcoming runs found in Supabase, using fallback data');
      return fallbackRuns.filter(run => !run.isPast) || fallbackRuns;
    }
    
    console.log('Successfully fetched upcoming runs from Supabase:', data);
    return data.map(run => ({
      id: run.id,
      date: run.date,
      location: run.location,
      formattedDate: formatDate(run.date)
    }));
  } catch (error) {
    console.error('Error in getUpcomingRuns:', error);
    return fallbackRuns.filter(run => !run.isPast) || fallbackRuns;
  }
};
