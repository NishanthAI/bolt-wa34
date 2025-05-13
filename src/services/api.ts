import axios from 'axios';
import { WeatherData, Location } from '../types/weather';
import { formatWeatherData } from '../utils/weatherUtils';

// For demo purposes, we'll use OpenWeatherMap API
// In a real app, you'd store this in environment variables
const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key
const BASE_URL = 'https://api.openweathermap.org/data/3.0';

// Create axios instance with common config
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    appid: API_KEY,
    units: 'metric' // Use metric units by default
  }
});

export const fetchWeatherByCoords = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await api.get('/onecall', {
      params: {
        lat,
        lon,
        exclude: 'minutely,alerts'
      }
    });
    
    // Get location name from coordinates
    const geoResponse = await api.get('https://api.openweathermap.org/geo/1.0/reverse', {
      params: {
        lat,
        lon,
        limit: 1
      }
    });
    
    const locationData = geoResponse.data[0];
    
    return formatWeatherData(response.data, {
      name: locationData.name,
      country: locationData.country,
      lat,
      lon
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

export const fetchWeatherByLocation = async (location: string): Promise<WeatherData> => {
  try {
    // First get coordinates from location name
    const geoResponse = await api.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: location,
        limit: 1
      }
    });
    
    if (!geoResponse.data.length) {
      throw new Error('Location not found');
    }
    
    const { lat, lon, name, country } = geoResponse.data[0];
    
    // Then fetch weather data using coordinates
    const response = await api.get('/onecall', {
      params: {
        lat,
        lon,
        exclude: 'minutely,alerts'
      }
    });
    
    return formatWeatherData(response.data, { name, country, lat, lon });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

export const searchLocations = async (query: string): Promise<Location[]> => {
  try {
    const response = await api.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: {
        q: query,
        limit: 5
      }
    });
    
    return response.data.map((item: any) => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      id: `${item.lat}-${item.lon}`,
      isFavorite: false
    }));
  } catch (error) {
    console.error('Error searching locations:', error);
    throw new Error('Failed to search locations');
  }
};