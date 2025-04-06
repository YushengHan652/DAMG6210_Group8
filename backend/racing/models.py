from django.db import models

# Create your models here.
class Team(models.Model):
    team_id = models.AutoField(primary_key=True)
    team_name = models.CharField(max_length=100)
    team_country = models.CharField(max_length=50)
    team_principal = models.CharField(max_length=100, null=True, blank=True)
    budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    tires_supplier = models.CharField(max_length=50, null=True, blank=True)
    championships_won = models.IntegerField(default=0)
    founded_year = models.IntegerField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.team_name

    class Meta:
        db_table = 'TEAM'


class Driver(models.Model):
    driver_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    nationality = models.CharField(max_length=50)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    number_of_wins = models.IntegerField(default=0)
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    contract_end_date = models.DateField(null=True, blank=True)
    pole_positions = models.IntegerField(default=0)
    fastest_laps = models.IntegerField(default=0)
    contract_start_date = models.DateField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'DRIVER'


class Season(models.Model):
    season_id = models.AutoField(primary_key=True)
    year = models.IntegerField()
    number_of_races = models.IntegerField()
    champion_driver = models.ForeignKey(Driver, on_delete=models.SET_NULL, null=True, blank=True, related_name='champion_seasons')
    champion_team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='champion_seasons')
    title_sponsor = models.CharField(max_length=100, null=True, blank=True)
    prize_money_awarded = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    time_gmt_class = models.DateTimeField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Season {self.year}"

    class Meta:
        db_table = 'SEASON'


class Standings(models.Model):
    ENTITY_TYPES = [
        ('Team', 'Team'),
        ('Driver', 'Driver'),
    ]
    
    standings_id = models.AutoField(primary_key=True)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    entity_id = models.IntegerField()
    entity_type = models.CharField(max_length=10, choices=ENTITY_TYPES)
    points = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    podiums = models.IntegerField(default=0)
    rank = models.IntegerField(null=True, blank=True)
    fastest_laps = models.IntegerField(default=0)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.entity_type} Standings - {self.season}"

    class Meta:
        db_table = 'STANDINGS'


