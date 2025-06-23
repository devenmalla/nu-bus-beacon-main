
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lfybxxwcvrdiqnkwdjqa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmeWJ4eHdjdnJkaXFua3dkanFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTg4MjgsImV4cCI6MjA2NTk5NDgyOH0.hhQFIbIkxLi46zAMMy_2Xhe-QAG_hPPEk0pSrfwcjKo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Booking {
  id: string;
  bus_id: number;
  seat_number: number;
  date: string;
  created_at: string;
}

// Get today's date in YYYY-MM-DD format
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Fetch all bookings for today
export const fetchTodayBookings = async (): Promise<Booking[]> => {
  const today = getTodayDate();
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('date', today);
  
  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
  
  return data || [];
};

// Book a seat
export const bookSeat = async (busId: number, seatNumber: number): Promise<void> => {
  const today = getTodayDate();
  const { error } = await supabase
    .from('bookings')
    .insert({
      bus_id: busId,
      seat_number: seatNumber,
      date: today
    });
  
  if (error) {
    console.error('Error booking seat:', error);
    throw error;
  }
};

// Reset all bookings for today (admin function)
export const resetAllBookingsForToday = async (): Promise<void> => {
  const today = getTodayDate();
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('date', today);
  
  if (error) {
    console.error('Error resetting bookings:', error);
    throw error;
  }
};
