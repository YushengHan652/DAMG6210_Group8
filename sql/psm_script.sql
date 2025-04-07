-- STORED PROCEDURES


-- SP to get the Top Drivers by the name of the Circuit
ALTER PROCEDURE sp_GetTopDriversByCircuit
    @CircuitName VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @CircuitID INT;

        SELECT @CircuitID = Circuit_ID FROM CIRCUIT WHERE Name = @CircuitName;

        IF @CircuitID IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN;
        END

        SELECT TOP 3 
            D.Name AS Driver_Name,
            T.Team_Name,
            COUNT(RR.Race_ID) AS Races_At_Circuit,
            SUM(RR.Points_Scored) AS Total_Points,
            CAST(AVG(CAST(RR.Final_Position AS FLOAT)) AS DECIMAL(5,2)) AS Avg_Finish_Position
        FROM RACE_RESULTS RR
        INNER JOIN DRIVER D ON RR.DRIVER_ID = D.Driver_ID
        INNER JOIN TEAM T ON D.Team_ID = T.Team_ID
        INNER JOIN RACE R ON RR.Race_ID = R.Race_ID
        WHERE R.Circuit_ID = @CircuitID AND RR.Final_Position IS NOT NULL
        GROUP BY D.Name, T.Team_Name
        ORDER BY SUM(RR.Points_Scored) DESC;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;


EXEC sp_GetTopDriversByCircuit @CircuitName = 'Suzuka';
EXEC sp_GetTopDriversByCircuit @CircuitName = 'Monza';
EXEC sp_GetTopDriversByCircuit @CircuitName = 'Silverstone';


-- SP to get full driver stats by the name of the Driver
ALTER PROCEDURE sp_GetDriverFullStats
    @DriverName VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @DriverID INT;

        SELECT @DriverID = Driver_ID FROM DRIVER WHERE Name = @DriverName;

        IF @DriverID IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN;
        END

        SELECT 
            D.Name AS Driver_Name,
            D.Nationality,
            D.Age,
            T.Team_Name,
            COUNT(DISTINCT RR.Race_ID) AS Total_Races,
            COUNT(CASE WHEN RR.Final_Position = 1 THEN 1 END) AS Wins,
            COUNT(CASE WHEN RR.Final_Position BETWEEN 1 AND 3 THEN 1 END) AS Podiums,
            SUM(RR.Points_Scored) AS Total_Points,
            CAST(AVG(CAST(RR.Final_Position AS FLOAT)) AS DECIMAL(5,2)) AS Avg_Finish_Position,
            MIN(RR.Fastest_Lap_Time) AS Best_Lap_Time,
            COUNT(CASE WHEN RR.DNF_Status != 'Completed' THEN 1 END) AS Total_DNFs,
            COUNT(CASE WHEN F.Failure_Type IS NOT NULL THEN 1 END) AS Mechanical_Failures,
            COUNT(P.Penalty_ID) AS Total_Penalties,
            COUNT(CASE WHEN P.Penalty_Type = 'Grid' THEN 1 END) AS Grid_Penalties,
            COUNT(CASE WHEN P.Penalty_Type = 'Time' THEN 1 END) AS Time_Penalties,
            COUNT(CASE WHEN P.Penalty_Type = 'Points' THEN 1 END) AS Points_Penalties,
            COUNT(CASE WHEN P.Penalty_Type = 'Disqualification' THEN 1 END) AS Disqualifications
        FROM DRIVER D
        LEFT JOIN TEAM T ON D.Team_ID = T.Team_ID
        LEFT JOIN RACE_RESULTS RR ON D.Driver_ID = RR.DRIVER_ID
        LEFT JOIN RACE_ENTRY RE ON D.Driver_ID = RE.Driver_ID
        LEFT JOIN PENALTIES P ON RE.Entry_ID = P.Entry_ID
        LEFT JOIN FAILURES F ON RE.Entry_ID = F.Entry_ID
        WHERE D.Driver_ID = @DriverID
        GROUP BY D.Name, D.Nationality, D.Age, T.Team_Name;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
    END CATCH
END;


EXEC sp_GetDriverFullStats @DriverName = 'Max Verstappen';
EXEC sp_GetDriverFullStats @DriverName = 'Charles Leclerc';
EXEC sp_GetDriverFullStats @DriverName = 'Lando Norris';


