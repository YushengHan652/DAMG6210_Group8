# Formula 1 Management System

## Group 8

### Team Members:
- Varun Singh
- Ashwin Thankachan
- Sean (Yusheng) Han
- Weijia Fang
- Shruti Dixit

---

## Background:

Formula 1 (F1) is a globally renowned sport that demands cutting-edge technology and data-driven decisions. To meet the growing complexity of team operations, we propose developing an advanced F1 Team Management System—a centralized database solution tailored to the unique needs of F1 teams.

This system will utilize relational databases to store and manage critical data such as driver profiles, telemetry, race statistics, car configurations, budgets, and sponsorship records. Features like SQL querying, data normalization, and efficient indexing will ensure optimal performance for real-time data retrieval and analysis.

Additionally, the system will integrate functionalities for role-based access control, transaction management, and data warehousing to support decision-making processes and cross-departmental collaboration. By leveraging modern database architectures, the F1 Team Management System will enhance operational efficiency, support predictive analytics, and empower teams to adapt swiftly to Formula 1's dynamic demands.

---

## Project Description:

Develop a database system using SQL to efficiently manage and organize data for key entities. The system will support streamlined data operations and ensure seamless integration of these entities to meet the functional requirements of an online retail platform. It will also use generative AI to analyze the stored data to help the manager make better decisions.

---

## Mission Objectives:

Develop the following entities and design their relationships:

1. **Team**: Represents the official team.
2. **Driver**: Represents multiple drivers involved in the sport.
3. **Race**: Details about the race like the race season, year, weather conditions, etc.
4. **Circuit**: Represents the information about the circuit like the length, number of laps, seating capacity, etc.
5. **Car**: Information about the car, including the team it belongs to and its specifications.
6. **Season**: Information about the season, such as the year, season winners, and the number of races in the season.
7. **Sponsor**: Information about the sponsor of each team.
8. **Car Parts**: Inventory and technical details of components used in the cars.
9. **Championships**: Data about championship winners, point tables, and more.
10. **Tires**: Types of tires that can be used for the cars over the weekend.
11. **Records**: Holds information about all the records in the sport.


# Backend

A comprehensive Django web application for managing Formula 1 racing data, with REST API and CURL functionality for external data integration.

## Features

- Complete Formula 1 data modeling based on real-world F1 database schema
- REST API for accessing all F1 data entities
- CURL integration with external F1 data sources like Ergast API
- Weather API integration for race location forecasts
- Dashboard with current season statistics
- Detailed views for teams, drivers, races, circuits, and more
- Admin interface for managing all data
- Data synchronization between the database and external sources

## Prerequisites

- Python 3.8+
- pip and virtualenv
- ODBC Driver 17 for SQL Server
- Azure SQL Server instance with the F1 database schema

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/f1-management.git
cd f1-management
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install the dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on the `.env.example` file:

```bash
cp .env.example .env
```

5. Edit the `.env` file with your actual configuration values.

6. Apply the migrations:

```bash
python manage.py migrate
```

7. Create a superuser for the admin interface:

```bash
python manage.py createsuperuser
```

8. Run the development server:

```bash
python manage.py runserver
```

The application should now be accessible at http://localhost:8000/

## Database Setup

This application is designed to work with an Azure SQL database that has the F1 schema already created. The SQL scripts provided in the project should be executed on your Azure SQL instance in the following order:

1. `DDL1.sql` - Creates the database schema
2. `DML.sql` - Populates the tables with sample data
3. `DQL.sql` - Creates useful views for querying data

## API Endpoints

The application provides a RESTful API for accessing all F1 data. Here are some examples:

- `/api/teams/` - List all teams
- `/api/drivers/` - List all drivers
- `/api/races/` - List all races
- `/api/seasons/` - List all seasons
- `/api/circuits/` - List all circuits
- `/api/teams/1/drivers/` - List drivers for a specific team
- `/api/drivers/1/race_results/` - List race results for a specific driver

For more details, visit the API documentation page at http://localhost:8000/api/

## External API Integration

The application can integrate with external F1 data sources using CURL functionality. This is handled by the `F1ExternalAPI` class in `racing/services.py`.

Examples of external data that can be fetched:

- Current season schedule
- Driver standings
- Constructor (team) standings
- Race results
- Driver and team information

## Weather Integration

The application can fetch weather data for race locations using the OpenWeatherMap API. This is handled by the `WeatherAPI` class in `racing/services.py`.

# Frontend

A React-based frontend application for the F1 Management system, built with Vite, React Router, and Tailwind CSS.

## Features

- Modern, responsive UI for browsing F1 data
- Dashboard with current standings and race schedule
- Team and driver profiles with detailed statistics
- Race results and circuit information
- Data visualization with Recharts
- Responsive design for all device sizes

## Prerequisites

- Node.js 16+
- npm or yarn

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn
```

3. Create a `.env` file based on the `.env.example` file

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:5173/

## Integration with Backend

This frontend is designed to work with the Django backend API. By default, the Vite development server will proxy API requests to http://localhost:8000/api.

To configure this, see the `vite.config.js` file:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

## Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory and can be served by any static file server.

## Project Structure

- `src/api/` - API client and service functions
- `src/components/` - Reusable UI components
- `src/pages/` - Page components for different routes
- `src/context/` - React context providers for global state
- `src/hooks/` - Custom React hooks
- `src/utils/` - Utility functions
- `src/styles/` - Global CSS styles

## Styling

This project uses Tailwind CSS for styling. The main styling configuration can be found in:

- `tailwind.config.js` - Tailwind configuration
- `src/styles/index.css` - Global styles and Tailwind imports

