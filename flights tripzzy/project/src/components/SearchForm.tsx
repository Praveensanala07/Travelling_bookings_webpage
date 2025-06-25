import React, { useState } from 'react';
import { Search, Calendar, Users, Plane } from 'lucide-react';

interface SearchFormProps {
  onSearch: (searchData: any) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: 1,
    class: 'economy',
    tripType: 'roundtrip'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const cities = [
    'New York (NYC)', 'Los Angeles (LAX)', 'Chicago (CHI)', 'Miami (MIA)',
    'London (LHR)', 'Paris (CDG)', 'Tokyo (NRT)', 'Sydney (SYD)',
    'Dubai (DXB)', 'Singapore (SIN)', 'Hong Kong (HKG)', 'Bangkok (BKK)'
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Plane className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Search Flights</h2>
      </div>

      {/* Trip Type */}
      <div className="flex gap-4 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="roundtrip"
            checked={searchData.tripType === 'roundtrip'}
            onChange={(e) => setSearchData({...searchData, tripType: e.target.value})}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700 font-medium">Round Trip</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="tripType"
            value="oneway"
            checked={searchData.tripType === 'oneway'}
            onChange={(e) => setSearchData({...searchData, tripType: e.target.value})}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700 font-medium">One Way</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">From</label>
            <div className="relative">
              <input
                list="from-cities"
                value={searchData.from}
                onChange={(e) => setSearchData({...searchData, from: e.target.value})}
                placeholder="Departure city"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                required
              />
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <datalist id="from-cities">
                {cities.map(city => <option key={city} value={city} />)}
              </datalist>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">To</label>
            <div className="relative">
              <input
                list="to-cities"
                value={searchData.to}
                onChange={(e) => setSearchData({...searchData, to: e.target.value})}
                placeholder="Destination city"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                required
              />
              <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <datalist id="to-cities">
                {cities.map(city => <option key={city} value={city} />)}
              </datalist>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Departure Date</label>
            <div className="relative">
              <input
                type="date"
                value={searchData.departDate}
                onChange={(e) => setSearchData({...searchData, departDate: e.target.value})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                required
              />
              <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          {searchData.tripType === 'roundtrip' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Return Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={searchData.returnDate}
                  onChange={(e) => setSearchData({...searchData, returnDate: e.target.value})}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                  required={searchData.tripType === 'roundtrip'}
                />
                <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Passengers and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Passengers</label>
            <div className="relative">
              <select
                value={searchData.passengers}
                onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12 appearance-none"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                ))}
              </select>
              <Users className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Class</label>
            <select
              value={searchData.class}
              onChange={(e) => setSearchData({...searchData, class: e.target.value})}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
        >
          Search Flights
        </button>
      </form>
    </div>
  );
}