-- SP to get the Team and Driver performance by input parameters TeamName and SeasonYear
ALTER PROCEDURE sp_GetTeamAndDriversSeasonPerformance
    @TeamName VARCHAR(100),
    @SeasonYear INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @TeamID INT;
    DECLARE @SeasonID INT;
    DECLARE @TranStarted BIT = 0;

    BEGIN TRY
        -- Start transaction
        BEGIN TRANSACTION;
        SET @TranStarted = 1;

        -- Get Team ID
        SELECT @TeamID = Team_ID FROM TEAM WHERE Team_Name = @TeamName;

        IF @TeamID IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Get Season ID
        SELECT @SeasonID = Season_ID FROM SEASON WHERE Year = @SeasonYear;

        IF @SeasonID IS NULL
        BEGIN
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Team Summary for the Season
        SELECT 
            @SeasonYear AS Season_Year,
            COUNT(DISTINCT R.Race_ID) AS Races_Entered,
            COUNT(CASE WHEN RR.Final_Position = 1 THEN 1 END) AS Wins,
            COUNT(CASE WHEN RR.Final_Position BETWEEN 1 AND 3 THEN 1 END) AS Podiums,
            SUM(RR.Points_Scored) AS Total_Points,
            CAST(AVG(CAST(RR.Final_Position AS FLOAT)) AS DECIMAL(5,2)) AS Avg_Finish_Position
        FROM RACE_RESULTS RR
        INNER JOIN DRIVER D ON RR.Driver_ID = D.Driver_ID
        INNER JOIN RACE R ON RR.Race_ID = R.Race_ID
        WHERE D.Team_ID = @TeamID AND R.Season_ID = @SeasonID;

        -- Drivers' Performance in the Team
        SELECT 
            D.Name AS Driver_Name,
            COUNT(DISTINCT R.Race_ID) AS Races_Entered,
            COUNT(CASE WHEN RR.Final_Position = 1 THEN 1 END) AS Wins,
            COUNT(CASE WHEN RR.Final_Position BETWEEN 1 AND 3 THEN 1 END) AS Podiums,
            SUM(RR.Points_Scored) AS Total_Points,
            CAST(AVG(CAST(RR.Final_Position AS FLOAT)) AS DECIMAL(5,2)) AS Avg_Finish_Position
        FROM RACE_RESULTS RR
        INNER JOIN DRIVER D ON RR.Driver_ID = D.Driver_ID
        INNER JOIN RACE R ON RR.Race_ID = R.Race_ID
        WHERE D.Team_ID = @TeamID AND R.Season_ID = @SeasonID
        GROUP BY D.Name
        ORDER BY Total_Points DESC;

        -- Commit only if transaction started
        IF @TranStarted = 1 COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @TranStarted = 1 ROLLBACK TRANSACTION;
        -- Optional: you can capture and log the error here if needed
    END CATCH
END;


EXEC sp_GetTeamAndDriversSeasonPerformance 
    @TeamName = 'Red Bull Racing', 
    @SeasonYear = 2024;



-- VIEWS

-- view1 Championship Standings View

CREATE VIEW vw_ChampionshipStandings AS
WITH DriverStandings AS (
    SELECT 
        d.Driver_ID,
        d.Name AS DriverName,
        t.Team_Name,
        t.Team_Country,
        SUM(rr.Points_Scored) AS TotalPoints,
        COUNT(CASE WHEN rr.Final_Position = 1 THEN 1 END) AS Wins,
        COUNT(CASE WHEN rr.Final_Position BETWEEN 1 AND 3 THEN 1 END) AS Podiums,
        COUNT(CASE WHEN rr.Fastest_Lap_Time IS NOT NULL AND rr.Points_Scored > 0 THEN 1 END) AS FastestLaps,
        s.Year AS Season,
        'Driver' AS StandingType
    FROM DRIVER d
    JOIN TEAM t ON d.Team_ID = t.Team_ID
    JOIN RACE_RESULTS rr ON d.Driver_ID = rr.DRIVER_ID
    JOIN RACE r ON rr.Race_ID = r.Race_ID
    JOIN SEASON s ON r.Season_ID = s.Season_ID
    WHERE s.Year = 2024
    GROUP BY d.Driver_ID, d.Name, t.Team_Name, t.Team_Country, s.Year
),
TeamStandings AS (
    SELECT 
        t.Team_ID,
        t.Team_Name,
        t.Team_Country,
        SUM(rr.Points_Scored) AS TotalPoints,
        COUNT(CASE WHEN rr.Final_Position = 1 THEN 1 END) AS Wins,
        COUNT(CASE WHEN rr.Final_Position BETWEEN 1 AND 3 THEN 1 END) AS Podiums,
        s.Year AS Season,
        'Team' AS StandingType
    FROM TEAM t
    JOIN DRIVER d ON t.Team_ID = d.Team_ID
    JOIN RACE_RESULTS rr ON d.Driver_ID = rr.DRIVER_ID
    JOIN RACE r ON rr.Race_ID = r.Race_ID
    JOIN SEASON s ON r.Season_ID = s.Season_ID
    WHERE s.Year = 2024
    GROUP BY t.Team_ID, t.Team_Name, t.Team_Country, s.Year
)

