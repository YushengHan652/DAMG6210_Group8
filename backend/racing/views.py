from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic import ListView, DetailView, TemplateView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.db.models import Sum, Avg, Count, F, Q
from django.http import JsonResponse
from django.contrib import messages
from datetime import datetime  # Change this line

from .models import (
    Team, Driver, Season, Standings, Staff, Mechanic, Analyst, Manager, Engineer,
    Sponsor, Sponsorship, Car, Circuit, Race, RaceEntry, RaceResults, Penalties, 
    Failures, Records
)
from .services import F1ExternalAPI, WeatherAPI, DataSyncService


class DashboardView(TemplateView):
    """Main dashboard view for the F1 Management System."""
    template_name = 'racing/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Get current season
        current_season = Season.objects.order_by('-year').first()
        
        if current_season:
            # Get top 10 drivers by points
            driver_standings = Standings.objects.filter(
                season=current_season,
                entity_type='Driver'
            ).order_by('rank')[:10]
            
            # Get team standings
            team_standings = Standings.objects.filter(
                season=current_season,
                entity_type='Team'
            ).order_by('rank')
            
            # Get recent races
            recent_races = Race.objects.filter(
                season=current_season
            ).order_by('-date')[:5]
            
            # Get upcoming races
            upcoming_races = Race.objects.filter(
                season=current_season,
                date__gt=datetime.now().date()
            ).order_by('date')[:5]
            
            context.update({
                'current_season': current_season,
                'driver_standings': driver_standings,
                'team_standings': team_standings,
                'recent_races': recent_races,
                'upcoming_races': upcoming_races
            })
        
        return context


class TeamListView(ListView):
    """List view for F1 teams."""
    model = Team
    template_name = 'racing/team_list.html'
    context_object_name = 'teams'
    
    def get_queryset(self):
        queryset = Team.objects.all()
        
        # Apply filters if provided
        search_query = self.request.GET.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(team_name__icontains=search_query) |
                Q(team_country__icontains=search_query) |
                Q(team_principal__icontains=search_query)
            )
        
        # Apply sorting
        sort_by = self.request.GET.get('sort', 'team_name')
        if sort_by == 'championships_desc':
            queryset = queryset.order_by('-championships_won')
        elif sort_by == 'founded':
            queryset = queryset.order_by('founded_year')
        else:
            queryset = queryset.order_by('team_name')
        
        return queryset


class TeamDetailView(DetailView):
    """Detail view for a single F1 team."""
    model = Team
    template_name = 'racing/team_detail.html'
    context_object_name = 'team'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        team = self.object
        
        # Get current drivers
        context['drivers'] = Driver.objects.filter(team=team)
        
        # Get team staff
        context['staff'] = Staff.objects.filter(team=team)
        
        # Get engineers
        engineer_ids = Engineer.objects.values_list('staff_id', flat=True)
        context['engineers'] = Staff.objects.filter(
            team=team,
            staff_id__in=engineer_ids
        )
        
        # Get mechanics
        mechanic_ids = Mechanic.objects.values_list('staff_id', flat=True)
        context['mechanics'] = Staff.objects.filter(
            team=team,
            staff_id__in=mechanic_ids
        )
        
        # Get cars
        context['cars'] = Car.objects.filter(team=team)
        
        # Get sponsorships
        context['sponsorships'] = Sponsorship.objects.filter(team=team)
        
        # Get team standings history
        context['standings_history'] = Standings.objects.filter(
            entity_id=team.team_id,
            entity_type='Team'
        ).order_by('-season__year')
        
        return context


