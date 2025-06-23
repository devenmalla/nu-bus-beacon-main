
import React from 'react';
import { Bus } from 'lucide-react';

interface BusOverviewProps {
  busId: string;
  busNumber: number;
  selectedBus: string | null;
  onBusSelect: (busId: string | null) => void;
  getBusStats: (busId: string) => { booked: number; available: number };
}

const BusOverview: React.FC<BusOverviewProps> = ({
  busId,
  busNumber,
  selectedBus,
  onBusSelect,
  getBusStats
}) => {
  const stats = getBusStats(busId);
  
  return (
    <div 
      className={`bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 cursor-pointer transition-all duration-300 hover:bg-yellow-100 hover:border-yellow-400 hover:shadow-lg ${
        selectedBus === busId ? 'bg-yellow-200 border-yellow-500 shadow-lg' : ''
      }`}
      onClick={() => onBusSelect(selectedBus === busId ? null : busId)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bus className="text-yellow-600 w-6 h-6" />
          <h3 className="font-bold text-lg text-gray-800">Bus {busNumber}</h3>
        </div>
        <div className="text-sm text-gray-600">
          {stats.booked}/30 booked
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="bg-white rounded p-2 text-center">
          <div className="font-semibold text-gray-700">30</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="bg-green-100 rounded p-2 text-center">
          <div className="font-semibold text-green-700">{stats.booked}</div>
          <div className="text-xs text-green-500">Booked</div>
        </div>
        <div className="bg-red-100 rounded p-2 text-center">
          <div className="font-semibold text-red-700">{stats.available}</div>
          <div className="text-xs text-red-500">Available</div>
        </div>
      </div>
    </div>
  );
};

export default BusOverview;