SELECT 
    StandingType,
    DriverName AS Name,
    Team_Name AS Team,
    TotalPoints,
    Wins,
    Podiums,
    FastestLaps,
    RANK() OVER (PARTITION BY StandingType ORDER BY TotalPoints DESC, Wins DESC) AS CurrentRank,
    Season
FROM DriverStandings

UNION ALL

SELECT 
    StandingType,
    Team_Name AS Name,
    Team_Country AS Team,
    TotalPoints,
    Wins,
    Podiums,
    0 AS FastestLaps,
    RANK() OVER (PARTITION BY StandingType ORDER BY TotalPoints DESC, Wins DESC) AS CurrentRank,
    Season
FROM TeamStandings;
GO

SELECT * FROM vw_ChampionshipStandings ORDER BY StandingType, CurrentRank;
-- for driver standings
SELECT * 
FROM vw_ChampionshipStandings
WHERE StandingType = 'Driver'
ORDER BY CurrentRank;
-- for team standings
SELECT * 
FROM vw_ChampionshipStandings
WHERE StandingType = 'Team'
ORDER BY CurrentRank;


----view 2 Race Performace Analysis

CREATE VIEW vw_RacePerformanceAnalytics AS
SELECT 
    s.Year AS Season,
    r.Race_ID,
    r.Location AS RaceLocation,
    c.Name AS CircuitName,
    c.Country AS CircuitCountry,
    d.Driver_ID,
    d.Name AS DriverName,
    t.Team_Name,
    car.Model AS CarModel,
    re.Grid_Position AS StartPosition,
    rr.Final_Position AS FinishPosition,
    CASE 
        WHEN re.Grid_Position IS NULL OR rr.Final_Position IS NULL THEN NULL
        ELSE re.Grid_Position - rr.Final_Position 
    END AS PositionsGained,
    rr.Points_Scored,
    rr.Pit_Stops,
    rr.Fastest_Lap_Time,
    rr.Overtakes_Made,
    rr.Laps_Completed,
    r.Number_of_Laps AS TotalRaceLaps,
    CASE 
        WHEN rr.Laps_Completed = r.Number_of_Laps THEN 'Finished'
        ELSE rr.DNF_Status 
    END AS FinishStatus,
    f.Failure_Type,
    f.Failure_Description,
    COUNT(p.Penalty_ID) AS PenaltiesReceived,
    SUM(CASE WHEN p.Penalty_Type = 'Time' THEN p.Time_Penalty ELSE 0 END) AS TotalTimePenalties,
    re.Upgrades_Applied,
    re.Race_Modifications,
    r.Weather_Condition
FROM RACE r
JOIN CIRCUIT c ON r.Circuit_ID = c.Circuit_ID
JOIN SEASON s ON r.Season_ID = s.Season_ID
JOIN RACE_ENTRY re ON r.Race_ID = re.Race_ID
JOIN DRIVER d ON re.Driver_ID = d.Driver_ID
JOIN TEAM t ON d.Team_ID = t.Team_ID
JOIN CAR car ON re.Car_ID = car.Car_ID
JOIN RACE_RESULTS rr ON r.Race_ID = rr.Race_ID AND rr.DRIVER_ID = d.Driver_ID
LEFT JOIN FAILURES f ON re.Entry_ID = f.Entry_ID
LEFT JOIN PENALTIES p ON re.Entry_ID = p.Entry_ID
GROUP BY 
    s.Year, r.Race_ID, r.Location, c.Name, c.Country, d.Driver_ID, d.Name, t.Team_Name,
    car.Model, re.Grid_Position, rr.Final_Position, rr.Points_Scored, rr.Pit_Stops,
    rr.Fastest_Lap_Time, rr.Overtakes_Made, rr.Laps_Completed, r.Number_of_Laps,
    rr.DNF_Status, f.Failure_Type, f.Failure_Description, re.Upgrades_Applied,
    re.Race_Modifications, r.Weather_Condition;
GO

---Race result for specific race
-- Show complete results for a specific race (e.g., Bahrain)
SELECT 
    DriverName, 
    Team_Name, 
    StartPosition, 
    FinishPosition, 
    PositionsGained, 
    Points_Scored, 
    Pit_Stops, 
    Fastest_Lap_Time,
    FinishStatus
FROM vw_RacePerformanceAnalytics
WHERE RaceLocation = 'Bahrain' AND Season = 2024
ORDER BY 
    CASE WHEN FinishPosition IS NULL THEN 999 ELSE FinishPosition END;

--- exmaple 2 for view (Circuit Performance Comparison)
-- Compare driver performance across different circuit types
SELECT 
    DriverName,
    CircuitName,
    StartPosition,
    FinishPosition,
    PositionsGained,
    Overtakes_Made,
    Points_Scored,
    CarModel,
    Race_Modifications
FROM vw_RacePerformanceAnalytics
WHERE Season = 2024 AND DriverName IN ('Lewis Hamilton', 'Max Verstappen')
ORDER BY DriverName, Race_ID;

