USE F1ManagementDB;
GO

-- Insert TEAM data
INSERT INTO TEAM (Team_Name, Team_Country, Team_Principal, Budget, Tires_Supplier, Championships_Won, Founded_Year)
VALUES 
('Red Bull Racing', 'Austria', 'Christian Horner', 175000000.00, 'Pirelli', 6, 2005),
('Mercedes-AMG Petronas', 'Germany', 'Toto Wolff', 170000000.00, 'Pirelli', 8, 1970),
('Scuderia Ferrari', 'Italy', 'Frederic Vasseur', 160000000.00, 'Pirelli', 16, 1950),
('McLaren Racing', 'United Kingdom', 'Andrea Stella', 145000000.00, 'Pirelli', 8, 1966),
('Aston Martin', 'United Kingdom', 'Mike Krack', 135000000.00, 'Pirelli', 1, 2021),
('Alpine F1 Team', 'France', 'Bruno Famin', 125000000.00, 'Pirelli', 2, 1977),
('Williams Racing', 'United Kingdom', 'James Vowles', 115000000.00, 'Pirelli', 9, 1977),
('AlphaTauri', 'Italy', 'Franz Tost', 110000000.00, 'Pirelli', 0, 2020),
('Sauber', 'Switzerland', 'Alessandro Alunni Bravi', 105000000.00, 'Pirelli', 0, 1993),
('Haas F1 Team', 'United States', 'Guenther Steiner', 95000000.00, 'Pirelli', 0, 2016);


-- Insert SEASON data (without champion references for now)
INSERT INTO SEASON (Year, Number_of_Races, Title_Sponsor, Prize_Money_Awarded)
VALUES 
(2020, 17, 'Rolex', 670000000.00),
(2021, 22, 'Heineken', 700000000.00),
(2022, 22, 'Aramco', 730000000.00),
(2023, 23, 'Rolex', 765000000.00),
(2024, 24, 'AWS', 790000000.00),
(2025, 24, 'Crypto.com', 800000000.00),
(2019, 21, 'Emirates', 660000000.00),
(2018, 21, 'DHL', 640000000.00),
(2017, 20, 'Heineken', 620000000.00),
(2016, 21, 'Pirelli', 600000000.00);


-- Insert CIRCUIT data
INSERT INTO CIRCUIT (Name, Country, Seating_Capacity, Number_of_DRS, DRS_Zones, Number_of_Turns, Length_Circuit, Type)
VALUES 
('Silverstone', 'United Kingdom', 150000, 2, 2, 18, 5.891, 'Permanent'),
('Monza', 'Italy', 120000, 2, 2, 11, 5.793, 'Permanent'),
('Spa-Francorchamps', 'Belgium', 100000, 2, 2, 19, 7.004, 'Permanent'),
('Monaco', 'Monaco', 37000, 1, 1, 19, 3.337, 'Street'),
('Suzuka', 'Japan', 155000, 1, 1, 18, 5.807, 'Permanent'),
('Circuit of the Americas', 'United States', 120000, 2, 2, 20, 5.513, 'Permanent'),
('Interlagos', 'Brazil', 60000, 2, 2, 15, 4.309, 'Permanent'),
('Albert Park', 'Australia', 80000, 3, 3, 16, 5.303, 'Street'),
('Yas Marina', 'UAE', 60000, 2, 2, 16, 5.554, 'Permanent'),
('Bahrain International Circuit', 'Bahrain', 70000, 3, 3, 15, 5.412, 'Permanent');


