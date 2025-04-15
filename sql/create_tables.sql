-- Racing Database Schema Implementation
-- Drop database if it exists
-- IF EXISTS (SELECT * FROM sys.databases WHERE name = 'F1ManagementDB')
--BEGIN
--	DROP DATABASE F1ManagementDB;
--END
--GO
--CREATE DATABASE F1ManagementDB;
--GO

USE F1ManagementDB;

-- Drop tables if they exist (in reverse order of dependencies)
IF OBJECT_ID('PENALTIES', 'U') IS NOT NULL DROP TABLE PENALTIES;
IF OBJECT_ID('FAILURES', 'U') IS NOT NULL DROP TABLE FAILURES;
IF OBJECT_ID('RACE_RESULTS', 'U') IS NOT NULL DROP TABLE RACE_RESULTS;
IF OBJECT_ID('RACE_ENTRY', 'U') IS NOT NULL DROP TABLE RACE_ENTRY;
IF OBJECT_ID('RACE', 'U') IS NOT NULL DROP TABLE RACE;
IF OBJECT_ID('DRIVER', 'U') IS NOT NULL DROP TABLE DRIVER;
IF OBJECT_ID('CAR', 'U') IS NOT NULL DROP TABLE CAR;
IF OBJECT_ID('SPONSORSHIP', 'U') IS NOT NULL DROP TABLE SPONSORSHIP;
IF OBJECT_ID('SPONSOR', 'U') IS NOT NULL DROP TABLE SPONSOR;
IF OBJECT_ID('CIRCUIT', 'U') IS NOT NULL DROP TABLE CIRCUIT;
IF OBJECT_ID('ENGINEER', 'U') IS NOT NULL DROP TABLE ENGINEER;
IF OBJECT_ID('MANAGER', 'U') IS NOT NULL DROP TABLE MANAGER;
IF OBJECT_ID('ANALYST', 'U') IS NOT NULL DROP TABLE ANALYST;
IF OBJECT_ID('MECHANIC', 'U') IS NOT NULL DROP TABLE MECHANIC;
IF OBJECT_ID('STAFF', 'U') IS NOT NULL DROP TABLE STAFF;
IF OBJECT_ID('STANDINGS', 'U') IS NOT NULL DROP TABLE STANDINGS;
IF OBJECT_ID('SEASON', 'U') IS NOT NULL DROP TABLE SEASON;
IF OBJECT_ID('TEAM', 'U') IS NOT NULL DROP TABLE TEAM;
IF OBJECT_ID('RECORDS', 'U') IS NOT NULL DROP TABLE RECORDS;
GO

-- Create tables
-- SEASON table
CREATE TABLE SEASON (
	Season_ID INT PRIMARY KEY IDENTITY(1,1),
	Year INT NOT NULL CHECK (Year >= 1950 AND Year <= 2100),
	Number_of_Races INT NOT NULL CHECK (Number_of_Races > 0),
	Champion_Driver_ID INT NULL,
	Champion_Team_ID INT NULL,
	Title_Sponsor VARCHAR(100) NULL,
	Prize_Money_Awarded MONEY NULL CHECK (Prize_Money_Awarded > 0),
	Time_GMT_Class DATETIME NULL,
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE()
);

-- TEAM table
CREATE TABLE TEAM (
	Team_ID INT PRIMARY KEY IDENTITY(1,1),
	Team_Name VARCHAR(100) NOT NULL,
	Team_Country VARCHAR(50) NOT NULL,
	Team_Principal VARCHAR(100) NULL,
	Budget DECIMAL(15,2) NULL CHECK (Budget > 0),
	Tires_Supplier VARCHAR(50) NULL,
	Championships_Won INT DEFAULT 0 CHECK (Championships_Won >= 0),
	Founded_Year INT NULL CHECK (Founded_Year > 1900),
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE()
);

