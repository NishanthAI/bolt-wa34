import { useState, useEffect, useCallback } from 'react';
import { WeatherData, Location } from '../types/weather';
import { fetchWeatherByCoords, fetchWeatherByLocation } from '../services/api';

const LOCAL_STORAGE_KEYS = {
  FAVORITE_LOCATIONS: 'weather-dashboard-favorites',
  CURRENT_LOCATION: 'weather-dashboard-current'
};

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favoriteLocations, setFavoriteLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  // Load saved data from localStorage on initialization
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITE_LOCATIONS);
      if (savedFavorites) {
        setFavoriteLocations(JSON.parse(savedFavorites));
      }
      
      const savedCurrentLocation = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_LOCATION);
      if (savedCurrentLocation) {
        setCurrentLocation(JSON.parse(savedCurrentLocation));
      }
    } catch (err) {
      console.error('Error loading saved data:', err);
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    if (favoriteLocations.length > 0) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.FAVORITE_LOCATIONS, 
        JSON.stringify(favoriteLocations)
      );
    }
  }, [favoriteLocations]);

  // Save current location to localStorage when it changes
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CURRENT_LOCATION, 
        JSON.stringify(currentLocation)
      );
    }
  }, [currentLocation]);

  // Get user's current location
  const getUserLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            const data = await fetchWeatherByCoords(latitude, longitude);
            setWeatherData(data);
            
            const newLocation = {
              name: data.location.name,
              country: data.location.country,
              lat: latitude,
              lon: longitude,
              id: `${latitude}-${longitude}`,
              isFavorite: false
            };
            
            setCurrentLocation(newLocation);
            setLoading(false);
          } catch (err) {
            setError('Failed to fetch weather data for your location');
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Failed to get your location. Please search for a location manually.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  // Fetch weather data for a specific location
  const fetchWeatherData = useCallback(async (location: Location) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherByCoords(location.lat, location.lon);
      setWeatherData(data);
      setCurrentLocation(location);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data');
      setLoading(false);
    }
  }, []);

  // Search for a location by name
  const searchWeatherByLocation = useCallback(async (locationName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherByLocation(locationName);
      setWeatherData(data);
      
      const newLocation = {
        name: data.location.name,
        country: data.location.country,
        lat: data.location.lat,
        lon: data.location.lon,
        id: `${data.location.lat}-${data.location.lon}`,
        isFavorite: favoriteLocations.some(
          loc => loc.lat === data.location.lat && loc.lon === data.location.lon
        )
      };
      
      setCurrentLocation(newLocation);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather data for this location');
      setLoading(false);
    }
  }, [favoriteLocations]);

  // Add a location to favorites
  const addToFavorites = useCallback((location: Location) => {
    const updatedLocation = { ...location, isFavorite: true };
    
    setFavoriteLocations(prev => {
      // Check if location already exists in favorites
      if (prev.some(loc => loc.id === location.id)) {
        return prev;
      }
      return [...prev, updatedLocation];
    });
    
    // Update current location if it's the same
    if (currentLocation?.id === location.id) {
      setCurrentLocation(updatedLocation);
    }
  }, [currentLocation]);

  // Remove a location from favorites
  const removeFromFavorites = useCallback((locationId: string) => {
    setFavoriteLocations(prev => prev.filter(loc => loc.id !== locationId));
    
    // Update current location if it's the same
    if (currentLocation?.id === locationId) {
      setCurrentLocation(prev => prev ? { ...prev, isFavorite: false } : null);
    }
  }, [currentLocation]);

  // Initialize by getting user location if no current location is set
  useEffect(() => {
    if (!currentLocation) {
      getUserLocation();
    } else {
      fetchWeatherData(currentLocation);
    }
  }, [currentLocation, fetchWeatherData, getUserLocation]);

  return {
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
  };
};