-- Insert DRIVER data
INSERT INTO DRIVER (Name, Age, Nationality, Team_ID, Number_of_Wins, Salary, Contract_End_Date, Pole_Positions, Fastest_Laps, Contract_Start_Date)
VALUES 
('Max Verstappen', 27, 'Netherlands', 1, 54, 45000000.00, '2028-12-31', 30, 21, '2021-01-01'),
('Lewis Hamilton', 39, 'United Kingdom', 2, 103, 48000000.00, '2025-12-31', 103, 62, '2020-01-01'),
('Charles Leclerc', 26, 'Monaco', 3, 7, 17000000.00, '2026-12-31', 24, 8, '2019-01-01'),
('Lando Norris', 24, 'United Kingdom', 4, 2, 14000000.00, '2026-12-31', 6, 6, '2019-01-01'),
('Fernando Alonso', 43, 'Spain', 5, 33, 18000000.00, '2025-12-31', 22, 23, '2023-01-01'),
('Pierre Gasly', 28, 'France', 6, 1, 6000000.00, '2025-12-31', 1, 2, '2023-01-01'),
('Alex Albon', 28, 'Thailand', 7, 0, 5000000.00, '2025-12-31', 0, 0, '2022-01-01'),
('Yuki Tsunoda', 24, 'Japan', 8, 0, 3000000.00, '2025-12-31', 0, 1, '2021-01-01'),
('Valtteri Bottas', 35, 'Finland', 9, 10, 9000000.00, '2025-12-31', 20, 18, '2022-01-01'),
('Kevin Magnussen', 32, 'Denmark', 10, 0, 2500000.00, '2025-12-31', 1, 2, '2022-01-01');


-- Update CAR data
INSERT INTO CAR (Model, Chassis, Engine_Manufacturer, Team_ID, Aerodynamics_Package, Weight, Horsepower, Tyre_Supplier)
VALUES 
('RB20', 'RB20', 'Honda RBPT', 1, 'High Downforce', 798.00, 1000, 'Pirelli'),
('W15', 'W15', 'Mercedes', 2, 'Medium Downforce', 798.00, 1000, 'Pirelli'),
('SF-24', 'SF-24', 'Ferrari', 3, 'Medium Downforce', 799.00, 1000, 'Pirelli'),
('MCL38', 'MCL38', 'Mercedes', 4, 'Low Drag', 798.00, 1000, 'Pirelli'),
('AMR24', 'AMR24', 'Mercedes', 5, 'High Downforce', 798.00, 1000, 'Pirelli'),
('A524', 'A524', 'Renault', 6, 'Medium Downforce', 799.00, 980, 'Pirelli'),
('FW46', 'FW46', 'Mercedes', 7, 'Low Drag', 800.00, 1000, 'Pirelli'),
('VCARB01', 'VCARB01', 'Honda RBPT', 8, 'Medium Downforce', 798.00, 1000, 'Pirelli'),
('C44', 'C44', 'Ferrari', 9, 'Medium Downforce', 799.00, 1000, 'Pirelli'),
('VF-24', 'VF-24', 'Ferrari', 10, 'Low Drag', 798.00, 1000, 'Pirelli');


-- Insert CIRCUIT data
INSERT INTO CIRCUIT (Name, Country, Seating_Capacity, Number_of_DRS, DRS_Zones, Number_of_Turns, Length_Circuit, Type)
VALUES 
('Silverstone Circuit', 'United Kingdom', 150000, 2, 2, 18, 5.891, 'Permanent'),
('Circuit de Monaco', 'Monaco', 37000, 1, 1, 19, 3.337, 'Street'),
('Suzuka Circuit', 'Japan', 155000, 2, 2, 18, 5.807, 'Permanent'),
('Monza', 'Italy', 120000, 2, 2, 11, 5.793, 'Permanent'),
('Spa-Francorchamps', 'Belgium', 100000, 2, 2, 19, 7.004, 'Permanent'),
('Albert Park Circuit', 'Australia', 80000, 3, 3, 16, 5.303, 'Street'),
('Marina Bay Street Circuit', 'Singapore', 85000, 2, 2, 23, 5.063, 'Street'),
('Circuit of the Americas', 'United States', 120000, 2, 2, 20, 5.513, 'Permanent'),
('Interlagos', 'Brazil', 60000, 2, 2, 15, 4.309, 'Permanent'),
('Yas Marina Circuit', 'UAE', 60000, 2, 2, 16, 5.554, 'Permanent');