-- STANDINGS table
CREATE TABLE STANDINGS (
	Standings_ID INT PRIMARY KEY IDENTITY(1,1),
	Season_ID INT NOT NULL,
	Entity_ID INT NOT NULL,
	Entity_Type VARCHAR(10) NOT NULL CHECK (Entity_Type IN ('Team', 'Driver')),
	Points INT DEFAULT 0 CHECK (Points >= 0),
	Wins INT DEFAULT 0 CHECK (Wins >= 0),
	Podiums INT DEFAULT 0 CHECK (Podiums >= 0),
	Rank INT NULL,			
	Fastest_Laps INT DEFAULT 0 CHECK (Fastest_Laps >= 0),
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Season_ID) REFERENCES SEASON(Season_ID)
);

-- STAFF table
CREATE TABLE STAFF (
	Staff_ID INT PRIMARY KEY IDENTITY(1,1),
	Team_ID INT NOT NULL,
	Name VARCHAR(100) NOT NULL,
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	DOB DATE NULL,
	Nationality VARCHAR(50) NULL,
	Employment_status VARCHAR(20) CHECK (Employment_status IN ('Full-time', 'Part-time', 'Contractor', 'Consultant')),
	Salary DECIMAL(12,2) NULL CHECK (Salary > 0),
	First_Terms VARCHAR(255) NULL,
	FOREIGN KEY (Team_ID) REFERENCES TEAM(Team_ID)
);

-- MECHANIC table
CREATE TABLE MECHANIC (
	Staff_ID INT PRIMARY KEY,
	Specialization VARCHAR(100) NOT NULL,
	Experience_Years INT NOT NULL CHECK (Experience_Years >= 0),
	FOREIGN KEY (Staff_ID) REFERENCES STAFF(Staff_ID)
);

-- ANALYST table
CREATE TABLE ANALYST (
	Staff_ID INT PRIMARY KEY,
	Skill_Specialty VARCHAR(100) NOT NULL,
	FOREIGN KEY (Staff_ID) REFERENCES STAFF(Staff_ID)
);

-- MANAGER table
CREATE TABLE MANAGER (
	Staff_ID INT PRIMARY KEY,
	Team_Budget DECIMAL(15,2) NULL CHECK (Team_Budget > 0),
	Team_Responsibility VARCHAR(100) NOT NULL,
	FOREIGN KEY (Staff_ID) REFERENCES STAFF(Staff_ID)
);

-- ENGINEER table
CREATE TABLE ENGINEER (
	Staff_ID INT PRIMARY KEY,
	Car_Budget DECIMAL(15,2) NULL CHECK (Car_Budget > 0),
	Car_Responsibility VARCHAR(100) NOT NULL,
	FOREIGN KEY (Staff_ID) REFERENCES STAFF(Staff_ID)
);

-- SPONSOR table
CREATE TABLE SPONSOR (
	Sponsor_ID INT PRIMARY KEY IDENTITY(1,1),
	Sponsor_Name VARCHAR(100) NOT NULL,
	Industry VARCHAR(50) NOT NULL,
	Headquarters VARCHAR(100) NULL,
	Annual_Funding DECIMAL(15,2) NULL CHECK (Annual_Funding > 0),
	Sponsorship_Type VARCHAR(50) CHECK (Sponsorship_Type IN ('Title', 'Primary', 'Secondary', 'Technical', 'Official')),
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE()
);

-- SPONSORSHIP table
CREATE TABLE SPONSORSHIP (
	Contract_ID INT PRIMARY KEY IDENTITY(1,1),
	Team_ID INT NOT NULL,
	Sponsor_ID INT NOT NULL,
	Contract_Value DECIMAL(15,2) NOT NULL CHECK (Contract_Value > 0),
	Contract_Start DATETIME NOT NULL,
	Contract_End DATETIME NOT NULL,
	FOREIGN KEY (Team_ID) REFERENCES TEAM(Team_ID),
	FOREIGN KEY (Sponsor_ID) REFERENCES SPONSOR(Sponsor_ID),
	CHECK (Contract_End > Contract_Start)
);

