
import React from 'react';

interface SeatGridProps {
  busId: string;
  seatData: { [busId: string]: boolean[] };
  loading: boolean;
  onSeatBook: (busId: string, seatIndex: number) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ busId, seatData, loading, onSeatBook }) => {
  const seats = seatData[busId] || [];
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-4 text-center">
        <h4 className="text-xl font-bold text-gray-800 mb-2">
          {busId.replace('bus', 'Bus ')} - Seat Selection
        </h4>
        <div className="text-sm text-gray-600">Click on red seats to book them for today</div>
        <div className="text-xs text-gray-500 mt-1">
          Date: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      <div className="grid grid-cols-6 gap-2 max-w-md mx-auto mb-4">
        {seats.map((isBooked, index) => (
          <button
            key={index}
            onClick={() => onSeatBook(busId, index)}
            disabled={isBooked || loading}
            className={`
              aspect-square rounded-lg border-2 font-semibold text-sm transition-all duration-200 
              ${isBooked 
                ? 'bg-green-500 border-green-600 text-white cursor-not-allowed' 
                : loading
                ? 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 border-red-600 text-white hover:bg-red-400 hover:border-red-500 hover:scale-105 cursor-pointer'
              }
            `}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded border border-red-600"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded border border-green-600"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