-- Insert STAFF data
INSERT INTO STAFF (Team_ID, Name, DOB, Nationality, Employment_status, Salary, First_Terms)
VALUES 
(1, 'Emma Clarke', '1985-06-15', 'United Kingdom', 'Full-time', 85000.00, 'Lead Engineer'),
(2, 'Liam Bauer', '1980-03-20', 'Germany', 'Full-time', 95000.00, 'Race Strategist'),
(3, 'Isabella Rossi', '1990-11-05', 'Italy', 'Part-time', 60000.00, 'Aerodynamicist'),
(4, 'Noah Smith', '1988-09-12', 'Canada', 'Full-time', 80000.00, 'Data Analyst'),
(5, 'Chloe Zhang', '1992-02-28', 'China', 'Contractor', 72000.00, 'Performance Engineer');
 

-- Insert ENGINEER data
INSERT INTO ENGINEER (Staff_ID, Car_Budget, Car_Responsibility)
VALUES 
(1, 1200000.00, 'Power Unit'),
(2, 1500000.00, 'Strategy & Planning'),
(3, 1000000.00, 'Aerodynamics'),
(4, 900000.00, 'Telemetry'),
(5, 950000.00, 'Simulation & Modeling');


-- Insert MECHANIC data
INSERT INTO MECHANIC (Staff_ID, Specialization, Experience_Years)
VALUES 
(1, 'Suspension Systems', 12),
(2, 'Braking Systems', 15),
(3, 'Transmission', 10),
(4, 'Power Unit', 8),
(5, 'Wings and Aero Parts', 9);


-- Insert SPONSOR data
INSERT INTO SPONSOR (Sponsor_Name, Industry, Headquarters, Annual_Funding, Sponsorship_Type)
VALUES 
('Rolex', 'Luxury Goods', 'Switzerland', 50000000.00, 'Title'),
('Heineken', 'Beverages', 'Netherlands', 40000000.00, 'Primary'),
('Aramco', 'Oil & Gas', 'Saudi Arabia', 60000000.00, 'Title'),
('AWS', 'Technology', 'USA', 30000000.00, 'Technical'),
('DHL', 'Logistics', 'Germany', 25000000.00, 'Official');


-- MISSING ORIGINAL SECTIONS BELOW
-- Insert RACE data
INSERT INTO RACE (Season_ID, Location, Date, Weather_Condition, Circuit_ID, Circuit_Length, Number_of_Laps, Race_Distance)
VALUES 
(5, 'Silverstone', '2024-07-07', 'Rainy', 1, 5.891, 52, 306.198),
(5, 'Monza', '2024-09-01', 'Sunny', 2, 5.793, 53, 307.029),
(5, 'Spa', '2024-07-28', 'Cloudy', 3, 7.004, 44, 308.052),
(5, 'Monaco', '2024-05-26', 'Sunny', 4, 3.337, 78, 260.286),
(5, 'Suzuka', '2024-04-12', 'Sunny', 5, 5.807, 53, 307.471),
(5, 'Austin', '2024-10-20', 'Sunny', 6, 5.513, 56, 308.405),
(5, 'Sao Paulo', '2024-11-03', 'Rainy', 7, 4.309, 71, 305.879),
(5, 'Melbourne', '2024-03-24', 'Sunny', 8, 5.303, 58, 307.574),
(5, 'Abu Dhabi', '2024-12-08', 'Clear', 9, 5.554, 58, 306.183),
(5, 'Bahrain', '2024-03-02', 'Clear', 10, 5.412, 57, 308.238);


