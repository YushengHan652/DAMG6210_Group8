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

    def perform_create(self, serializer):
        """Custom method for creating a driver with validation"""
        serializer.save()
        
    def perform_update(self, serializer):
        """Custom method for updating a driver with validation"""
        serializer.save()
        
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


class SponsorViewSet(viewsets.ModelViewSet):
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['sponsor_name', 'industry', 'headquarters', 'sponsorship_type']
    ordering_fields = ['sponsor_name', 'annual_funding']

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


class RaceResultsViewSet(viewsets.ModelViewSet):
    queryset = RaceResults.objects.all()
    serializer_class = RaceResultsSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['driver__name', 'race__location', 'dnf_status']
    ordering_fields = ['final_position', 'points_scored', 'fastest_lap_time', 'overtakes_made']


class PenaltiesViewSet(viewsets.ModelViewSet):
    queryset = Penalties.objects.all()
    serializer_class = PenaltiesSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['entry__driver__name', 'penalty_type', 'penalty_reason', 'penalty_status']
    ordering_fields = ['created_on']


class FailuresViewSet(viewsets.ModelViewSet):
    queryset = Failures.objects.all()
    serializer_class = FailuresSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['entry__driver__name', 'failure_type', 'failure_description']
    ordering_fields = ['created_on']


class RecordsViewSet(viewsets.ModelViewSet):
    queryset = Records.objects.all()
    serializer_class = RecordsSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['record_type', 'record_description', 'driver_of_the_day']
    ordering_fields = ['created_on']

