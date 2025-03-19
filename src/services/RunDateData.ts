
import { createClient } from '@supabase/supabase-js';

// Define the type for run events
export type RunEvent = {
  id: string;
  date: string;
  location: string;
  formattedDate?: string;
  isPast?: boolean;
};

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Format date helper function
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Fetch all runs from Supabase
export const fetchAllRuns = async (): Promise<RunEvent[]> => {
  const { data, error } = await supabase
    .from('community_runs')
    .select('*')
    .order('date', { ascending: true });
    
  if (error) {
    console.error('Error fetching runs:', error);
    return [];
  }
  
  return data.map(run => ({
    id: run.id,
    date: run.date,
    location: run.location,
    formattedDate: formatDate(run.date),
    isPast: new Date(run.date) < new Date()
  }));
};

// Get the next upcoming run
export const getNextRun = async (): Promise<RunEvent | undefined> => {
  const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  const { data, error } = await supabase
    .from('community_runs')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true })
    .limit(1);
    
  if (error || !data || data.length === 0) {
    console.error('Error fetching next run:', error);
    return undefined;
  }
  
  return {
    id: data[0].id,
    date: data[0].date,
    location: data[0].location,
    formattedDate: formatDate(data[0].date)
  };
};

// Get all upcoming runs
export const getUpcomingRuns = async (): Promise<RunEvent[]> => {
  const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
  
  const { data, error } = await supabase
    .from('community_runs')
    .select('*')
    .gte('date', today)
    .order('date', { ascending: true });
    
  if (error) {
    console.error('Error fetching upcoming runs:', error);
    return [];
  }
  
  return data.map(run => ({
    id: run.id,
    date: run.date,
    location: run.location,
    formattedDate: formatDate(run.date)
  }));
};
