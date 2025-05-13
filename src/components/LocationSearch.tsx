import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useSpring, animated } from 'react-spring';
import { Location } from '../types/weather';
import { searchLocations } from '../services/api';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  favoriteLocations: Location[];
  onUserLocation: () => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect, 
  favoriteLocations, 
  onUserLocation 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  
  const searchAnimation = useSpring({
    width: isOpen ? '100%' : '240px',
    config: { tension: 280, friction: 20 }
  });

  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const locations = await searchLocations(query);
      
      // Mark favorites in search results
      const locationsWithFavoriteStatus = locations.map(location => ({
        ...location,
        isFavorite: favoriteLocations.some(fav => 
          fav.lat === location.lat && fav.lon === location.lon
        )
      }));
      
      setResults(locationsWithFavoriteStatus);
    } catch (err) {
      setError('Failed to search locations');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleSelectLocation = (location: Location) => {
    onLocationSelect(location);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };
  
  const handleClickOutside = (e: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div ref={searchRef} className="relative z-10">
      <animated.div 
        style={searchAnimation}
        className="bg-white/10 backdrop-blur-md rounded-full shadow-lg flex items-center"
      >
        <div className="flex-1 flex items-center px-4 py-2">
          <Search size={18} className="text-white" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsOpen(true)}
            className="bg-transparent border-none outline-none text-white placeholder-white/70 w-full pl-2"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 md:px-6 rounded-full text-sm font-medium transition-all"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </animated.div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-white overflow-hidden">
          <button
            onClick={onUserLocation}
            className="w-full flex items-center px-4 py-3 hover:bg-white/10 transition-all text-left"
          >
            <MapPin size={16} className="mr-2 text-blue-300" />
            Use my current location
          </button>
          
          {favoriteLocations.length > 0 && (
            <div className="px-4 py-2">
              <h3 className="text-xs uppercase tracking-wide opacity-70 mb-1">Favorite Locations</h3>
              <div className="divide-y divide-white/10">
                {favoriteLocations.map(location => (
                  <button
                    key={location.id}
                    onClick={() => handleSelectLocation(location)}
                    className="w-full flex items-center py-2 hover:bg-white/10 transition-all text-left"
                  >
                    <span className="text-yellow-500 mr-2">★</span>
                    {location.name}, {location.country}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {results.length > 0 && (
            <div className="px-4 py-2 max-h-60 overflow-y-auto">
              <h3 className="text-xs uppercase tracking-wide opacity-70 mb-1">Search Results</h3>
              <div className="divide-y divide-white/10">
                {results.map(location => (
                  <button
                    key={location.id}
                    onClick={() => handleSelectLocation(location)}
                    className="w-full flex items-center py-2 hover:bg-white/10 transition-all text-left"
                  >
                    {location.isFavorite && <span className="text-yellow-500 mr-2">★</span>}
                    {location.name}, {location.country}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {error && (
            <div className="px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}
          
          {results.length === 0 && query && !isSearching && !error && (
            <div className="px-4 py-3 text-white/70 text-sm">
              No locations found. Try a different search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;