--View 3(Team Resource Performance)

CREATE VIEW vw_TeamResourcesPerformance AS
SELECT 
    t.Team_ID,
    t.Team_Name,
    t.Team_Country,
    t.Team_Principal,
    t.Budget AS TeamBudget,
    t.Championships_Won,
    s.Year AS Season,
    
    -- Team Performance Metrics
    SUM(rr.Points_Scored) AS TotalPoints,
    COUNT(CASE WHEN rr.Final_Position = 1 THEN 1 END) AS Wins,
    COUNT(CASE WHEN rr.Final_Position BETWEEN 1 AND 3 THEN 1 END) AS Podiums,
    COUNT(CASE WHEN rr.DNF_Status IN ('Mechanical', 'Crash', 'Retired') THEN 1 END) AS DNFs,
    COUNT(DISTINCT r.Race_ID) AS RacesParticipated,
    
    -- Car Metrics
    COUNT(DISTINCT car.Car_ID) AS TotalCars,
    AVG(car.Horsepower) AS AvgHorsepower,
    
    -- Human Resources
    COUNT(DISTINCT staff.Staff_ID) AS TotalStaff,
    COUNT(DISTINCT eng.Staff_ID) AS Engineers,
    COUNT(DISTINCT mech.Staff_ID) AS Mechanics,
    SUM(staff.Salary) AS StaffSalaries,
    
    -- Driver Metrics
    COUNT(DISTINCT d.Driver_ID) AS TotalDrivers,
    SUM(d.Salary) AS DriverSalaries,
    SUM(d.Number_of_Wins) AS AllTimeDriverWins,
    
    -- Sponsorship Metrics
    COUNT(DISTINCT sp.Sponsor_ID) AS TotalSponsors,
    SUM(spship.Contract_Value) AS TotalSponsorshipValue
FROM TEAM t
JOIN DRIVER d ON t.Team_ID = d.Team_ID
JOIN CAR car ON t.Team_ID = car.Team_ID
JOIN STAFF staff ON t.Team_ID = staff.Team_ID
LEFT JOIN ENGINEER eng ON staff.Staff_ID = eng.Staff_ID
LEFT JOIN MECHANIC mech ON staff.Staff_ID = mech.Staff_ID
LEFT JOIN SPONSORSHIP spship ON t.Team_ID = spship.Team_ID
LEFT JOIN SPONSOR sp ON spship.Sponsor_ID = sp.Sponsor_ID
LEFT JOIN RACE_ENTRY re ON d.Driver_ID = re.Driver_ID
LEFT JOIN RACE_RESULTS rr ON re.Race_ID = rr.Race_ID AND re.Driver_ID = rr.DRIVER_ID
LEFT JOIN RACE r ON re.Race_ID = r.Race_ID
LEFT JOIN SEASON s ON r.Season_ID = s.Season_ID
WHERE s.Year = 2024
GROUP BY 
    t.Team_ID, t.Team_Name, t.Team_Country, t.Team_Principal, 
    t.Budget, t.Championships_Won, s.Year;
GO

-- Evaluate driver compensation against performance
SELECT 
    Team_Name,
    TotalDrivers,
    DriverSalaries,
    CAST(DriverSalaries AS FLOAT) / TotalDrivers AS AvgSalaryPerDriver,
    TotalPoints,
    Wins,
    Podiums,
    CAST(TotalPoints AS FLOAT) / DriverSalaries * 1000000 AS PointsPerMillionDriverSalary,
    CAST(DriverSalaries AS FLOAT) / TeamBudget * 100 AS DriverSalaryBudgetPercentage
FROM vw_TeamResourcesPerformance
WHERE Season = 2024
ORDER BY PointsPerMillionDriverSalary DESC;

-- Analyze the relationship between staff investment and performance
SELECT 
    Team_Name,
    TotalStaff,
    Engineers,
    Mechanics,
    StaffSalaries,
    TotalPoints,
    Wins,
    Podiums,
    CAST(StaffSalaries AS FLOAT) / TotalStaff AS AvgSalaryPerStaff,
    CAST(TotalPoints AS FLOAT) / TotalStaff AS PointsPerStaffMember,
    CAST(StaffSalaries AS FLOAT) / TeamBudget * 100 AS StaffSalaryBudgetPercentage
FROM vw_TeamResourcesPerformance
WHERE Season = 2024
ORDER BY TotalPoints DESC;

-- Measure sponsorship effectiveness and return on investment
SELECT 
    Team_Name,
    TotalSponsors,
    TotalSponsorshipValue,
    TotalPoints,
    Wins,
    CAST(TotalSponsorshipValue AS FLOAT) / TotalSponsors AS AvgValuePerSponsor,
    CAST(TotalPoints AS FLOAT) / TotalSponsorshipValue * 1000000 AS PointsPerMillionSponsorship,
    CAST(TotalSponsorshipValue AS FLOAT) / TeamBudget * 100 AS SponsorshipBudgetPercentage