class Staff(models.Model):
    EMPLOYMENT_STATUSES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Contractor', 'Contractor'),
        ('Consultant', 'Consultant'),
    ]
    
    staff_id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    dob = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=50, null=True, blank=True)
    employment_status = models.CharField(max_length=20, choices=EMPLOYMENT_STATUSES, null=True, blank=True)
    salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    first_terms = models.CharField(max_length=255, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'STAFF'


class Mechanic(models.Model):
    staff = models.OneToOneField(Staff, on_delete=models.CASCADE, primary_key=True)
    specialization = models.CharField(max_length=100)
    experience_years = models.IntegerField()

    def __str__(self):
        return f"Mechanic: {self.staff.name}"

    class Meta:
        db_table = 'MECHANIC'


class Analyst(models.Model):
    staff = models.OneToOneField(Staff, on_delete=models.CASCADE, primary_key=True)
    skill_specialty = models.CharField(max_length=100)

    def __str__(self):
        return f"Analyst: {self.staff.name}"

    class Meta:
        db_table = 'ANALYST'


class Manager(models.Model):
    staff = models.OneToOneField(Staff, on_delete=models.CASCADE, primary_key=True)
    team_budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    team_responsibility = models.CharField(max_length=100)

    def __str__(self):
        return f"Manager: {self.staff.name}"

    class Meta:
        db_table = 'MANAGER'


class Engineer(models.Model):
    staff = models.OneToOneField(Staff, on_delete=models.CASCADE, primary_key=True)
    car_budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    car_responsibility = models.CharField(max_length=100)

    def __str__(self):
        return f"Engineer: {self.staff.name}"

    class Meta:
        db_table = 'ENGINEER'


class Sponsor(models.Model):
    SPONSORSHIP_TYPES = [
        ('Title', 'Title'),
        ('Primary', 'Primary'),
        ('Secondary', 'Secondary'),
        ('Technical', 'Technical'),
        ('Official', 'Official'),
    ]
    
    sponsor_id = models.AutoField(primary_key=True)
    sponsor_name = models.CharField(max_length=100)
    industry = models.CharField(max_length=50)
    headquarters = models.CharField(max_length=100, null=True, blank=True)
    annual_funding = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    sponsorship_type = models.CharField(max_length=50, choices=SPONSORSHIP_TYPES, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.sponsor_name

    class Meta:
        db_table = 'SPONSOR'


class Sponsorship(models.Model):
    contract_id = models.AutoField(primary_key=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    sponsor = models.ForeignKey(Sponsor, on_delete=models.CASCADE)
    contract_value = models.DecimalField(max_digits=15, decimal_places=2)
    contract_start = models.DateTimeField()
    contract_end = models.DateTimeField()

    def __str__(self):
        return f"{self.sponsor.sponsor_name} - {self.team.team_name}"

    class Meta:
        db_table = 'SPONSORSHIP'


class Car(models.Model):
    car_id = models.AutoField(primary_key=True)
    model = models.CharField(max_length=50)
    chassis = models.CharField(max_length=50)
    engine_manufacturer = models.CharField(max_length=50)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    aerodynamics_package = models.CharField(max_length=50, null=True, blank=True)
    weight = models.DecimalField(max_digits=6, decimal_places=2)
    horsepower = models.IntegerField(null=True, blank=True)
    tyre_supplier = models.CharField(max_length=50, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.team.team_name} - {self.model}"

    class Meta:
        db_table = 'CAR'


class Circuit(models.Model):
    CIRCUIT_TYPES = [
        ('Street', 'Street'),
        ('Permanent', 'Permanent'),
        ('Temporary', 'Temporary'),
        ('Oval', 'Oval'),
    ]
    
    circuit_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=50)
    seating_capacity = models.IntegerField(null=True, blank=True)
    number_of_drs = models.IntegerField(default=0)
    drs_zones = models.IntegerField(default=0)
    number_of_turns = models.IntegerField()
    length_circuit = models.DecimalField(max_digits=8, decimal_places=3)
    lap_record_time = models.DecimalField(max_digits=8, decimal_places=3, null=True, blank=True)
    type = models.CharField(max_length=50, choices=CIRCUIT_TYPES, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'CIRCUIT'


class Race(models.Model):
    race_id = models.AutoField(primary_key=True)
    season = models.ForeignKey(Season, on_delete=models.CASCADE)
    location = models.CharField(max_length=100)
    date = models.DateField()
    weather_condition = models.CharField(max_length=50, null=True, blank=True)
    circuit = models.ForeignKey(Circuit, on_delete=models.CASCADE)
    circuit_length = models.DecimalField(max_digits=8, decimal_places=3)
    number_of_laps = models.IntegerField()
    race_distance = models.DecimalField(max_digits=8, decimal_places=3)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.location} Grand Prix {self.season.year}"

    class Meta:
        db_table = 'RACE'


class RaceEntry(models.Model):
    entry_id = models.AutoField(primary_key=True)
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    grid_position = models.IntegerField(null=True, blank=True)
    upgrades_applied = models.CharField(max_length=255, null=True, blank=True)
    race_modifications = models.CharField(max_length=255, null=True, blank=True)
    grid_position_final = models.IntegerField(null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.driver.name} - {self.race.location} GP"

    class Meta:
        db_table = 'RACE_ENTRY'


class RaceResults(models.Model):
    DNF_STATUSES = [
        ('Completed', 'Completed'),
        ('Mechanical', 'Mechanical'),
        ('Crash', 'Crash'),
        ('Disqualified', 'Disqualified'),
        ('Retired', 'Retired'),
    ]
    
    result_id = models.AutoField(primary_key=True)
    race = models.ForeignKey(Race, on_delete=models.CASCADE)
    final_position = models.IntegerField(null=True, blank=True)
    points_scored = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    pit_stops = models.IntegerField(null=True, blank=True)
    fastest_lap_time = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    overtakes_made = models.IntegerField(null=True, blank=True)
    laps_completed = models.IntegerField(null=True, blank=True)
    dnf_status = models.CharField(max_length=50, choices=DNF_STATUSES, null=True, blank=True)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.driver.name} - {self.race.location} GP - Position: {self.final_position or 'DNF'}"

    class Meta:
        db_table = 'RACE_RESULTS'


class Penalties(models.Model):
    PENALTY_TYPES = [
        ('Time', 'Time'),
        ('Grid', 'Grid'),
        ('Points', 'Points'),
        ('Disqualification', 'Disqualification'),
        ('Fine', 'Fine'),
    ]
    
    PENALTY_STATUSES = [
        ('Applied', 'Applied'),
        ('Appealed', 'Appealed'),
        ('Overturned', 'Overturned'),
    ]
    
    penalty_id = models.AutoField(primary_key=True)
    entry = models.ForeignKey(RaceEntry, on_delete=models.CASCADE)
    penalty_type = models.CharField(max_length=50, choices=PENALTY_TYPES)
    time_penalty = models.IntegerField(null=True, blank=True)
    penalty_reason = models.CharField(max_length=255)
    penalty_status = models.CharField(max_length=50, choices=PENALTY_STATUSES)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.entry.driver.name} - {self.penalty_type} Penalty"

    class Meta:
        db_table = 'PENALTIES'


class Failures(models.Model):
    failure_id = models.AutoField(primary_key=True)
    entry = models.ForeignKey(RaceEntry, on_delete=models.CASCADE)
    failure_type = models.CharField(max_length=50)
    failure_description = models.CharField(max_length=255)
    failure_lap = models.IntegerField(null=True, blank=True)
    dnf = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.entry.driver.name} - {self.failure_type}"

    class Meta:
        db_table = 'FAILURES'


class Records(models.Model):
    RECORD_TYPES = [
        ('Fastest_Lap_Time', 'Fastest Lap Time'),
        ('Most_Overtakes', 'Most Overtakes'),
        ('Most_Wins_Season', 'Most Wins Season'),
        ('Most_Poles_Season', 'Most Poles Season'),
        ('Championship_Record', 'Championship Record'),
    ]
    
    record_id = models.AutoField(primary_key=True)
    record_type = models.CharField(max_length=50, choices=RECORD_TYPES)
    fastest_lap_time = models.DecimalField(max_digits=10, decimal_places=3, null=True, blank=True)
    fastest_pit_stop = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    most_overtakes = models.IntegerField(null=True, blank=True)
    record_description = models.CharField(max_length=255)
    driver_of_the_day = models.CharField(max_length=100, null=True, blank=True)
    dnf_count = models.IntegerField(null=True, blank=True)
    longest_dnf_laps = models.CharField(max_length=50, null=True, blank=True)
    created_on = models.DateTimeField(auto_now_add=True)
    modified_on = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.record_type} - {self.record_description}"

    class Meta:
        db_table = 'RECORDS'