-- CAR table
CREATE TABLE CAR (
	Car_ID INT PRIMARY KEY IDENTITY(1,1),
	Model VARCHAR(50) NOT NULL,
	Chassis VARCHAR(50) NOT NULL,
	Engine_Manufacturer VARCHAR(50) NOT NULL,
	Team_ID INT NOT NULL,
	Aerodynamics_Package VARCHAR(50) NULL,
	Weight DECIMAL(6,2) NOT NULL CHECK (Weight > 0),
	Horsepower INT NULL CHECK (Horsepower > 0),
	Tyre_Supplier VARCHAR(50) NULL,
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Team_ID) REFERENCES TEAM(Team_ID)
);

-- DRIVER table
CREATE TABLE DRIVER (
	Driver_ID INT PRIMARY KEY IDENTITY(1,1),
	Name VARCHAR(100) NOT NULL,
	Age INT NOT NULL CHECK (Age >= 16 AND Age <= 65),
	Nationality VARCHAR(50) NOT NULL,
	Team_ID INT NOT NULL,
	Number_of_Wins INT DEFAULT 0 CHECK (Number_of_Wins >= 0),
	Salary DECIMAL(12,2) NULL CHECK (Salary > 0),
	Contract_End_Date DATE NULL,
	Pole_Positions INT DEFAULT 0 CHECK (Pole_Positions >= 0),
	Fastest_Laps INT DEFAULT 0 CHECK (Fastest_Laps >= 0),
	Contract_Start_Date DATE NULL,
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Team_ID) REFERENCES TEAM(Team_ID),
	CHECK (Contract_End_Date > Contract_Start_Date)
);

-- CIRCUIT table
CREATE TABLE CIRCUIT (
	Circuit_ID INT PRIMARY KEY IDENTITY(1,1),
	Name VARCHAR(100) NOT NULL,
	Country VARCHAR(50) NOT NULL,
	Seating_Capacity INT NULL CHECK (Seating_Capacity > 0),
	Number_of_DRS INT DEFAULT 0 CHECK (Number_of_DRS >= 0),
	DRS_Zones INT DEFAULT 0 CHECK (DRS_Zones >= 0),
	Number_of_Turns INT NOT NULL CHECK (Number_of_Turns > 0),
	Length_Circuit DECIMAL(8,3) NOT NULL CHECK (Length_Circuit > 0),
	Lap_Record_Time DECIMAL(8,3) NULL,
	Type VARCHAR(50) NULL CHECK (Type IN ('Street', 'Permanent', 'Temporary', 'Oval')),
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE()
);


-- RACE table
CREATE TABLE RACE (
	Race_ID INT PRIMARY KEY IDENTITY(1,1),
	Season_ID INT NOT NULL,
	Location VARCHAR(100) NOT NULL,
	Date DATE NOT NULL,
	Weather_Condition VARCHAR(50) NULL,
	Circuit_ID INT NOT NULL,
	Circuit_Length DECIMAL(8,3) NOT NULL CHECK (Circuit_Length > 0),
	Number_of_Laps INT NOT NULL CHECK (Number_of_Laps > 0),
	Race_Distance DECIMAL(8,3) NOT NULL CHECK (Race_Distance > 0),
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Season_ID) REFERENCES SEASON(Season_ID),
	FOREIGN KEY (Circuit_ID) REFERENCES CIRCUIT(Circuit_ID)
);

-- RACE_ENTRY table
CREATE TABLE RACE_ENTRY (
	Entry_ID INT PRIMARY KEY IDENTITY(1,1),
	Race_ID INT NOT NULL,
	Driver_ID INT NOT NULL,
	Car_ID INT NOT NULL,
	Grid_Position INT NULL CHECK (Grid_Position > 0),
	Upgrades_Applied VARCHAR(255) NULL,
	Race_Modifications VARCHAR(255) NULL,
	Grid_Position_Final INT NULL CHECK (Grid_Position_Final > 0),
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Race_ID) REFERENCES RACE(Race_ID),
	FOREIGN KEY (Driver_ID) REFERENCES DRIVER(Driver_ID),
	FOREIGN KEY (Car_ID) REFERENCES CAR(Car_ID)
);

