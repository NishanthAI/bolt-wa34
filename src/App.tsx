import React, { useMemo } from 'react';
import { useWeather } from './hooks/useWeather';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import ForecastChart from './components/ForecastChart';
import LocationSearch from './components/LocationSearch';
import { getWeatherCondition, getBackgroundImage } from './utils/weatherUtils';

function App() {
  const {
    weatherData,
    loading,
    error,
    favoriteLocations,
    currentLocation,
    getUserLocation,
    fetchWeatherData,
    searchWeatherByLocation,
    addToFavorites,
    removeFromFavorites
  } = useWeather();

  const backgroundImage = useMemo(() => {
    if (!weatherData) return '';
    
    const condition = getWeatherCondition(weatherData.current.weather[0].id);
    return getBackgroundImage(condition, weatherData.isDay);
  }, [weatherData]);

  const handleToggleFavorite = () => {
    if (!currentLocation) return;
    
    if (currentLocation.isFavorite) {
      removeFromFavorites(currentLocation.id);
    } else {
      addToFavorites(currentLocation);
    }
  };

  const handleLocationSelect = (location) => {
    fetchWeatherData(location);
  };

  const handleSearchLocation = (query: string) => {
    searchWeatherByLocation(query);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Weather <span className="text-blue-400">Dashboard</span>
            </h1>
            <LocationSearch 
              onLocationSelect={handleLocationSelect} 
              favoriteLocations={favoriteLocations}
              onUserLocation={getUserLocation}
            />
          </div>
        </header>

        <main>
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 backdrop-blur-md p-4 rounded-xl text-white text-center">
              <p>{error}</p>
              <button 
                onClick={getUserLocation} 
                className="mt-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && weatherData && (
            <>
              <div className="mb-6">
                <CurrentWeather 
                  data={weatherData} 
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={currentLocation?.isFavorite || false}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <ForecastChart hourlyData={weatherData.hourly} />
                <ForecastList forecast={weatherData.forecast} />
              </div>
            </>
          )}
        </main>

        <footer className="mt-auto pt-8 text-white/80 text-center text-sm">
          <p>
            Powered by OpenWeatherMap API. Created with 💙 using React & Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;