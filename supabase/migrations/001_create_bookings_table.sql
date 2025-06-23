
-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_id INTEGER NOT NULL CHECK (bus_id >= 1 AND bus_id <= 5),
  seat_number INTEGER NOT NULL CHECK (seat_number >= 1 AND seat_number <= 30),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(bus_id, seat_number, date)
);

-- Create index for faster queries
CREATE INDEX idx_bookings_date_bus ON bookings(date, bus_id);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is a simple booking system)
CREATE POLICY "Allow all operations on bookings" ON bookings
FOR ALL USING (true);
