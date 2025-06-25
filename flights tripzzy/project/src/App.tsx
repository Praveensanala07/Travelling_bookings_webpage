import React, { useState } from 'react';
import { Plane, MapPin, Star } from 'lucide-react';
import SearchForm from './components/SearchForm';
import FlightResults from './components/FlightResults';
import BookingFlow from './components/BookingFlow';

function App() {
  const [currentView, setCurrentView] = useState<'search' | 'results' | 'booking'>('search');
  const [searchData, setSearchData] = useState<any>(null);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const handleSearch = (data: any) => {
    setSearchData(data);
    setCurrentView('results');
  };

  const handleFlightSelect = (flight: any) => {
    setSelectedFlight(flight);
    setCurrentView('booking');
  };

  const handleBackToResults = () => {
    setCurrentView('results');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSearchData(null);
    setSelectedFlight(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={handleBackToSearch}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SkyBooker</h1>
                <p className="text-xs text-gray-500">Your Journey Starts Here</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Flights</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Hotels</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Cars</a>
              <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Packages</a>
            </nav>

            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Sign In</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show on search view */}
      {currentView === 'search' && (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"> Flight</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Search, compare, and book flights from hundreds of airlines worldwide. 
              Your next adventure is just a click away.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 mb-12">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>Trusted by millions</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>500+ destinations</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-500" />
                <span>200+ airlines</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {currentView === 'search' && (
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        )}

        {currentView === 'results' && searchData && (
          <FlightResults 
            searchData={searchData} 
            onFlightSelect={handleFlightSelect}
          />
        )}

        {currentView === 'booking' && selectedFlight && searchData && (
          <BookingFlow 
            flight={selectedFlight}
            searchData={searchData}
            onBack={handleBackToResults}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">SkyBooker</span>
              </div>
              <p className="text-gray-400">Your trusted partner for seamless travel experiences worldwide.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Flight Booking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hotel Reservations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Car Rentals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Insurance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SkyBooker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;