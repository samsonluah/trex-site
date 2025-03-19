
import { RunEvent } from './runTypes';
import { supabase, isSupabaseConfigured, refreshSupabaseClient } from './supabaseClient';

// Format date helper function
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Map database run data to RunEvent format
export const mapRunData = (data: any[]): RunEvent[] => {
  return data.map(run => ({
    id: run.id,
    date: run.date,
    location: run.location,
    formattedDate: formatDate(run.date),
    isPast: new Date(run.date) < new Date()
  }));
};

// Check if Supabase is available and refresh client if needed
export const prepareSupabaseClient = (): boolean => {
  const refreshed = refreshSupabaseClient();
  console.log('Client refreshed:', refreshed);
  return refreshed || isSupabaseConfigured;
};