-- Insert RACE_ENTRY data
INSERT INTO RACE_ENTRY (Race_ID, Driver_ID, Car_ID, Grid_Position, Upgrades_Applied, Race_Modifications, Grid_Position_Final)
VALUES 
(1, 1, 1, 1, 'Floor Upgrade, Front Wing', 'Low Downforce Setup', 1),
(1, 2, 2, 2, 'Sidepod Redesign', 'Wet Weather Setup', 2),
(1, 3, 3, 3, 'Diffuser Upgrade', 'Balanced Setup', 3),
(1, 4, 4, 4, 'Rear Wing Upgrade', 'High Downforce Setup', 4),
(1, 5, 5, 5, 'Suspension Upgrade', 'Wet Weather Setup', 5),
(1, 6, 6, 6, 'Brake Ducts Redesign', 'Balanced Setup', 6),
(1, 7, 7, 7, 'Floor Edge Upgrade', 'Wet Weather Setup', 7),
(1, 8, 8, 8, 'DRS Mechanism Update', 'High Downforce Setup', 8),
(1, 9, 9, 9, 'Bargeboard Redesign', 'Balanced Setup', 9),
(1, 10, 10, 10, 'Front Suspension Update', 'Wet Weather Setup', 10),
(2, 1, 1, 1, 'Rear Wing Update', 'Low Drag Setup', 1);


-- Insert RACE_RESULTS data
INSERT INTO RACE_RESULTS (Race_ID, Final_Position, Points_Scored, Pit_Stops, Fastest_Lap_Time, Overtakes_Made, Laps_Completed, DNF_Status, DRIVER_ID)
VALUES 
(1, 1, 25.0, 2, 92.456, 5, 52, 'Completed', 1),
(1, 2, 18.0, 2, 92.788, 3, 52, 'Completed', 2),
(1, 3, 15.0, 2, 93.102, 2, 52, 'Completed', 3),
(1, 4, 12.0, 3, 93.345, 4, 52, 'Completed', 4),
(1, 5, 10.0, 3, 93.723, 1, 52, 'Completed', 5),
(1, 6, 8.0, 2, 94.012, 2, 52, 'Completed', 6),
(1, 7, 6.0, 2, 94.324, 3, 52, 'Completed', 7),
(1, 8, 4.0, 2, 94.567, 1, 52, 'Completed', 8),
(1, NULL, 0.0, 1, 94.789, 0, 30, 'Mechanical', 9),
(1, NULL, 0.0, 2, 94.901, 0, 45, 'Crash', 10),
(2, 1, 25.0, 1, 83.123, 2, 53, 'Completed', 1);


-- Insert STANDINGS data
INSERT INTO STANDINGS (Season_ID, Entity_ID, Entity_Type, Points, Wins, Podiums, Rank, Fastest_Laps)
VALUES 
(5, 1, 'Driver', 395, 15, 20, 1, 8),
(5, 2, 'Driver', 280, 3, 15, 2, 3),
(5, 3, 'Driver', 260, 2, 12, 3, 2),
(5, 4, 'Driver', 255, 2, 11, 4, 1),
(5, 5, 'Driver', 190, 0, 5, 5, 0),
(5, 6, 'Driver', 110, 0, 1, 6, 0),
(5, 7, 'Driver', 35, 0, 0, 7, 0),
(5, 8, 'Driver', 30, 0, 0, 8, 0),
(5, 9, 'Driver', 15, 0, 0, 9, 0),
(5, 10, 'Driver', 10, 0, 0, 10, 0),
(5, 1, 'Team', 650, 15, 35, 1, 10),
(5, 2, 'Team', 450, 3, 25, 2, 4),
(5, 3, 'Team', 350, 2, 20, 3, 3),
(5, 4, 'Team', 300, 2, 15, 4, 1);


