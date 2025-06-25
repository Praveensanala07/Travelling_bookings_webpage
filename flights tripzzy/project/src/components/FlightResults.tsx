import React, { useState } from 'react';
import { Filter, ArrowUpDown, Star } from 'lucide-react';
import FlightCard from './FlightCard';

interface FlightResultsProps {
  searchData: any;
  onFlightSelect: (flight: any) => void;
}

export default function FlightResults({ searchData, onFlightSelect }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState('price');
  const [filterStops, setFilterStops] = useState('all');

  // Mock flight data
  const mockFlights = [
    {
      id: '1',
      airline: 'SkyWings Airlines',
      flightNumber: 'SW 1234',
      departure: { time: '08:15', airport: 'JFK', city: 'New York' },
      arrival: { time: '11:45', airport: 'LAX', city: 'Los Angeles' },
      duration: '5h 30m',
      stops: 0,
      price: 299,
      aircraft: 'Boeing 737'
    },
    {
      id: '2',
      airline: 'Atlantic Express',
      flightNumber: 'AE 5678',
      departure: { time: '14:30', airport: 'JFK', city: 'New York' },
      arrival: { time: '19:15', airport: 'LAX', city: 'Los Angeles' },
      duration: '6h 45m',
      stops: 1,
      price: 249,
      aircraft: 'Airbus A320'
    },
    {
      id: '3',
      airline: 'Coastal Airways',
      flightNumber: 'CA 9012',
      departure: { time: '06:00', airport: 'JFK', city: 'New York' },
      arrival: { time: '09:25', airport: 'LAX', city: 'Los Angeles' },
      duration: '5h 25m',
      stops: 0,
      price: 359,
      aircraft: 'Boeing 787'
    },
    {
      id: '4',
      airline: 'Horizon Airlines',
      flightNumber: 'HZ 3456',
      departure: { time: '16:45', airport: 'JFK', city: 'New York' },
      arrival: { time: '22:30', airport: 'LAX', city: 'Los Angeles' },
      duration: '7h 45m',
      stops: 2,
      price: 199,
      aircraft: 'Boeing 737'
    },
    {
      id: '5',
      airline: 'Premium Air',
      flightNumber: 'PA 7890',
      departure: { time: '10:15', airport: 'JFK', city: 'New York' },
      arrival: { time: '13:55', airport: 'LAX', city: 'Los Angeles' },
      duration: '5h 40m',
      stops: 0,
      price: 449,
      aircraft: 'Boeing 777'
    }
  ];

  const filteredFlights = mockFlights
    .filter(flight => {
      if (filterStops === 'all') return true;
      if (filterStops === 'nonstop') return flight.stops === 0;
      if (filterStops === '1stop') return flight.stops === 1;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      if (sortBy === 'departure') return a.departure.time.localeCompare(b.departure.time);
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
          <span className="font-semibold text-gray-900">
            {searchData.from} → {searchData.to}
          </span>
          <span>•</span>
          <span>{new Date(searchData.departDate).toLocaleDateString()}</span>
          {searchData.tripType === 'roundtrip' && (
            <>
              <span>•</span>
              <span>Return: {new Date(searchData.returnDate).toLocaleDateString()}</span>
            </>
          )}
          <span>•</span>
          <span>{searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''}</span>
          <span>•</span>
          <span className="capitalize">{searchData.class}</span>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-700">Filters:</span>
          </div>
          
          <select
            value={filterStops}
            onChange={(e) => setFilterStops(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All flights</option>
            <option value="nonstop">Nonstop only</option>
            <option value="1stop">1 stop max</option>
          </select>

          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-gray-700">Sort by:</span>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="price">Price (low to high)</option>
            <option value="duration">Duration</option>
            <option value="departure">Departure time</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Flights ({filteredFlights.length})
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span>Prices include taxes and fees</span>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {filteredFlights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onSelect={onFlightSelect}
          />
        ))}
      </div>

      {filteredFlights.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No flights found</div>
          <div className="text-gray-600">Try adjusting your filters or search criteria</div>
        </div>
      )}
    </div>
  );
}