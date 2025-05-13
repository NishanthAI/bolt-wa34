import { WeatherData, WeatherCondition, Location, ForecastData, HourlyData } from '../types/weather';
import { format, fromUnixTime } from 'date-fns';

export const formatWeatherData = (data: any, location: Partial<Location>): WeatherData => {
  const current = data.current;
  const isDay = isDayTime(current.dt, current.sunrise, current.sunset);
  
  return {
    location: {
      name: location.name || '',
      country: location.country || '',
      lat: location.lat || 0,
      lon: location.lon || 0
    },
    current: {
      temp: Math.round(current.temp),
      feels_like: Math.round(current.feels_like),
      humidity: current.humidity,
      wind_speed: current.wind_speed,
      wind_deg: current.wind_deg,
      pressure: current.pressure,
      uvi: current.uvi,
      visibility: current.visibility,
      weather: current.weather,
      dt: current.dt,
      sunrise: current.sunrise,
      sunset: current.sunset
    },
    forecast: data.daily.slice(0, 5).map((day: any): ForecastData => ({
      dt: day.dt,
      temp: {
        day: Math.round(day.temp.day),
        min: Math.round(day.temp.min),
        max: Math.round(day.temp.max)
      },
      weather: day.weather,
      humidity: day.humidity,
      wind_speed: day.wind_speed,
      pop: day.pop
    })),
    hourly: data.hourly.slice(0, 24).map((hour: any): HourlyData => ({
      dt: hour.dt,
      temp: Math.round(hour.temp),
      weather: hour.weather
    })),
    isDay
  };
};

export const getWeatherCondition = (weatherId: number): WeatherCondition => {
  if (weatherId >= 200 && weatherId < 300) return WeatherCondition.Thunderstorm;
  if (weatherId >= 300 && weatherId < 400) return WeatherCondition.Drizzle;
  if (weatherId >= 500 && weatherId < 600) return WeatherCondition.Rain;
  if (weatherId >= 600 && weatherId < 700) return WeatherCondition.Snow;
  if (weatherId === 701) return WeatherCondition.Mist;
  if (weatherId === 711) return WeatherCondition.Smoke;
  if (weatherId === 721) return WeatherCondition.Haze;
  if (weatherId === 731 || weatherId === 761) return WeatherCondition.Dust;
  if (weatherId === 741) return WeatherCondition.Fog;
  if (weatherId === 751) return WeatherCondition.Sand;
  if (weatherId === 762) return WeatherCondition.Ash;
  if (weatherId === 771) return WeatherCondition.Squall;
  if (weatherId === 781) return WeatherCondition.Tornado;
  if (weatherId === 800) return WeatherCondition.Clear;
  if (weatherId >= 801 && weatherId < 900) return WeatherCondition.Clouds;
  
  return WeatherCondition.Clear; // Default
};

export const isDayTime = (current: number, sunrise: number, sunset: number): boolean => {
  return current >= sunrise && current < sunset;
};

export const getTimeFromTimestamp = (timestamp: number): string => {
  return format(fromUnixTime(timestamp), 'h:mm a');
};

export const getDayFromTimestamp = (timestamp: number): string => {
  return format(fromUnixTime(timestamp), 'EEEE');
};

export const getDateFromTimestamp = (timestamp: number): string => {
  return format(fromUnixTime(timestamp), 'MMM d');
};

export const getBackgroundImage = (condition: WeatherCondition, isDay: boolean): string => {
  if (isDay) {
    switch (condition) {
      case WeatherCondition.Clear:
        return 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Clouds:
        return 'https://images.pexels.com/photos/3768/sky-sunny-clouds-cloudy.jpg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Rain:
      case WeatherCondition.Drizzle:
        return 'https://images.pexels.com/photos/110874/pexels-photo-110874.jpeg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Thunderstorm:
        return 'https://images.pexels.com/photos/53459/lightning-storm-weather-sky-53459.jpeg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Snow:
        return 'https://images.pexels.com/photos/869258/pexels-photo-869258.jpeg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Mist:
      case WeatherCondition.Fog:
        return 'https://images.pexels.com/photos/1743392/pexels-photo-1743392.jpeg?auto=compress&cs=tinysrgb&w=1600';
      default:
        return 'https://images.pexels.com/photos/281260/pexels-photo-281260.jpeg?auto=compress&cs=tinysrgb&w=1600';
    }
  } else {
    // Night backgrounds
    switch (condition) {
      case WeatherCondition.Clear:
        return 'https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Clouds:
        return 'https://images.pexels.com/photos/2885320/pexels-photo-2885320.jpeg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Rain:
      case WeatherCondition.Drizzle:
        return 'https://images.pexels.com/photos/268917/pexels-photo-268917.jpeg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Thunderstorm:
        return 'https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg?auto=compress&cs=tinysrgb&w=1600';
      case WeatherCondition.Snow:
        return 'https://images.pexels.com/photos/773594/pexels-photo-773594.jpeg?auto=compress&cs=tinysrgb&w=1600';
      default:
        return 'https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg?auto=compress&cs=tinysrgb&w=1600';
    }
  }
};

export const getTemperatureColor = (temp: number): string => {
  if (temp <= 0) return 'text-blue-600';
  if (temp < 10) return 'text-blue-500';
  if (temp < 20) return 'text-green-500';
  if (temp < 30) return 'text-yellow-500';
  return 'text-red-500';
};

// Convert wind degree to direction
export const getWindDirection = (degree: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
};