class DriverListView(ListView):
    """List view for F1 drivers."""
    model = Driver
    template_name = 'racing/driver_list.html'
    context_object_name = 'drivers'
    
    def get_queryset(self):
        queryset = Driver.objects.all()
        
        # Apply filters if provided
        search_query = self.request.GET.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(nationality__icontains=search_query) |
                Q(team__team_name__icontains=search_query)
            )
        
        # Filter by team
        team_id = self.request.GET.get('team_id', None)
        if team_id:
            team_id = int(team_id)
            queryset = queryset.filter(team__team_id=team_id)
        
        # Filter by team_name
        team_name = self.request.GET.get('team_name', None)
        if team_name:
            # Handle + characters in team_name by replacing with spaces
            team_name = team_name.replace('+', ' ')
            queryset = queryset.filter(team__team_name=team_name)
        
        # Apply sorting
        sort_by = self.request.GET.get('sort', 'name')
        if sort_by == 'wins_desc':
            queryset = queryset.order_by('-number_of_wins')
        elif sort_by == 'poles_desc':
            queryset = queryset.order_by('-pole_positions')
        elif sort_by == 'age':
            queryset = queryset.order_by('age')
        else:
            queryset = queryset.order_by('name')
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['teams'] = Team.objects.all()
        return context


class DriverDetailView(DetailView):
    """Detail view for a single F1 driver."""
    model = Driver
    template_name = 'racing/driver_detail.html'
    context_object_name = 'driver'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        driver = self.object
        
        # Get current season
        current_season = Season.objects.order_by('-year').first()
        
        if current_season:
            # Get driver's current season results
            context['race_results'] = RaceResults.objects.filter(
                driver=driver,
                race__season=current_season
            ).order_by('-race__date')
            
            # Get driver's standings
            try:
                context['current_standings'] = Standings.objects.get(
                    entity_id=driver.driver_id,
                    entity_type='Driver',
                    season=current_season
                )
            except Standings.DoesNotExist:
                context['current_standings'] = None
        
        # Get race entries
        context['race_entries'] = RaceEntry.objects.filter(
            driver=driver
        ).order_by('-race__date')
        
        # Get penalties
        context['penalties'] = Penalties.objects.filter(
            entry__driver=driver
        )
        
        # Get failures
        context['failures'] = Failures.objects.filter(
            entry__driver=driver
        )
        
        # Get career stats
        career_stats = RaceResults.objects.filter(driver=driver).aggregate(
            total_races=Count('result_id'),
            total_wins=Count('result_id', filter=Q(final_position=1)),
            total_podiums=Count('result_id', filter=Q(final_position__lte=3)),
            total_points=Sum('points_scored'),
            avg_finish=Avg('final_position', filter=Q(final_position__isnull=False))
        )
        context['career_stats'] = career_stats
        
        return context


class RaceListView(ListView):
    """List view for F1 races."""
    model = Race
    template_name = 'racing/race_list.html'
    context_object_name = 'races'
    
    def get_queryset(self):
        queryset = Race.objects.all()
        
        # Filter by season
        season_id = self.request.GET.get('season', None)
        if season_id:
            queryset = queryset.filter(season_id=season_id)
        else:
            # Default to current season
            current_season = Season.objects.order_by('-year').first()
            if current_season:
                queryset = queryset.filter(season=current_season)
        
        # Apply filters if provided
        search_query = self.request.GET.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(location__icontains=search_query) |
                Q(circuit__name__icontains=search_query)
            )
        
        # Apply sorting
        sort_by = self.request.GET.get('sort', 'date')
        if sort_by == 'location':
            queryset = queryset.order_by('location')
        elif sort_by == 'circuit':
            queryset = queryset.order_by('circuit__name')
        else:
            queryset = queryset.order_by('date')
        
        return queryset
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['seasons'] = Season.objects.all().order_by('-year')
        return context


class RaceDetailView(DetailView):
    """Detail view for a single F1 race."""
    model = Race
    template_name = 'racing/race_detail.html'
    context_object_name = 'race'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        race = self.object
        
        # Get race results
        context['race_results'] = RaceResults.objects.filter(
            race=race
        ).order_by('final_position')
        
        # Get race entries
        context['race_entries'] = RaceEntry.objects.filter(
            race=race
        ).order_by('grid_position')
        
        # Get penalties
        context['penalties'] = Penalties.objects.filter(
            entry__race=race
        )
        
        # Get failures
        context['failures'] = Failures.objects.filter(
            entry__race=race
        )
        
        # Get weather forecast for upcoming races
        if race.date > datetime.now().date():
            weather_service = WeatherAPI()
            context['weather_forecast'] = weather_service.get_current_weather(
                race.location,
                race.circuit.country
            )
        
        return context