-- RACE_RESULTS table
CREATE TABLE RACE_RESULTS (
	Result_ID INT PRIMARY KEY IDENTITY(1,1),
	Race_ID INT NOT NULL,
	Final_Position INT NULL CHECK (Final_Position > 0),
	Points_Scored DECIMAL(5,2) NULL CHECK (Points_Scored >= 0),
	Pit_Stops INT NULL CHECK (Pit_Stops >= 0),
	Fastest_Lap_Time DECIMAL(10,3) NULL,
	Overtakes_Made INT NULL CHECK (Overtakes_Made >= 0),
	Laps_Completed INT NULL CHECK (Laps_Completed >= 0),
	DNF_Status VARCHAR(50) NULL CHECK (DNF_Status IN ('Completed', 'Mechanical', 'Crash', 'Disqualified', 'Retired')),
	DRIVER_ID INT NOT NULL,
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Race_ID) REFERENCES RACE(Race_ID),
	FOREIGN KEY (DRIVER_ID) REFERENCES DRIVER(Driver_ID)
);

-- PENALTIES table
CREATE TABLE PENALTIES (
	Penalty_ID INT PRIMARY KEY IDENTITY(1,1),
	Entry_ID INT NOT NULL,
	Penalty_Type VARCHAR(50) NOT NULL CHECK (Penalty_Type IN ('Time', 'Grid', 'Points', 'Disqualification', 'Fine')),
	Time_Penalty INT NULL,
	Penalty_Reason VARCHAR(255) NOT NULL,
	Penalty_Status VARCHAR(50) NOT NULL CHECK (Penalty_Status IN ('Applied', 'Appealed', 'Overturned')),
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Entry_ID) REFERENCES RACE_ENTRY(Entry_ID)
);

-- FAILURES table
CREATE TABLE FAILURES (
	Failure_ID INT PRIMARY KEY IDENTITY(1,1),
	Entry_ID INT NOT NULL,
	Failure_Type VARCHAR(50) NOT NULL,
	Failure_Description VARCHAR(255) NOT NULL,
	Failure_Lap INT NULL CHECK (Failure_Lap > 0),
	DNF BIT DEFAULT 0,
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE(),
	FOREIGN KEY (Entry_ID) REFERENCES RACE_ENTRY(Entry_ID)
);

-- RECORDS table
CREATE TABLE RECORDS (
	Record_ID INT PRIMARY KEY IDENTITY(1,1),
	Record_Type VARCHAR(50) NOT NULL CHECK (Record_Type IN ('Fastest_Lap_Time', 'Most_Overtakes', 'Most_Wins_Season', 'Fastest_Pit_Stop', 'Most_Poles_Season', 'Championship_Record')),
	Fastest_Lap_Time DECIMAL(10,3) NULL,
	Fastest_Pit_Stop DECIMAL(5,2) NULL CHECK (Fastest_Pit_Stop > 0),
	Most_Overtakes INT NULL CHECK (Most_Overtakes >= 0),
	Record_Description VARCHAR(255) NOT NULL,
	Driver_Of_The_Day VARCHAR(100) NULL,
	DNF_Count INT NULL CHECK (DNF_Count >= 0),
	Longest_DNF_Laps VARCHAR(50) NULL,
	CreatedOn DATETIME DEFAULT GETDATE(),
	ModifiedOn DATETIME DEFAULT GETDATE()
);

-- Update foreign key relationships for SEASON table that had circular references 
ALTER TABLE SEASON ADD CONSTRAINT FK_Season_ChampionDriver FOREIGN KEY (Champion_Driver_ID) REFERENCES DRIVER(Driver_ID);
ALTER TABLE SEASON ADD CONSTRAINT FK_Season_ChampionTeam FOREIGN KEY (Champion_Team_ID) REFERENCES TEAM(Team_ID);
GO