FROM vw_TeamResourcesPerformance
WHERE Season = 2024
ORDER BY SponsorshipBudgetPercentage DESC;

--- View 4 ( Circuit Strategy Analysis)
CREATE VIEW vw_CircuitStrategyAnalysis AS
SELECT
    c.Circuit_ID,
    c.Name AS CircuitName,
    c.Country AS CircuitCountry,
    c.Type AS CircuitType,
    c.Length_Circuit,
    c.Number_of_Turns,
    c.DRS_Zones,
    
    -- Aggregated race statistics
    COUNT(DISTINCT r.Race_ID) AS NumberOfRaces,
    AVG(r.Number_of_Laps) AS AvgLaps,
    
    -- Team-specific performance
    t.Team_ID,
    t.Team_Name,
    
    -- Pit stop strategy
    AVG(rr.Pit_Stops) AS AvgPitStops,
    
    -- Setup preferences
    (SELECT TOP 1 re2.Race_Modifications 
     FROM RACE_ENTRY re2 
     JOIN RACE rx ON re2.Race_ID = rx.Race_ID 
     JOIN DRIVER dx ON re2.Driver_ID = dx.Driver_ID
     WHERE rx.Circuit_ID = c.Circuit_ID AND dx.Team_ID = t.Team_ID
     GROUP BY re2.Race_Modifications
     ORDER BY COUNT(*) DESC) AS MostCommonSetup,
    
    -- Performance metrics
    AVG(rr.Points_Scored) AS AvgPointsScored,
    SUM(CASE WHEN rr.Final_Position = 1 THEN 1 ELSE 0 END) AS Wins,
    SUM(CASE WHEN rr.Final_Position BETWEEN 1 AND 3 THEN 1 ELSE 0 END) AS Podiums,
    
    -- Overtaking characteristics
    AVG(rr.Overtakes_Made) AS AvgOvertakes,
    
    -- DNF analysis
    SUM(CASE WHEN rr.DNF_Status IS NOT NULL AND rr.DNF_Status != 'Completed' THEN 1 ELSE 0 END) AS TotalDNFs,
    
    -- Circuit/Car compatibility index - higher number means better compatibility
    (AVG(rr.Points_Scored) * 2) + 
    (SUM(CASE WHEN rr.Final_Position BETWEEN 1 AND 3 THEN 1 ELSE 0 END) * 5) -
    (SUM(CASE WHEN rr.DNF_Status IS NOT NULL AND rr.DNF_Status != 'Completed' THEN 1 ELSE 0 END) * 3) AS CircuitCompatibilityIndex
FROM CIRCUIT c
JOIN RACE r ON c.Circuit_ID = r.Circuit_ID
JOIN RACE_RESULTS rr ON r.Race_ID = rr.Race_ID
JOIN DRIVER d ON rr.DRIVER_ID = d.Driver_ID
JOIN TEAM t ON d.Team_ID = t.Team_ID
JOIN RACE_ENTRY re ON r.Race_ID = re.Race_ID AND re.Driver_ID = d.Driver_ID
JOIN SEASON s ON r.Season_ID = s.Season_ID
WHERE s.Year = 2024
GROUP BY 
    c.Circuit_ID, c.Name, c.Country, c.Type, c.Length_Circuit, 
    c.Number_of_Turns, c.DRS_Zones, t.Team_ID, t.Team_Name;
GO

-- Analyze how teams perform across different circuit types
SELECT
    Team_Name,
    CircuitType,
    
    ROUND(AVG(AvgPointsScored), 2) AS AvgPointsPerRace,
    SUM(Wins) AS TotalWins,
    SUM(Podiums) AS TotalPodiums,
    ROUND(AVG(CircuitCompatibilityIndex), 2) AS AvgCompatibilityIndex
FROM vw_CircuitStrategyAnalysis
GROUP BY Team_Name, CircuitType
ORDER BY Team_Name, AvgPointsPerRace DESC;


-- Find each team's most compatible circuits
WITH RankedCircuits AS (
    SELECT
        Team_Name,
        CircuitName,
        AvgPointsScored,
        CircuitCompatibilityIndex,
        MostCommonSetup,
        ROW_NUMBER() OVER (PARTITION BY Team_Name ORDER BY CircuitCompatibilityIndex DESC) AS CircuitRank
    FROM vw_CircuitStrategyAnalysis
)
SELECT
    Team_Name,
    CircuitName,
    ROUND(AvgPointsScored, 2) AS AvgPointsPerRace,
    ROUND(CircuitCompatibilityIndex, 2) AS CompatibilityScore,
    MostCommonSetup