-- Insert PENALTIES data
INSERT INTO PENALTIES (Entry_ID, Penalty_Type, Time_Penalty, Penalty_Reason, Penalty_Status)
VALUES 
(3, 'Time', 5, 'Track Limits Violation', 'Applied'),
(5, 'Time', 10, 'Causing a Collision', 'Applied'),
(7, 'Grid', NULL, 'Engine Change', 'Applied'),
(9, 'Points', NULL, 'Dangerous Driving', 'Appealed'),
(10, 'Disqualification', NULL, 'Technical Infringement', 'Overturned'),
(2, 'Time', 5, 'Unsafe Release', 'Applied'),
(4, 'Grid', NULL, 'Gearbox Change', 'Applied'),
(6, 'Time', 5, 'Speeding in Pit Lane', 'Applied'),
(8, 'Fine', NULL, 'Late Scrutineering', 'Applied'),
(1, 'Time', 5, 'Not Respecting Yellow Flags', 'Appealed');


-- Insert FAILURES data
INSERT INTO FAILURES (Entry_ID, Failure_Type, Failure_Description, Failure_Lap, DNF)
VALUES 
(9, 'Engine', 'Engine Failure - Loss of Power', 30, 1),
(10, 'Crash', 'Driver Error - Lost Control at Turn 7', 45, 1),
(3, 'Hydraulics', 'Hydraulic Pressure Loss', NULL, 0),
(5, 'Brakes', 'Brake Temperature Issues', NULL, 0),
(7, 'Electrical', 'Battery System Fault', NULL, 0),
(2, 'Gearbox', 'Gear Selection Problems', NULL, 0),
(4, 'Suspension', 'Front Right Suspension Damage', NULL, 0),
(6, 'Power Unit', 'ERS Deployment Issues', NULL, 0),
(8, 'Cooling', 'Overheating Issues', NULL, 0),
(1, 'Tires', 'Left Rear Tire Degradation', NULL, 0);


-- Insert MANAGER data
INSERT INTO MANAGER (Staff_ID, Team_Budget, Team_Responsibility)
VALUES 
(1, 145000000.00, 'Technical Operations'),
(2, 150000000.00, 'Car Development'),
(3, 160000000.00, 'Performance Engineering'),
(4, 140000000.00, 'Aerodynamics');


-- Insert ANALYST data
INSERT INTO ANALYST (Staff_ID, Skill_Specialty)
VALUES 
(5, 'Race Strategy'),
(6, 'Performance Analysis'),
(7, 'Data Engineering'),
(8, 'Tire Performance');


-- Insert RECORDS data
INSERT INTO RECORDS (Record_Type, Fastest_Lap_Time, Fastest_Pit_Stop, Most_Overtakes, Record_Description, Driver_Of_The_Day)
VALUES 
('Fastest_Lap_Time', 72.103, NULL, NULL, 'Fastest lap at Monza 2024', 'Max Verstappen'),
('Most_Overtakes', NULL, NULL, 15, 'Most overtakes in a single race (Brazil 2024)', 'Lewis Hamilton'),
('Championship_Record', NULL, NULL, NULL, 'Most consecutive driver championships', 'Max Verstappen'),
('Fastest_Lap_Time', NULL, 1.82, NULL, 'Fastest pit stop of 2024 season (Brazil)', 'Red Bull Racing'),
('Most_Wins_Season', NULL, NULL, NULL, 'Most wins in a single season (18)', 'Max Verstappen'),
('Most_Poles_Season', NULL, NULL, NULL, 'Most pole positions in a season (12)', 'Lewis Hamilton'),
('Championship_Record', NULL, NULL, NULL, 'Youngest triple world champion', 'Max Verstappen'),
('Championship_Record', NULL, NULL, NULL, 'Most driver championships (7)', 'Lewis Hamilton'),
('Fastest_Lap_Time', 77.213, NULL, NULL, 'Fastest lap at Monaco 2024', 'Charles Leclerc'),
('Most_Overtakes', NULL, NULL, 10, 'Most overtakes from start position (Silverstone 2024)', 'Lando Norris');