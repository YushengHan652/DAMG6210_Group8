CREATE VIEW vw_TopDriverWins AS
SELECT
    D.Driver_ID,
    D.Name AS Driver_Name,
    COUNT(*) AS Win_Count
FROM RACE_ENTRY RE
JOIN DRIVER D ON RE.Driver_ID = D.Driver_ID
WHERE RE.Grid_Position_Final = 1
GROUP BY D.Driver_ID, D.Name;

CREATE VIEW vw_AvgDriverFinish AS
SELECT
    D.Driver_ID,
    D.Name AS Driver_Name,
    COUNT(*) AS Total_Races,
    AVG(RE.Grid_Position_Final) AS Avg_Final_Position
FROM RACE_ENTRY RE
JOIN DRIVER D ON RE.Driver_ID = D.Driver_ID
GROUP BY D.Driver_ID, D.Name;

CREATE VIEW vw_TeamTotalPoints AS
SELECT
    T.Team_ID,
    T.Team_Name,
    SUM(S.Points) AS Total_Points
FROM STANDINGS S
JOIN TEAM T ON S.Entity_ID = T.Team_ID
WHERE S.Entity_Type = 'Team'
GROUP BY T.Team_ID, T.Team_Name;

CREATE VIEW vw_CircuitLengths AS
SELECT 
    Location,
    Circuit_Length
FROM RACE;

CREATE VIEW vw_RaceWeatherDistribution AS
SELECT
    Weather_Condition,
    COUNT(*) AS Race_Count
FROM RACE
GROUP BY Weather_Condition;

CREATE VIEW vw_TeamAvgFinishByLocation AS
SELECT 
    R.Location,
    T.Team_Name,
    AVG(RE.Grid_Position_Final) AS Avg_Final_Position
FROM RACE_ENTRY RE
JOIN RACE R ON RE.Race_ID = R.Race_ID
JOIN DRIVER D ON RE.Driver_ID = D.Driver_ID
JOIN TEAM T ON D.Team_ID = T.Team_ID
WHERE RE.Grid_Position_Final IS NOT NULL
GROUP BY R.Location, T.Team_Name;























