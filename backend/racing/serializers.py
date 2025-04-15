from rest_framework import serializers
from .models import (
    Team, Driver, Season, Standings, Staff, Mechanic, Analyst, Manager, Engineer,
    Sponsor, Sponsorship, Car, Circuit, Race, RaceEntry, RaceResults, Penalties, 
    Failures, Records
)


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['team_id', 'team_name', 'team_country', 'team_principal', 
                 'budget', 'tires_supplier', 'championships_won', 'founded_year', 'CreatedOn']


class DriverSerializer(serializers.ModelSerializer):
    team_name = serializers.ReadOnlyField(source='team.team_name')
    
    class Meta:
        model = Driver
        fields = '__all__'


class SeasonSerializer(serializers.ModelSerializer):
    champion_driver_name = serializers.ReadOnlyField(source='champion_driver.name', default=None)
    champion_team_name = serializers.ReadOnlyField(source='champion_team.team_name', default=None)
    
    class Meta:
        model = Season
        fields = '__all__'


class StandingsSerializer(serializers.ModelSerializer):
    season_year = serializers.ReadOnlyField(source='season.year')
    
    class Meta:
        model = Standings
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):
    team_name = serializers.ReadOnlyField(source='team.team_name')
    
    class Meta:
        model = Staff
        fields = '__all__'


class MechanicSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff.name')
    team_name = serializers.ReadOnlyField(source='staff.team.team_name')
    
    class Meta:
        model = Mechanic
        fields = '__all__'


class AnalystSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff.name')
    team_name = serializers.ReadOnlyField(source='staff.team.team_name')
    
    class Meta:
        model = Analyst
        fields = '__all__'


class ManagerSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff.name')
    team_name = serializers.ReadOnlyField(source='staff.team.team_name')
    
    class Meta:
        model = Manager
        fields = '__all__'


class EngineerSerializer(serializers.ModelSerializer):
    staff_name = serializers.ReadOnlyField(source='staff.name')
    team_name = serializers.ReadOnlyField(source='staff.team.team_name')
    
    class Meta:
        model = Engineer
        fields = '__all__'


class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = '__all__'


class SponsorshipSerializer(serializers.ModelSerializer):
    team_name = serializers.ReadOnlyField(source='team.team_name')
    sponsor_name = serializers.ReadOnlyField(source='sponsor.sponsor_name')
    
    class Meta:
        model = Sponsorship
        fields = '__all__'


class CarSerializer(serializers.ModelSerializer):
    team_name = serializers.ReadOnlyField(source='team.team_name')
    
    class Meta:
        model = Car
        fields = '__all__'


class CircuitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Circuit
        fields = '__all__'


class RaceSerializer(serializers.ModelSerializer):
    season_year = serializers.ReadOnlyField(source='season.year')
    circuit_name = serializers.ReadOnlyField(source='circuit.name')
    
    class Meta:
        model = Race
        fields = '__all__'


class RaceEntrySerializer(serializers.ModelSerializer):
    race_name = serializers.ReadOnlyField(source='race.location')
    driver_name = serializers.ReadOnlyField(source='driver.name')
    car_model = serializers.ReadOnlyField(source='car.model')
    
    class Meta:
        model = RaceEntry
        fields = '__all__'


class RaceResultsSerializer(serializers.ModelSerializer):
    race_name = serializers.ReadOnlyField(source='race.location')
    driver_name = serializers.ReadOnlyField(source='driver.name')
    
    class Meta:
        model = RaceResults
        fields = '__all__'


class PenaltiesSerializer(serializers.ModelSerializer):
    driver_name = serializers.ReadOnlyField(source='entry.driver.name')
    race_name = serializers.ReadOnlyField(source='entry.race.location')
    
    class Meta:
        model = Penalties
        fields = '__all__'


class FailuresSerializer(serializers.ModelSerializer):
    driver_name = serializers.ReadOnlyField(source='entry.driver.name')
    race_name = serializers.ReadOnlyField(source='entry.race.location')
    
    class Meta:
        model = Failures
        fields = '__all__'


class RecordsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Records
        fields = '__all__'

class DriverSerializer(serializers.ModelSerializer):
    """
    Serializer for the Driver model with custom validation and additional fields.
    """
    team_name = serializers.ReadOnlyField(source='team.team_name', default=None)
    
    class Meta:
        model = Driver
        fields = [
            'driver_id', 'name', 'age', 'nationality', 'team_id', 'team_name',
            'number_of_wins', 'salary', 'contract_end_date', 'pole_positions',
            'fastest_laps', 'contract_start_date', 'created_on', 'modified_on'
        ]
    
    def validate(self, data):
        """
        Custom validation for driver data.
        """
        # Age validation
        if 'age' in data and (data['age'] < 16 or data['age'] > 65):
            raise serializers.ValidationError({"age": "Driver age must be between 16 and 65."})
        
        # Contract dates validation
        if 'contract_start_date' in data and 'contract_end_date' in data:
            if data['contract_start_date'] and data['contract_end_date']:
                if data['contract_end_date'] <= data['contract_start_date']:
                    raise serializers.ValidationError(
                        {"contract_end_date": "Contract end date must be after start date."}
                    )
        
        # Make sure all stat fields are non-negative
        for field in ['number_of_wins', 'pole_positions', 'fastest_laps']:
            if field in data and data[field] < 0:
                raise serializers.ValidationError({field: f"{field.replace('_', ' ').title()} cannot be negative."})
        
        # Ensure team exists
        if 'team_id' in data:
            try:
                team = Team.objects.get(team_id=data['team_id'])
            except Team.DoesNotExist:
                raise serializers.ValidationError({"team_id": "Selected team does not exist."})
        
        return data
    
    def create(self, validated_data):
        """
        Create a new driver instance.
        """
        # Set default values for stats if not provided
        validated_data.setdefault('number_of_wins', 0)
        validated_data.setdefault('pole_positions', 0)
        validated_data.setdefault('fastest_laps', 0)
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """
        Update an existing driver instance.
        """
        return super().update(instance, validated_data)