FROM RankedCircuits
WHERE CircuitRank <= 1
ORDER BY Team_Name, CircuitRank;

---------------------------------------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------UDFs SECTION---------------------------------------------------------------------------------------------------------------------

-- 1. Function to calculate a driver's average finishing position for a season
CREATE FUNCTION dbo.fn_DriverAverageFinishPosition
(
    @DriverID INT,
    @SeasonID INT
)
RETURNS DECIMAL(5,2)
AS
BEGIN
    DECLARE @AvgPosition DECIMAL(5,2);
    
    SELECT @AvgPosition = AVG(CAST(rr.Final_Position AS DECIMAL(5,2)))
    FROM RACE_RESULTS rr
    INNER JOIN RACE r ON rr.Race_ID = r.Race_ID
    WHERE rr.DRIVER_ID = @DriverID 
    AND r.Season_ID = @SeasonID
    AND rr.Final_Position IS NOT NULL; -- Excluding DNFs where position is NULL
    
    RETURN @AvgPosition;
END;
GO

SELECT dbo.fn_DriverAverageFinishPosition(1, 5) AS AvgPosition;
-- Returns the average finishing position for driver ID 1 (Max Verstappen) in season ID 5 (2024)

-- 2. Function to calculate team performance score based on points, wins, and reliability
CREATE FUNCTION dbo.fn_TeamPerformanceScore
(
    @TeamID INT,
    @SeasonID INT
)
RETURNS DECIMAL(10,2)
AS
BEGIN
    DECLARE @TotalPoints DECIMAL(10,2) = 0;
    DECLARE @TotalWins INT = 0;
    DECLARE @ReliabilityScore DECIMAL(10,2) = 0;
    DECLARE @PerformanceScore DECIMAL(10,2) = 0;
    
    -- Get total points
    SELECT @TotalPoints = SUM(Points)
    FROM STANDINGS
    WHERE Entity_ID = @TeamID AND Season_ID = @SeasonID AND Entity_Type = 'Team';
    
    -- Get total wins
    SELECT @TotalWins = Wins
    FROM STANDINGS
    WHERE Entity_ID = @TeamID AND Season_ID = @SeasonID AND Entity_Type = 'Team';
    
    -- Calculate reliability score (percentage of races finished without DNF)
    SELECT @ReliabilityScore = 
        100.0 * (1.0 - (CAST(COUNT(CASE WHEN rr.DNF_Status != 'Completed' THEN 1 ELSE NULL END) AS DECIMAL(10,2)) / 
                  CAST(COUNT(*) AS DECIMAL(10,2))))
    FROM RACE_RESULTS rr
    INNER JOIN RACE r ON rr.Race_ID = r.Race_ID
    INNER JOIN DRIVER d ON rr.DRIVER_ID = d.Driver_ID
    WHERE d.Team_ID = @TeamID AND r.Season_ID = @SeasonID;
    
    -- Calculate overall performance score (formula: points + (wins * 10) + (reliability * 0.5))
    SET @PerformanceScore = ISNULL(@TotalPoints, 0) + (ISNULL(@TotalWins, 0) * 10) + (ISNULL(@ReliabilityScore, 0) * 0.5);
    
    RETURN @PerformanceScore;
END;
GO

SELECT dbo.fn_TeamPerformanceScore(1, 5) AS PerformanceScore;
-- Returns the performance score for team ID 1 (Red Bull Racing) in season ID 5 (2024)


-- 3. Function to get the most successful driver at a specific circuit
CREATE FUNCTION dbo.fn_MostSuccessfulDriverAtCircuit
(
    @CircuitID INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT TOP 5
        d.Driver_ID,
        d.Name,
        COUNT(CASE WHEN rr.Final_Position = 1 THEN 1 ELSE NULL END) AS Wins,
        COUNT(CASE WHEN rr.Final_Position BETWEEN 1 AND 3 THEN 1 ELSE NULL END) AS Podiums,
        SUM(rr.Points_Scored) AS TotalPoints,
        AVG(CAST(rr.Final_Position AS DECIMAL(5,2))) AS AverageFinish
    FROM DRIVER d
    INNER JOIN RACE_RESULTS rr ON d.Driver_ID = rr.DRIVER_ID
    INNER JOIN RACE r ON rr.Race_ID = r.Race_ID
    WHERE r.Circuit_ID = @CircuitID
    AND rr.Final_Position IS NOT NULL
    GROUP BY d.Driver_ID, d.Name
    ORDER BY Wins DESC, Podiums DESC, TotalPoints DESC
);
GO
SELECT * FROM dbo.fn_MostSuccessfulDriverAtCircuit(1);
-- Returns the top 5 most successful drivers at circuit ID 1 (Silverstone)




