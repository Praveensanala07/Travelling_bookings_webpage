import React from 'react';
import { Plane, Clock, MapPin } from 'lucide-react';

interface FlightCardProps {
  flight: {
    id: string;
    airline: string;
    flightNumber: string;
    departure: {
      time: string;
      airport: string;
      city: string;
    };
    arrival: {
      time: string;
      airport: string;
      city: string;
    };
    duration: string;
    stops: number;
    price: number;
    aircraft: string;
  };
  onSelect: (flight: any) => void;
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatTime = (time: string) => {
    return new Date(`2024-01-01 ${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-lg group">
      <div className="p-6">
        {/* Airline Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{flight.airline}</h3>
              <p className="text-sm text-gray-500">{flight.flightNumber} • {flight.aircraft}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">${flight.price}</div>
            <div className="text-sm text-gray-500">per person</div>
          </div>
        </div>

        {/* Flight Route */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">{formatTime(flight.departure.time)}</div>
            <div className="text-sm text-gray-600">{flight.departure.airport}</div>
            <div className="text-xs text-gray-500">{flight.departure.city}</div>
          </div>
          
          <div className="flex-1 px-4">
            <div className="flex items-center justify-center mb-1">
              <div className="flex-1 h-px bg-gray-300"></div>
              <div className="px-3">
                <Plane className="w-4 h-4 text-gray-400 transform rotate-90" />
              </div>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                {flight.duration}
              </div>
              <div className="text-xs text-gray-500">
                {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
              </div>
            </div>
          </div>
          
          <div className="text-center flex-1">
            <div className="text-2xl font-bold text-gray-900">{formatTime(flight.arrival.time)}</div>
            <div className="text-sm text-gray-600">{flight.arrival.airport}</div>
            <div className="text-xs text-gray-500">{flight.arrival.city}</div>
          </div>
        </div>

        {/* Stops Info */}
        {flight.stops > 0 && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-yellow-50 rounded-lg">
            <MapPin className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-700">
              {flight.stops} stop{flight.stops > 1 ? 's' : ''} • View details
            </span>
          </div>
        )}

        {/* Select Button */}
        <button
          onClick={() => onSelect(flight)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 group-hover:bg-blue-700"
        >
          Select Flight
        </button>
      </div>
    </div>
  );
}