from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count, Q, F
from django.shortcuts import get_object_or_404
from racing.models import (
    Team, Driver, Season, Standings, Staff, Mechanic, Analyst, Manager, Engineer,
    Sponsor, Sponsorship, Car, Circuit, Race, RaceEntry, RaceResults, Penalties, 
    Failures, Records
)
from racing.serializers import (
    TeamSerializer, DriverSerializer, SeasonSerializer, StandingsSerializer,
    StaffSerializer, MechanicSerializer, AnalystSerializer, ManagerSerializer,
    EngineerSerializer, SponsorSerializer, SponsorshipSerializer, CarSerializer,
    CircuitSerializer, RaceSerializer, RaceEntrySerializer, RaceResultsSerializer,
    PenaltiesSerializer, FailuresSerializer, RecordsSerializer
)


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['team_name', 'team_country', 'team_principal']
    ordering_fields = ['team_name', 'championships_won', 'founded_year', 'budget']

    @action(detail=False, methods=['post'])
    def perform_create(self, serializer):
        """Custom method for creating a team with validation"""
        print("Received data for team creation:", self.request.data)
        try:
            team = serializer.save()
            print(f"Successfully created team: {team.team_name} (ID: {team.team_id})")
            return team
        except Exception as e:
            print(f"Error creating team: {str(e)}")
            raise

    @action(detail=False, methods=['post'])
    def perform_update(self, serializer):
        """Custom method for updating a team with validation"""
        print("Received data for team update:", self.request.data)
        try:
            team = serializer.save()
            print(f"Successfully updated team: {team.team_name} (ID: {team.team_id})")
            return team
        except Exception as e:
            print(f"Error updating team: {str(e)}")
            raise

    @action(detail=False, methods=['post']) 
    def perform_destroy(self, instance):
        """Custom method for deleting a team with associated cleanup"""
        print(f"Deleting team: {instance.team_name} (ID: {instance.team_id})")
        instance.delete()
        print(f"Successfully deleted team with ID: {instance.team_id}")

    @action(detail=False, methods=['patch'])
    def update_by_name(self, request):
        team_name = request.data.get('team_name')
        if not team_name:
            return Response({"error": "team_name is required"}, status=400)
        
        try:
            team = Team.objects.get(team_name=team_name)
            serializer = self.get_serializer(team, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Team.DoesNotExist:
            return Response({"error": "Team not found"}, status=404)

    @action(detail=True, methods=['get'])
    def drivers(self, request, pk=None):
        team = self.get_object()
        drivers = Driver.objects.filter(team=team)
        serializer = DriverSerializer(drivers, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def staff(self, request, pk=None):
        team = self.get_object()
        staff = Staff.objects.filter(team=team)
        serializer = StaffSerializer(staff, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def cars(self, request, pk=None):
        team = self.get_object()
        cars = Car.objects.filter(team=team)
        serializer = CarSerializer(cars, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def sponsorships(self, request, pk=None):
        team = self.get_object()
        sponsorships = Sponsorship.objects.filter(team=team)
        serializer = SponsorshipSerializer(sponsorships, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def season_standings(self, request, pk=None):
        team = self.get_object()
        season_id = request.query_params.get('season', None)
        
        standings_query = Standings.objects.filter(
            entity_id=team.team_id,
            entity_type='Team'
        )
        
        if season_id:
            standings_query = standings_query.filter(season_id=season_id)
            
        standings = standings_query.order_by('-season__year')
        serializer = StandingsSerializer(standings, many=True)
        return Response(serializer.data)


# This snippet focuses only on the DriverViewSet class from the api/views.py file

class DriverViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows drivers to be viewed, created, updated or deleted.
    """
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'nationality', 'team__team_name']
    ordering_fields = ['name', 'age', 'number_of_wins', 'pole_positions', 'fastest_laps', 'salary']
    
    @action(detail=True, methods=['post'])
    def perform_create(self, serializer):
        """Custom method for creating a driver with validation"""
        print("Received data for driver creation:", self.request.data)
        try:
            driver = serializer.save()
            print(f"Successfully created driver: {driver.name} (ID: {driver.driver_id})")
            return driver
        except Exception as e:
            print(f"Error creating driver: {str(e)}")
            raise
    
    @action(detail=True, methods=['patch'])
    def perform_update(self, serializer):
        """Custom method for updating a driver with validation"""
        print("Received data for driver update:", self.request.data)
        try:
            driver = serializer.save()
            print(f"Successfully updated driver: {driver.name} (ID: {driver.driver_id})")
            return driver
        except Exception as e:
            print(f"Error updating driver: {str(e)}")
            raise
        
    @action(detail=True, methods=['delete'])
    def perform_destroy(self, instance):
        """Custom method for deleting a driver with associated cleanup"""
        # Get related race entries to clean up after driver deletion
        race_entries = RaceEntry.objects.filter(driver=instance)
        race_entry_ids = [entry.entry_id for entry in race_entries]
        
        # Delete any penalties and failures associated with this driver's entries
        Penalties.objects.filter(entry_id__in=race_entry_ids).delete()
        Failures.objects.filter(entry_id__in=race_entry_ids).delete()
        
        # Delete race results for this driver
        RaceResults.objects.filter(driver=instance).delete()
        
        # Delete race entries
        race_entries.delete()
        
        # Delete driver standings
        Standings.objects.filter(entity_id=instance.driver_id, entity_type='Driver').delete()
        
        # Finally delete the driver
        instance.delete()
        print(f"Successfully deleted driver with ID: {instance.driver_id}")

    @action(detail=True, methods=['get'])
    def race_results(self, request, pk=None):
        driver = self.get_object()
        season_id = request.query_params.get('season', None)
        
        results_query = RaceResults.objects.filter(driver=driver)
        
        if season_id:
            results_query = results_query.filter(race__season_id=season_id)
            
        results = results_query.order_by('-race__date')
        serializer = RaceResultsSerializer(results, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def race_entries(self, request, pk=None):
        driver = self.get_object()
        season_id = request.query_params.get('season', None)
        
        entries_query = RaceEntry.objects.filter(driver=driver)
        
        if season_id:
            entries_query = entries_query.filter(race__season_id=season_id)
            
        entries = entries_query.order_by('-race__date')
        serializer = RaceEntrySerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def penalties(self, request, pk=None):
        driver = self.get_object()
        penalties = Penalties.objects.filter(entry__driver=driver)
        serializer = PenaltiesSerializer(penalties, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def failures(self, request, pk=None):
        driver = self.get_object()
        failures = Failures.objects.filter(entry__driver=driver)
        serializer = FailuresSerializer(failures, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def season_standings(self, request, pk=None):
        driver = self.get_object()
        season_id = request.query_params.get('season', None)
        
        standings_query = Standings.objects.filter(
            entity_id=driver.driver_id,
            entity_type='Driver'
        )
        
        if season_id:
            standings_query = standings_query.filter(season_id=season_id)
            
        standings = standings_query.order_by('-season__year')
        serializer = StandingsSerializer(standings, many=True)
        return Response(serializer.data)


class SeasonViewSet(viewsets.ModelViewSet):
    queryset = Season.objects.all().order_by('-year')
    serializer_class = SeasonSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['year', 'title_sponsor']
    ordering_fields = ['year', 'number_of_races', 'prize_money_awarded']

    def perform_create(self, serializer):
        """Custom method for creating a season with validation"""
        print("Received data for season creation:", self.request.data)
        try:
            season = serializer.save()
            print(f"Successfully created season: {season.year} (ID: {season.season_id})")
            return season
        except Exception as e:
            print(f"Error creating season: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating a season with validation"""
        print("Received data for season update:", self.request.data)
        try:
            season = serializer.save()
            print(f"Successfully updated season: {season.year} (ID: {season.season_id})")
            return season
        except Exception as e:
            print(f"Error updating season: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting a season with associated cleanup"""
        print(f"Deleting season: {instance.year} (ID: {instance.season_id})")
        instance.delete()
        print(f"Successfully deleted season with ID: {instance.season_id}")

    @action(detail=True, methods=['get'])
    def races(self, request, pk=None):
        season = self.get_object()
        races = Race.objects.filter(season=season).order_by('date')
        serializer = RaceSerializer(races, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def standings(self, request, pk=None):
        season = self.get_object()
        entity_type = request.query_params.get('type', 'Driver')  # Default to Driver
        
        standings = Standings.objects.filter(
            season=season,
            entity_type=entity_type
        ).order_by('rank')
        
        serializer = StandingsSerializer(standings, many=True)
        return Response(serializer.data)


class CircuitViewSet(viewsets.ModelViewSet):
    queryset = Circuit.objects.all()
    serializer_class = CircuitSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'country', 'type']
    ordering_fields = ['name', 'length_circuit', 'number_of_turns', 'seating_capacity']

    def perform_create(self, serializer):
        """Custom method for creating a circuit with validation"""
        print("Received data for circuit creation:", self.request.data)
        try:
            circuit = serializer.save()
            print(f"Successfully created circuit: {circuit.name} (ID: {circuit.circuit_id})")
            return circuit
        except Exception as e:
            print(f"Error creating circuit: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating a circuit with validation"""
        print("Received data for circuit update:", self.request.data)
        try:
            circuit = serializer.save()
            print(f"Successfully updated circuit: {circuit.name} (ID: {circuit.circuit_id})")
            return circuit
        except Exception as e:
            print(f"Error updating circuit: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting a circuit with associated cleanup"""
        print(f"Deleting circuit: {instance.name} (ID: {instance.circuit_id})")
        instance.delete()
        print(f"Successfully deleted circuit with ID: {instance.circuit_id}")

    @action(detail=True, methods=['get'])
    def races(self, request, pk=None):
        circuit = self.get_object()
        races = Race.objects.filter(circuit=circuit).order_by('-date')
        serializer = RaceSerializer(races, many=True)
        return Response(serializer.data)


class RaceViewSet(viewsets.ModelViewSet):
    queryset = Race.objects.all().order_by('-date')
    serializer_class = RaceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['location', 'season__year', 'circuit__name']
    ordering_fields = ['date', 'location', 'number_of_laps']

    @action(detail=False, methods=['post'])
    def perform_create(self, serializer):
        """Custom method for creating a race with validation"""
        print("Received data for race creation:", self.request.data)
        try:
            race = serializer.save()
            print(f"Successfully created race: {race.location} (ID: {race.race_id})")
            return race
        except Exception as e:
            print(f"Error creating race: {str(e)}")
            raise
    
    @action(detail=False, methods=['patch'])
    def perform_update(self, serializer):
        """Custom method for updating a race with validation"""
        print("Received data for race update:", self.request.data)
        try:
            race = serializer.save()
            print(f"Successfully updated race: {race.location} (ID: {race.race_id})")
            return race
        except Exception as e:
            print(f"Error updating race: {str(e)}")
            raise
    
    def perform_destroy(self, instance):
        """Custom method for deleting a race with associated cleanup"""
        print(f"Deleting race: {instance.location} (ID: {instance.race_id})")
        # Delete race entries, results, etc. associated with this race
        RaceEntry.objects.filter(race=instance).delete()
        RaceResults.objects.filter(race=instance).delete()
        instance.delete()
        print(f"Successfully deleted race with ID: {instance.race_id}")

    @action(detail=True, methods=['get'])
    def entries(self, request, pk=None):
        race = self.get_object()
        entries = RaceEntry.objects.filter(race=race).order_by('grid_position')
        serializer = RaceEntrySerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def results(self, request, pk=None):
        race = self.get_object()
        results = RaceResults.objects.filter(race=race).order_by('final_position')
        serializer = RaceResultsSerializer(results, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def penalties(self, request, pk=None):
        race = self.get_object()
        penalties = Penalties.objects.filter(entry__race=race)
        serializer = PenaltiesSerializer(penalties, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def failures(self, request, pk=None):
        race = self.get_object()
        failures = Failures.objects.filter(entry__race=race)
        serializer = FailuresSerializer(failures, many=True)
        return Response(serializer.data)


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'nationality', 'team__team_name', 'employment_status']
    ordering_fields = ['name', 'dob', 'salary']

    def perform_create(self, serializer):
        """Custom method for creating a staff member with validation"""
        print("Received data for staff creation:", self.request.data)
        try:
            staff = serializer.save()
            print(f"Successfully created staff member: {staff.name} (ID: {staff.staff_id})")
            return staff
        except Exception as e:
            print(f"Error creating staff member: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating a staff member with validation"""
        print("Received data for staff update:", self.request.data)
        try:
            staff = serializer.save()
            print(f"Successfully updated staff member: {staff.name} (ID: {staff.staff_id})")
            return staff
        except Exception as e:
            print(f"Error updating staff member: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting a staff member with associated cleanup"""
        print(f"Deleting staff member: {instance.name} (ID: {instance.staff_id})")
        instance.delete()
        print(f"Successfully deleted staff member with ID: {instance.staff_id}")


class SponsorViewSet(viewsets.ModelViewSet):
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['sponsor_name', 'industry', 'headquarters', 'sponsorship_type']
    ordering_fields = ['sponsor_name', 'annual_funding']

    def perform_create(self, serializer):
        """Custom method for creating a sponsor with validation"""
        print("Received data for sponsor creation:", self.request.data)
        try:
            sponsor = serializer.save()
            print(f"Successfully created sponsor: {sponsor.sponsor_name} (ID: {sponsor.sponsor_id})")
            return sponsor
        except Exception as e:
            print(f"Error creating sponsor: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating a sponsor with validation"""
        print("Received data for sponsor update:", self.request.data)
        try:
            sponsor = serializer.save()
            print(f"Successfully updated sponsor: {sponsor.sponsor_name} (ID: {sponsor.sponsor_id})")
            return sponsor
        except Exception as e:
            print(f"Error updating sponsor: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting a sponsor with associated cleanup"""
        print(f"Deleting sponsor: {instance.sponsor_name} (ID: {instance.sponsor_id})")
        instance.delete()
        print(f"Successfully deleted sponsor with ID: {instance.sponsor_id}")

    @action(detail=True, methods=['get'])
    def sponsorships(self, request, pk=None):
        sponsor = self.get_object()
        sponsorships = Sponsorship.objects.filter(sponsor=sponsor)
        serializer = SponsorshipSerializer(sponsorships, many=True)
        return Response(serializer.data)


class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all()
    serializer_class = CarSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['model', 'chassis', 'engine_manufacturer', 'team__team_name']
    ordering_fields = ['model', 'weight', 'horsepower']

    def perform_create(self, serializer):
        """Custom method for creating a car with validation"""
        print("Received data for car creation:", self.request.data)
        try:
            car = serializer.save()
            print(f"Successfully created car: {car.model} (ID: {car.car_id})")
            return car
        except Exception as e:
            print(f"Error creating car: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating a car with validation"""
        print("Received data for car update:", self.request.data)
        try:
            car = serializer.save()
            print(f"Successfully updated car: {car.model} (ID: {car.car_id})")
            return car
        except Exception as e:
            print(f"Error updating car: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting a car with associated cleanup"""
        print(f"Deleting car: {instance.model} (ID: {instance.car_id})")
        instance.delete()
        print(f"Successfully deleted car with ID: {instance.car_id}")

    @action(detail=True, methods=['get'])
    def race_entries(self, request, pk=None):
        car = self.get_object()
        entries = RaceEntry.objects.filter(car=car).order_by('-race__date')
        serializer = RaceEntrySerializer(entries, many=True)
        return Response(serializer.data)


class RaceEntryViewSet(viewsets.ModelViewSet):
    queryset = RaceEntry.objects.all()
    serializer_class = RaceEntrySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['driver__name', 'race__location', 'car__model']
    ordering_fields = ['grid_position', 'grid_position_final']

    @action(detail=False, methods=['post'])
    def perform_create(self, serializer):
        """Custom method for creating a race entry with validation"""
        print("Received data for race entry creation:", self.request.data)
        try:
            entry = serializer.save()
            print(f"Successfully created race entry: Driver {entry.driver.name} in {entry.race.location} (ID: {entry.entry_id})")
            return entry
        except Exception as e:
            print(f"Error creating race entry: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating a race entry with validation"""
        print("Received data for race entry update:", self.request.data)
        try:
            entry = serializer.save()
            print(f"Successfully updated race entry: Driver {entry.driver.name} in {entry.race.location} (ID: {entry.entry_id})")
            return entry
        except Exception as e:
            print(f"Error updating race entry: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting a race entry with associated cleanup"""
        print(f"Deleting race entry: Driver {instance.driver.name} in {instance.race.location} (ID: {instance.entry_id})")
        # Delete associated penalties and failures
        Penalties.objects.filter(entry=instance).delete()
        Failures.objects.filter(entry=instance).delete()
        instance.delete()
        print(f"Successfully deleted race entry with ID: {instance.entry_id}")


class RaceResultsViewSet(viewsets.ModelViewSet):
    queryset = RaceResults.objects.all()
    serializer_class = RaceResultsSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['driver__name', 'race__location', 'dnf_status']
    ordering_fields = ['final_position', 'points_scored', 'fastest_lap_time', 'overtakes_made']

    def perform_create(self, serializer):
        """Custom method for creating race results with validation"""
        print("Received data for race results creation:", self.request.data)
        try:
            result = serializer.save()
            print(f"Successfully created race result: Driver {result.driver.name} in {result.race.location} (ID: {result.result_id})")
            return result
        except Exception as e:
            print(f"Error creating race result: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating race results with validation"""
        print("Received data for race results update:", self.request.data)
        try:
            result = serializer.save()
            print(f"Successfully updated race result: Driver {result.driver.name} in {result.race.location} (ID: {result.result_id})")
            return result
        except Exception as e:
            print(f"Error updating race result: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting race results with associated cleanup"""
        print(f"Deleting race result: Driver {instance.driver.name} in {instance.race.location} (ID: {instance.result_id})")
        instance.delete()
        print(f"Successfully deleted race result with ID: {instance.result_id}")


class PenaltiesViewSet(viewsets.ModelViewSet):
    queryset = Penalties.objects.all()
    serializer_class = PenaltiesSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['entry__driver__name', 'penalty_type', 'penalty_reason', 'penalty_status']
    ordering_fields = ['created_on']
    
    def perform_create(self, serializer):
        """Custom method for creating penalties with validation"""
        print("Received data for penalties creation:", self.request.data)
        try:
            penalty = serializer.save()
            print(f"Successfully created penalty: {penalty.penalty_type} for {penalty.entry.driver.name} (ID: {penalty.penalty_id})")
            return penalty
        except Exception as e:
            print(f"Error creating penalty: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating penalties with validation"""
        print("Received data for penalties update:", self.request.data)
        try:
            penalty = serializer.save()
            print(f"Successfully updated penalty: {penalty.penalty_type} for {penalty.entry.driver.name} (ID: {penalty.penalty_id})")
            return penalty
        except Exception as e:
            print(f"Error updating penalty: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting penalties with associated cleanup"""
        print(f"Deleting penalty: {instance.penalty_type} for {instance.entry.driver.name} (ID: {instance.penalty_id})")
        instance.delete()
        print(f"Successfully deleted penalty with ID: {instance.penalty_id}")


class FailuresViewSet(viewsets.ModelViewSet):
    queryset = Failures.objects.all()
    serializer_class = FailuresSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['entry__driver__name', 'failure_type', 'failure_description']
    ordering_fields = ['created_on']
    
    def perform_create(self, serializer):
        """Custom method for creating failure records with validation"""
        print("Received data for failure creation:", self.request.data)
        try:
            failure = serializer.save()
            print(f"Successfully created failure: {failure.failure_type} for {failure.entry.driver.name} (ID: {failure.failure_id})")
            return failure
        except Exception as e:
            print(f"Error creating failure: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating failure records with validation"""
        print("Received data for failure update:", self.request.data)
        try:
            failure = serializer.save()
            print(f"Successfully updated failure: {failure.failure_type} for {failure.entry.driver.name} (ID: {failure.failure_id})")
            return failure
        except Exception as e:
            print(f"Error updating failure: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting failure records with associated cleanup"""
        print(f"Deleting failure: {instance.failure_type} for {instance.entry.driver.name} (ID: {instance.failure_id})")
        instance.delete()
        print(f"Successfully deleted failure with ID: {instance.failure_id}")


class RecordsViewSet(viewsets.ModelViewSet):
    queryset = Records.objects.all()
    serializer_class = RecordsSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['record_type', 'record_description', 'driver_of_the_day']
    ordering_fields = ['created_on']
    
    def perform_create(self, serializer):
        """Custom method for creating record entries with validation"""
        print("Received data for record creation:", self.request.data)
        try:
            record = serializer.save()
            print(f"Successfully created record: {record.record_type} (ID: {record.record_id})")
            return record
        except Exception as e:
            print(f"Error creating record: {str(e)}")
            raise
        
    def perform_update(self, serializer):
        """Custom method for updating record entries with validation"""
        print("Received data for record update:", self.request.data)
        try:
            record = serializer.save()
            print(f"Successfully updated record: {record.record_type} (ID: {record.record_id})")
            return record
        except Exception as e:
            print(f"Error updating record: {str(e)}")
            raise
            
    def perform_destroy(self, instance):
        """Custom method for deleting record entries with associated cleanup"""
        print(f"Deleting record: {instance.record_type} (ID: {instance.record_id})")
        instance.delete()
        print(f"Successfully deleted record with ID: {instance.record_id}")