-- 4. Function to calculate the head-to-head comparison between two drivers
CREATE FUNCTION dbo.fn_DriverHeadToHead
(
    @Driver1ID INT,
    @Driver2ID INT,
    @SeasonID INT = NULL -- Optional parameter, NULL means all seasons
)
RETURNS TABLE
AS
RETURN
(
    WITH RaceResults AS (
        SELECT 
            r.Race_ID,
            r.Season_ID,
            r.Location,
            r1.DRIVER_ID AS Driver1ID,
            r1.Final_Position AS Driver1Position,
            r2.DRIVER_ID AS Driver2ID,
            r2.Final_Position AS Driver2Position
        FROM RACE r
        INNER JOIN RACE_RESULTS r1 ON r.Race_ID = r1.Race_ID AND r1.DRIVER_ID = @Driver1ID
        INNER JOIN RACE_RESULTS r2 ON r.Race_ID = r2.Race_ID AND r2.DRIVER_ID = @Driver2ID
        WHERE (@SeasonID IS NULL OR r.Season_ID = @SeasonID)
    )
    
    SELECT 
        (SELECT Name FROM DRIVER WHERE Driver_ID = @Driver1ID) AS Driver1Name,
        (SELECT Name FROM DRIVER WHERE Driver_ID = @Driver2ID) AS Driver2Name,
        COUNT(*) AS TotalRaces,
        SUM(CASE WHEN Driver1Position < Driver2Position THEN 1 ELSE 0 END) AS Driver1Wins,
        SUM(CASE WHEN Driver2Position < Driver1Position THEN 1 ELSE 0 END) AS Driver2Wins,
        SUM(CASE WHEN Driver1Position = Driver2Position THEN 1 ELSE 0 END) AS Draws,
        SUM(CASE WHEN Driver1Position BETWEEN 1 AND 3 THEN 1 ELSE 0 END) AS Driver1Podiums,
        SUM(CASE WHEN Driver2Position BETWEEN 1 AND 3 THEN 1 ELSE 0 END) AS Driver2Podiums,
        AVG(CAST(Driver1Position AS DECIMAL(5,2))) AS Driver1AvgPosition,
        AVG(CAST(Driver2Position AS DECIMAL(5,2))) AS Driver2AvgPosition
    FROM RaceResults
    WHERE Driver1Position IS NOT NULL AND Driver2Position IS NOT NULL
);
GO

SELECT * FROM dbo.fn_DriverHeadToHead(1, 2, 5);
-- Compares Max Verstappen (ID 1) and Lewis Hamilton (ID 2) in the 2024 season (ID 5)



