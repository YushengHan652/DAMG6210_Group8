import requests
import logging
import json
from django.conf import settings

logger = logging.getLogger(__name__)

class F1ExternalAPI:
    """
    This class handles interactions with external F1-related APIs.
    You can expand this to integrate with Ergast F1 API, F1 official API, or any other race data source.
    """
    
    def __init__(self, base_url=None, api_key=None):
        self.base_url = base_url or "https://ergast.com/api/f1"
        self.api_key = api_key
        self.headers = {"Content-Type": "application/json"}
        if api_key:
            self.headers["Authorization"] = f"Bearer {self.api_key}"
    
    def _make_request(self, endpoint, method="GET", params=None, data=None):
        """
        Makes a request to the API.
        
        Args:
            endpoint (str): The API endpoint to access
            method (str): HTTP method (GET, POST, PUT, DELETE)
            params (dict): Query parameters for the request
            data (dict): Data payload for POST/PUT requests
            
        Returns:
            dict: Response data in JSON format
            
        Raises:
            Exception: If request fails
        """
        url = f"{self.base_url}/{endpoint}"
        
        try:
            if method == "GET":
                response = requests.get(url, params=params, headers=self.headers)
            elif method == "POST":
                response = requests.post(url, json=data, headers=self.headers)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=self.headers)
            elif method == "DELETE":
                response = requests.delete(url, headers=self.headers)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            response.raise_for_status()
            
            # For Ergast API, which returns JSON with .json extension
            if "ergast.com" in self.base_url and "json" not in url:
                url = f"{url}.json"
                return self._make_request(endpoint, method, params, data)
                
            return response.json()
        
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed: {e}")
            raise
    
    # F1 Schedule API methods
    def get_current_season_schedule(self):
        """Get the current season race schedule"""
        return self._make_request("current")
    
    def get_season_schedule(self, year):
        """Get a specific season's race schedule"""
        return self._make_request(str(year))
    
    def get_race_results(self, year, round_number):
        """Get results for a specific race"""
        return self._make_request(f"{year}/{round_number}/results")
    
    def get_driver_standings(self, year=None, round_number=None):
        """Get driver standings, optionally for a specific year/round"""
        if year and round_number:
            endpoint = f"{year}/{round_number}/driverStandings"
        elif year:
            endpoint = f"{year}/driverStandings"
        else:
            endpoint = "current/driverStandings"
        return self._make_request(endpoint)
    
    def get_constructor_standings(self, year=None, round_number=None):
        """Get constructor (team) standings, optionally for a specific year/round"""
        if year and round_number:
            endpoint = f"{year}/{round_number}/constructorStandings"
        elif year:
            endpoint = f"{year}/constructorStandings"
        else:
            endpoint = "current/constructorStandings"
        return self._make_request(endpoint)
    
    def get_driver_info(self, driver_id):
        """Get information about a specific driver"""
        return self._make_request(f"drivers/{driver_id}")
    
    def get_team_info(self, constructor_id):
        """Get information about a specific team (constructor)"""
        return self._make_request(f"constructors/{constructor_id}")


class WeatherAPI:
    """
    Service to fetch weather data for race locations.
    This can be useful for predicting race conditions.
    """
    
    def __init__(self, api_key=None):
        self.api_key = api_key or settings.WEATHER_API_KEY
        self.base_url = "https://api.openweathermap.org/data/2.5"
    
    def get_current_weather(self, city, country_code=None):
        """
        Get current weather for a location
        
        Args:
            city (str): City name
            country_code (str, optional): ISO 3166 country code
            
        Returns:
            dict: Weather data
        """
        params = {
            "q": city if not country_code else f"{city},{country_code}",
            "appid": self.api_key,
            "units": "metric"
        }
        
        try:
            response = requests.get(f"{self.base_url}/weather", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Weather API request failed: {e}")
            return {"error": str(e)}
    
    def get_forecast(self, city, country_code=None, days=5):
        """
        Get weather forecast for a location
        
        Args:
            city (str): City name
            country_code (str, optional): ISO 3166 country code
            days (int): Number of days to forecast (max 5)
            
        Returns:
            dict: Forecast data
        """
        params = {
            "q": city if not country_code else f"{city},{country_code}",
            "appid": self.api_key,
            "units": "metric",
            "cnt": min(days * 8, 40)  # API returns data in 3-hour steps
        }
        
        try:
            response = requests.get(f"{self.base_url}/forecast", params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Weather API request failed: {e}")
            return {"error": str(e)}


class DataSyncService:
    """
    Service to sync data between our database and external sources.
    This can be used to keep race data up-to-date.
    """
    
    def __init__(self):
        self.f1_api = F1ExternalAPI()
    
    def sync_current_season(self):
        """
        Sync current season race schedule and results from Ergast API
        
        Returns:
            dict: Summary of synced data
        """
        try:
            # Get current season data
            current_season_data = self.f1_api.get_current_season_schedule()
            
            # Process and store the data
            # (Implementation depends on your specific needs)
            
            return {
                "status": "success",
                "message": "Current season data synced successfully",
                "data": current_season_data
            }
            
        except Exception as e:
            logger.error(f"Failed to sync current season data: {e}")
            return {
                "status": "error",
                "message": f"Failed to sync data: {str(e)}"
            }
    
    def sync_race_results(self, year, round_number):
        """
        Sync results for a specific race
        
        Args:
            year (int): Season year
            round_number (int): Race round number
            
        Returns:
            dict: Summary of synced data
        """
        try:
            # Get race results
            race_results = self.f1_api.get_race_results(year, round_number)
            
            # Process and store the data
            # (Implementation depends on your specific needs)
            
            return {
                "status": "success",
                "message": f"Race results for {year} round {round_number} synced successfully",
                "data": race_results
            }
            
        except Exception as e:
            logger.error(f"Failed to sync race results: {e}")
            return {
                "status": "error",
                "message": f"Failed to sync race results: {str(e)}"
            }