import React from 'react';
import { MapPin, Thermometer, Wind, Droplet, Sun, Clock } from 'lucide-react';
import { WeatherData } from '../types/weather';
import { getTimeFromTimestamp, getWindDirection, getTemperatureColor } from '../utils/weatherUtils';
import { useSpring, animated } from 'react-spring';

interface CurrentWeatherProps {
  data: WeatherData;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, onToggleFavorite, isFavorite }) => {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 }
  });

  const tempAnimation = useSpring({
    number: data.current.temp,
    from: { number: 0 },
    config: { tension: 170, friction: 14 }
  });

  if (!data) return null;

  const { current, location } = data;
  const weatherIcon = current.weather[0].icon;
  const weatherDesc = current.weather[0].description;
  const tempClass = getTemperatureColor(current.temp);

  return (
    <animated.div style={fadeIn} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg text-white">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center mb-1">
            <MapPin size={18} className="mr-1" />
            <h2 className="text-2xl font-semibold">
              {location.name}, {location.country}
            </h2>
          </div>
          <p className="text-sm opacity-80">
            Updated at {getTimeFromTimestamp(current.dt)}
          </p>
        </div>
        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-full ${
            isFavorite ? 'bg-yellow-500/30' : 'bg-white/20'
          } transition-all hover:bg-white/30`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap mb-6">
        <div className="flex items-center">
          <img
            src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
            alt={weatherDesc}
            className="w-20 h-20 mr-2"
          />
          <div>
            <animated.h1 className={`text-6xl font-bold ${tempClass}`}>
              {tempAnimation.number.to(n => Math.round(n))}°C
            </animated.h1>
            <p className="text-lg capitalize">{weatherDesc}</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0">
          <p className="flex items-center mb-2">
            <Thermometer size={18} className="mr-2" />
            Feels like <span className="font-semibold ml-1">{current.feels_like}°C</span>
          </p>
          <div className="flex items-center space-x-4">
            <p className="flex items-center">
              <Sun size={18} className="mr-1" />
              <span className="text-sm">
                {getTimeFromTimestamp(current.sunrise)}
              </span>
            </p>
            <span>–</span>
            <p className="flex items-center">
              <Clock size={18} className="mr-1" />
              <span className="text-sm">
                {getTimeFromTimestamp(current.sunset)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/10 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <Wind size={16} className="mr-1 text-blue-300" />
            <span className="text-sm font-medium">Wind</span>
          </div>
          <p className="text-xl font-semibold">
            {current.wind_speed} m/s
            <span className="text-sm ml-1">
              {getWindDirection(current.wind_deg)}
            </span>
          </p>
        </div>

        <div className="bg-white/10 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <Droplet size={16} className="mr-1 text-blue-300" />
            <span className="text-sm font-medium">Humidity</span>
          </div>
          <p className="text-xl font-semibold">{current.humidity}%</p>
        </div>

        <div className="bg-white/10 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-1 text-blue-300"
            >
              <path d="M12 2v20" />
              <path d="M2 12h20" />
            </svg>
            <span className="text-sm font-medium">Pressure</span>
          </div>
          <p className="text-xl font-semibold">{current.pressure} hPa</p>
        </div>

        <div className="bg-white/10 p-3 rounded-lg">
          <div className="flex items-center mb-1">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="mr-1 text-blue-300"
            >
              <path d="M2 12h5" />
              <path d="M9 12h5" />
              <path d="M16 12h6" />
            </svg>
            <span className="text-sm font-medium">Visibility</span>
          </div>
          <p className="text-xl font-semibold">{(current.visibility / 1000).toFixed(1)} km</p>
        </div>
      </div>
    </animated.div>
  );
};

export default CurrentWeather;