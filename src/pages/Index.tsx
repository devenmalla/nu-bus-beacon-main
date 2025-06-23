import React, { useState, useEffect } from 'react';
import { Bus, Users, CheckCircle, Circle, AlertCircle, Heart } from 'lucide-react';
import { fetchTodayBookings, bookSeat as dbBookSeat, resetAllBookingsForToday, Booking } from '../services/supabase';
import { useToast } from '@/hooks/use-toast';
import BusOverview from '../components/BusOverview';
import SeatGrid from '../components/SeatGrid';
import AdminResetForm from '../components/AdminResetForm';

interface SeatData {
  [busId: string]: boolean[];
}

const Index = () => {
  const [seatData, setSeatData] = useState<SeatData>({});
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetCode, setResetCode] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const { toast } = useToast();

  // Initialize seat data from Supabase
  useEffect(() => {
    loadTodayBookings();
  }, []);

  const loadTodayBookings = async () => {
    try {
      setLoading(true);
      const bookings = await fetchTodayBookings();
      
      // Initialize empty seat data for all buses
      const initialData: SeatData = {};
      for (let i = 1; i <= 5; i++) {
        initialData[`bus${i}`] = new Array(30).fill(false);
      }
      
      // Mark booked seats based on database data
      bookings.forEach((booking: Booking) => {
        const busKey = `bus${booking.bus_id}`;
        if (initialData[busKey]) {
          initialData[busKey][booking.seat_number - 1] = true;
        }
      });
      
      setSeatData(initialData);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load booking data. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bookSeat = async (busId: string, seatIndex: number) => {
    if (seatData[busId] && !seatData[busId][seatIndex]) {
      try {
        const busNumber = parseInt(busId.replace('bus', ''));
        const seatNumber = seatIndex + 1;
        
        await dbBookSeat(busNumber, seatNumber);
        
        // Update local state
        setSeatData(prev => ({
          ...prev,
          [busId]: prev[busId].map((booked, index) => 
            index === seatIndex ? true : booked
          )
        }));
        
        toast({
          title: "Seat Booked!",
          description: `Seat ${seatNumber} in ${busId.replace('bus', 'Bus ')} has been booked successfully.`,
        });
      } catch (error) {
        console.error('Error booking seat:', error);
        toast({
          title: "Booking Failed",
          description: "This seat might already be booked. Please refresh and try again.",
          variant: "destructive",
        });
        // Refresh data to sync with database
        loadTodayBookings();
      }
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin secret code
    const SECRET_CODE = "SETNU2024";
    
    if (resetCode === SECRET_CODE) {
      try {
        await resetAllBookingsForToday();
        
        // Reset local state
        const resetData: SeatData = {};
        for (let i = 1; i <= 5; i++) {
          resetData[`bus${i}`] = new Array(30).fill(false);
        }
        setSeatData(resetData);
        setSelectedBus(null);
        setShowResetForm(false);
        setResetCode('');
        
        toast({
          title: "Reset Successful",
          description: "All bus bookings for today have been reset successfully!",
        });
      } catch (error) {
        console.error('Error resetting bookings:', error);
        toast({
          title: "Reset Failed",
          description: "Failed to reset bookings. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect reset code. Only authorized personnel can reset bookings.",
        variant: "destructive",
      });
      setResetCode('');
    }
  };

  const handleResetCancel = () => {
    setShowResetForm(false);
    setResetCode('');
  };

  const getBusStats = (busId: string) => {
    const seats = seatData[busId] || [];
    const booked = seats.filter(seat => seat).length;
    const available = 30 - booked;
    return { booked, available };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Bus className="w-16 h-16 text-yellow-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold text-gray-700">Loading booking data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Bus className="text-yellow-600 w-8 h-8" />
              <h1 className="text-3xl font-bold text-gray-800">SET-NU Bus Service</h1>
            </div>
            <p className="text-gray-600">School of Engineering and Technology, Nagaland University</p>
            <p className="text-sm text-gray-500 mt-1">Book your seat for today's college transport</p>
            <p className="text-xs text-blue-600 mt-1 font-medium">
              Today: {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bus Overview Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-yellow-600" />
              Available Buses
            </h2>
            <button
              onClick={() => setShowResetForm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Admin Reset
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(busNumber => (
              <BusOverview 
                key={busNumber}
                busId={`bus${busNumber}`}
                busNumber={busNumber}
                selectedBus={selectedBus}
                onBusSelect={setSelectedBus}
                getBusStats={getBusStats}
              />
            ))}
          </div>
        </div>

        {/* Admin Reset Form */}
        {showResetForm && (
          <AdminResetForm
            resetCode={resetCode}
            onResetCodeChange={setResetCode}
            onResetSubmit={handleResetSubmit}
            onCancel={handleResetCancel}
          />
        )}

        {/* Seat Selection */}
        {selectedBus && (
          <div className="animate-fade-in">
            <SeatGrid
              busId={selectedBus}
              seatData={seatData}
              loading={loading}
              onSeatBook={bookSeat}
            />
          </div>
        )}

        {!selectedBus && (
          <div className="text-center py-12">
            <Bus className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Bus to Book Seats</h3>
            <p className="text-gray-500">Click on any bus above to view and book available seats for today</p>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            How to Book Your Seat for Today
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="flex items-start gap-2">
              <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Step 1:</strong> Choose your preferred bus from the 5 available options above
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Step 2:</strong> Click on any red (available) seat to book it for today's journey
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Circle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Step 3:</strong> Your booking is saved in the database - green seats are confirmed for today
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Bookings are date-specific. Each day starts fresh with all seats available.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-600 flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Deven Malla
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
