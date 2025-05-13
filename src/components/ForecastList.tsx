import React from 'react';
import { ForecastData } from '../types/weather';
import { getDayFromTimestamp, getDateFromTimestamp } from '../utils/weatherUtils';
import { useSpring, animated } from 'react-spring';
import { Droplet, Wind } from 'lucide-react';

interface ForecastListProps {
  forecast: ForecastData[];
}

const ForecastList: React.FC<ForecastListProps> = ({ forecast }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg text-white">
      <h3 className="text-lg font-semibold mb-4">5-Day Forecast</h3>
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <ForecastDay key={day.dt} day={day} index={index} />
        ))}
      </div>
    </div>
  );
};

interface ForecastDayProps {
  day: ForecastData;
  index: number;
}

const ForecastDay: React.FC<ForecastDayProps> = ({ day, index }) => {
  const slideInProps = useSpring({
    from: { opacity: 0, transform: 'translateX(20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
    delay: index * 100,
    config: { tension: 280, friction: 20 }
  });

  const weatherIcon = day.weather[0].icon;
  const weatherDesc = day.weather[0].description;

  return (
    <animated.div 
      style={slideInProps}
      className="flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-all"
    >
      <div className="flex items-center">
        <div className="w-20">
          <p className="font-medium">{getDayFromTimestamp(day.dt)}</p>
          <p className="text-xs opacity-70">{getDateFromTimestamp(day.dt)}</p>
        </div>
        
        <div className="flex items-center ml-2">
          <img 
            src={`https://openweathermap.org/img/wn/${weatherIcon}.png`} 
            alt={weatherDesc} 
            className="w-10 h-10 mr-1"
          />
          <span className="capitalize text-sm">{weatherDesc}</span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-end md:items-center">
        <div className="flex items-center mr-4 mb-1 md:mb-0">
          <Droplet size={14} className="mr-1 text-blue-300" />
          <span className="text-xs">{day.humidity}%</span>
        </div>
        
        <div className="flex items-center mr-4 mb-1 md:mb-0">
          <Wind size={14} className="mr-1 text-blue-300" />
          <span className="text-xs">{day.wind_speed} m/s</span>
        </div>
        
        <div className="font-semibold text-base">
          <span className="text-blue-300">{day.temp.min}°</span>
          <span className="mx-1">|</span>
          <span>{day.temp.max}°</span>
        </div>
      </div>
    </animated.div>
  );
};

export default ForecastList;