
import { RunEvent, fallbackRuns } from './runTypes';
import { supabase } from './supabaseClient';
import { formatDate, mapRunData, prepareSupabaseClient } from './runUtils';

// Fetch all runs from Supabase or use fallback
export const fetchAllRuns = async (): Promise<RunEvent[]> => {
  const supabaseAvailable = prepareSupabaseClient();
  
  // If Supabase is not configured, return fallback data
  if (!supabase || !supabaseAvailable) {
    console.warn('Supabase not configured, using fallback data');
    return fallbackRuns;
  }
  
  try {
    console.log('Attempting to fetch runs from Supabase');
    // Using the table name "Community Runs" with spaces as you renamed it
    const { data, error } = await supabase
      .from('Community Runs')
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
    return mapRunData(data);
  } catch (error) {
    console.error('Error in fetchAllRuns:', error);
    return fallbackRuns;
  }
};

// Get the next upcoming run
export const getNextRun = async (): Promise<RunEvent | undefined> => {
  const supabaseAvailable = prepareSupabaseClient();
  
  // If Supabase is not configured, return first non-past fallback run
  if (!supabase || !supabaseAvailable) {
    console.warn('Supabase not configured, using fallback data');
    const upcomingFallbackRun = fallbackRuns.find(run => !run.isPast);
    return upcomingFallbackRun || fallbackRuns[0];
  }
  
  try {
    console.log('Attempting to fetch next run from Supabase');
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Using the table name "Community Runs" with spaces as you renamed it
    const { data, error } = await supabase
      .from('Community Runs')
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
  const supabaseAvailable = prepareSupabaseClient();
  
  // If Supabase is not configured, return all non-past fallback runs
  if (!supabase || !supabaseAvailable) {
    console.warn('Supabase not configured, using fallback data');
    return fallbackRuns.filter(run => !run.isPast) || fallbackRuns;
  }
  
  try {
    console.log('Attempting to fetch upcoming runs from Supabase');
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    
    // Using the table name "Community Runs" with spaces as you renamed it
    const { data, error } = await supabase
      .from('Community Runs')
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
    return mapRunData(data);
  } catch (error) {
    console.error('Error in getUpcomingRuns:', error);
    return fallbackRuns.filter(run => !run.isPast) || fallbackRuns;
  }
};