class SeasonListView(ListView):
    """List view for F1 seasons."""
    model = Season
    template_name = 'racing/season_list.html'
    context_object_name = 'seasons'
    
    def get_queryset(self):
        return Season.objects.all().order_by('-year')


class SeasonDetailView(DetailView):
    """Detail view for a single F1 season."""
    model = Season
    template_name = 'racing/season_detail.html'
    context_object_name = 'season'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        season = self.object
        
        # Get driver standings
        context['driver_standings'] = Standings.objects.filter(
            season=season,
            entity_type='Driver'
        ).order_by('rank')
        
        # Get team standings
        context['team_standings'] = Standings.objects.filter(
            season=season,
            entity_type='Team'
        ).order_by('rank')
        
        # Get races
        context['races'] = Race.objects.filter(
            season=season
        ).order_by('date')
        
        return context


class CircuitListView(ListView):
    """List view for F1 circuits."""
    model = Circuit
    template_name = 'racing/circuit_list.html'
    context_object_name = 'circuits'
    
    def get_queryset(self):
        queryset = Circuit.objects.all()
        
        # Apply filters if provided
        search_query = self.request.GET.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(country__icontains=search_query)
            )
        
        # Filter by type
        circuit_type = self.request.GET.get('type', None)
        if circuit_type:
            queryset = queryset.filter(type=circuit_type)
        
        # Apply sorting
        sort_by = self.request.GET.get('sort', 'name')
        if sort_by == 'country':
            queryset = queryset.order_by('country', 'name')
        elif sort_by == 'length':
            queryset = queryset.order_by('-length_circuit')
        elif sort_by == 'turns':
            queryset = queryset.order_by('-number_of_turns')
        else:
            queryset = queryset.order_by('name')
        
        return queryset


class CircuitDetailView(DetailView):
    """Detail view for a single F1 circuit."""
    model = Circuit
    template_name = 'racing/circuit_detail.html'
    context_object_name = 'circuit'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        circuit = self.object
        
        # Get races at this circuit
        context['races'] = Race.objects.filter(
            circuit=circuit
        ).order_by('-date')
        
        return context


# Function-based view for external API integration
def fetch_external_data(request):
    """Fetches data from external API services."""
    
    action = request.GET.get('action', 'current_season')
    
    f1_api = F1ExternalAPI()
    
    if action == 'current_season':
        data = f1_api.get_current_season_schedule()
    elif action == 'driver_standings':
        year = request.GET.get('year')
        data = f1_api.get_driver_standings(year)
    elif action == 'team_standings':
        year = request.GET.get('year')
        data = f1_api.get_constructor_standings(year)
    elif action == 'race_results':
        year = request.GET.get('year')
        round_num = request.GET.get('round')
        data = f1_api.get_race_results(year, round_num)
    else:
        data = {'error': 'Invalid action specified'}
    
    return JsonResponse(data)


# Function-based view for data sync
def sync_data(request):
    """Syncs data from external sources to our database."""
    
    if not request.user.is_staff:
        messages.error(request, "You don't have permission to perform this action.")
        return redirect('racing:dashboard')
    
    action = request.GET.get('action', 'current_season')
    
    sync_service = DataSyncService()
    
    if action == 'current_season':
        result = sync_service.sync_current_season()
    elif action == 'race_results':
        year = request.GET.get('year')
        round_num = request.GET.get('round')
        result = sync_service.sync_race_results(year, round_num)
    else:
        result = {'status': 'error', 'message': 'Invalid action specified'}
    
    if result['status'] == 'success':
        messages.success(request, result['message'])
    else:
        messages.error(request, result['message'])
    
    return redirect(request.META.get('HTTP_REFERER', 'racing:dashboard'))