-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
---------------------------------------------------TRIGGERS-----------------------------------------------------------------------------------------------------
-- Modified trigger to enforce driver contract validation rules
-- Instead of checking age (which is already handled by a CHECK constraint),
-- this trigger ensures a driver's contract has valid dates and the contract duration
-- is not excessively long (over 5 years) according to F1 regulations
CREATE TRIGGER trg_Driver_Contract_Validation
ON DRIVER
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if any contracts violate the 5-year maximum duration rule (F1 standard)
    IF EXISTS (
        SELECT 1 
        FROM inserted 
        WHERE Contract_End_Date IS NOT NULL 
        AND Contract_Start_Date IS NOT NULL
        AND DATEDIFF(YEAR, Contract_Start_Date, Contract_End_Date) > 5
    )
    BEGIN
        DECLARE @LongContractDrivers NVARCHAR(1000) = '';
        
        -- Get names of drivers with contracts exceeding 5 years
        SELECT @LongContractDrivers = @LongContractDrivers + Name + 
                ' (Contract: ' + 
                CONVERT(VARCHAR(10), Contract_Start_Date, 120) + ' to ' + 
                CONVERT(VARCHAR(10), Contract_End_Date, 120) + '), '
        FROM inserted
        WHERE Contract_End_Date IS NOT NULL 
        AND Contract_Start_Date IS NOT NULL
        AND DATEDIFF(YEAR, Contract_Start_Date, Contract_End_Date) > 5;
        
        -- Remove trailing comma
        IF LEN(@LongContractDrivers) > 0
            SET @LongContractDrivers = LEFT(@LongContractDrivers, LEN(@LongContractDrivers) - 2);
            
        -- Raise error and rollback transaction
        DECLARE @ErrorMsg NVARCHAR(2000) = 'Driver contracts exceeding 5 years duration (F1 regulation): ' + @LongContractDrivers;
        
        RAISERROR(@ErrorMsg, 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
    
    -- Check for invalid contract dates (end date before start date)
    -- This is theoretically enforced by a CHECK constraint, but we can provide a more detailed error message
    IF EXISTS (
        SELECT 1 
        FROM inserted 
        WHERE Contract_End_Date IS NOT NULL 
        AND Contract_Start_Date IS NOT NULL
        AND Contract_End_Date <= Contract_Start_Date
    )
    BEGIN
        DECLARE @InvalidDateDrivers NVARCHAR(1000) = '';
        
        -- Get names of drivers with invalid contract dates
        SELECT @InvalidDateDrivers = @InvalidDateDrivers + Name + 
                ' (Contract: ' + 
                CONVERT(VARCHAR(10), Contract_Start_Date, 120) + ' to ' + 
                CONVERT(VARCHAR(10), Contract_End_Date, 120) + '), '
        FROM inserted
        WHERE Contract_End_Date IS NOT NULL 
        AND Contract_Start_Date IS NOT NULL
        AND Contract_End_Date <= Contract_Start_Date;
        
        -- Remove trailing comma
        IF LEN(@InvalidDateDrivers) > 0
            SET @InvalidDateDrivers = LEFT(@InvalidDateDrivers, LEN(@InvalidDateDrivers) - 2);
            
        -- Raise error and rollback transaction
        DECLARE @DateErrorMsg NVARCHAR(2000) = 'Invalid contract dates (end date must be after start date): ' + @InvalidDateDrivers;
        
        RAISERROR(@DateErrorMsg, 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;
    
    -- Update ModifiedOn timestamp
    UPDATE d
    SET ModifiedOn = GETDATE()
    FROM DRIVER d
    INNER JOIN inserted i ON d.Driver_ID = i.Driver_ID;
END;
GO
-----Trigger 1 test------------------------------------------------------------
-- Simple Test for Driver Contract Validation Trigger
USE F1RacingDatabase;
GO

PRINT '=== Testing Driver Contract Validation Trigger ===';

-- Test 1: Try to insert a driver with a contract longer than 5 years
BEGIN TRY
    BEGIN TRANSACTION;
    
    PRINT 'Attempting to insert a driver with a contract exceeding 5 years:';
    
    INSERT INTO DRIVER (
        Name, 
        Age, 
        Nationality, 
        Team_ID, 
        Number_of_Wins,
        Salary, 
        Contract_Start_Date, -- Note the order change
        Contract_End_Date,    -- These match the actual column order
        Pole_Positions, 
        Fastest_Laps
    )
    VALUES (
        'Long Contract Driver', 
        25, 
        'Brazilian', 
        3,  -- Ferrari
        0, 
        3000000.00,
        '2024-01-01',        -- Start date
        '2030-12-31',        -- End date (7 years later)
        0, 
        0
    );
    
    PRINT 'WARNING: Insert succeeded despite contract length exceeding 5 years!';
    
    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    PRINT 'Expected error caught: ' + ERROR_MESSAGE();
    
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
END CATCH;

-- Test 2: Try to insert a driver with an invalid contract (end date before start date)
BEGIN TRY
    BEGIN TRANSACTION;
    
    PRINT 'Attempting to insert a driver with invalid contract dates:';
    
    INSERT INTO DRIVER (
        Name, 
        Age, 
        Nationality, 
        Team_ID, 
        Number_of_Wins,
        Salary, 
        Contract_Start_Date,
        Contract_End_Date, 
        Pole_Positions, 
        Fastest_Laps
    )
    VALUES (
        'Invalid Contract Driver', 
        30, 
        'Canadian', 
        4,  -- McLaren
        0, 
        2500000.00,
        '2025-01-01',        -- Start date
        '2024-12-31',        -- End date (before start date)
        0, 
        0
    );
    
    PRINT 'WARNING: Insert succeeded despite invalid contract dates!';
    
    ROLLBACK TRANSACTION;
END TRY
BEGIN CATCH
    PRINT 'Expected error caught: ' + ERROR_MESSAGE();
    
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
END CATCH;

-- Test 3: Insert a driver with a valid contract (3 years)
BEGIN TRY
    BEGIN TRANSACTION;
    
    PRINT 'Inserting a driver with a valid 3-year contract:';
    
    INSERT INTO DRIVER (
        Name, 
        Age, 
        Nationality, 
        Team_ID, 
        Number_of_Wins,
        Salary, 
        Contract_Start_Date,
        Contract_End_Date, 
        Pole_Positions, 
        Fastest_Laps
    )
    VALUES (
        'Valid Contract Driver', 
        28, 
        'Italian', 
        5,  -- Aston Martin
        0, 
        2000000.00,
        '2024-01-01',        -- Start date
        '2026-12-31',        -- End date (3 years)
        0, 
        0
    );
    
    PRINT 'Valid driver inserted successfully.';
    
    -- Cleanup - remove test driver
    DECLARE @NewDriverID INT;
    SELECT @NewDriverID = Driver_ID FROM DRIVER WHERE Name = 'Valid Contract Driver';
    
    DELETE FROM DRIVER WHERE Driver_ID = @NewDriverID;
    PRINT 'Test driver removed.';
    
    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    PRINT 'Unexpected error: ' + ERROR_MESSAGE();
    
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;
END CATCH;

PRINT 'All tests completed!';







