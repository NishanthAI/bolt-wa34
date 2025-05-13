export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_deg: number;
    pressure: number;
    uvi: number;
    visibility: number;
    weather: {
      id: number;
      main: string;
      description: string;
      icon: string;
    }[];
    dt: number; // timestamp
    sunrise: number;
    sunset: number;
  };
  forecast: ForecastData[];
  hourly: HourlyData[];
  isDay: boolean;
}

export interface ForecastData {
  dt: number; // timestamp
  temp: {
    day: number;
    min: number;
    max: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  humidity: number;
  wind_speed: number;
  pop: number; // probability of precipitation
}

export interface HourlyData {
  dt: number; // timestamp
  temp: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

export interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
  id: string; // unique identifier
  isFavorite: boolean;
}

export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  favoriteLocations: Location[];
  currentLocation: Location | null;
}

export enum WeatherCondition {
  Clear = 'clear',
  Clouds = 'clouds',
  Rain = 'rain',
  Drizzle = 'drizzle',
  Thunderstorm = 'thunderstorm',
  Snow = 'snow',
  Mist = 'mist',
  Smoke = 'smoke',
  Haze = 'haze',
  Dust = 'dust',
  Fog = 'fog',
  Sand = 'sand',
  Ash = 'ash',
  Squall = 'squall',
  Tornado = 'tornado'
}