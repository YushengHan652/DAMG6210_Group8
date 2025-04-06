from django.contrib import admin
from .models import (
    Team, Driver, Season, Standings, Staff, Mechanic, Analyst, Manager, Engineer,
    Sponsor, Sponsorship, Car, Circuit, Race, RaceEntry, RaceResults, Penalties, 
    Failures, Records
)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'team_country', 'team_principal', 'championships_won', 'founded_year')
    list_filter = ('team_country', 'championships_won')
    search_fields = ('team_name', 'team_principal')


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'nationality', 'team', 'number_of_wins', 'pole_positions')
    list_filter = ('nationality', 'team', 'age')
    search_fields = ('name', 'nationality')


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    list_display = ('year', 'number_of_races', 'champion_driver', 'champion_team', 'title_sponsor')
    list_filter = ('year',)
    search_fields = ('year', 'title_sponsor')


@admin.register(Standings)
class StandingsAdmin(admin.ModelAdmin):
    list_display = ('season', 'entity_id', 'entity_type', 'points', 'wins', 'rank')
    list_filter = ('season', 'entity_type')
    search_fields = ('entity_id', 'entity_type')


class MechanicInline(admin.StackedInline):
    model = Mechanic
    can_delete = False
    verbose_name_plural = 'Mechanic Details'


class AnalystInline(admin.StackedInline):
    model = Analyst
    can_delete = False
    verbose_name_plural = 'Analyst Details'


class ManagerInline(admin.StackedInline):
    model = Manager
    can_delete = False
    verbose_name_plural = 'Manager Details'


class EngineerInline(admin.StackedInline):
    model = Engineer
    can_delete = False
    verbose_name_plural = 'Engineer Details'


@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('name', 'team', 'employment_status', 'nationality')
    list_filter = ('team', 'employment_status', 'nationality')
    search_fields = ('name', 'nationality')
    inlines = []
    
    def get_inlines(self, request, obj=None):
        inlines = []
        if obj:
            if hasattr(obj, 'mechanic'):
                inlines.append(MechanicInline)
            elif hasattr(obj, 'analyst'):
                inlines.append(AnalystInline)
            elif hasattr(obj, 'manager'):
                inlines.append(ManagerInline)
            elif hasattr(obj, 'engineer'):
                inlines.append(EngineerInline)
        return inlines


@admin.register(Sponsor)
class SponsorAdmin(admin.ModelAdmin):
    list_display = ('sponsor_name', 'industry', 'sponsorship_type', 'annual_funding')
    list_filter = ('industry', 'sponsorship_type')
    search_fields = ('sponsor_name', 'industry')


@admin.register(Sponsorship)
class SponsorshipAdmin(admin.ModelAdmin):
    list_display = ('team', 'sponsor', 'contract_value', 'contract_start', 'contract_end')
    list_filter = ('team', 'sponsor')
    search_fields = ('team__team_name', 'sponsor__sponsor_name')


@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('model', 'team', 'engine_manufacturer', 'weight', 'horsepower')
    list_filter = ('team', 'engine_manufacturer')
    search_fields = ('model', 'chassis', 'team__team_name')


@admin.register(Circuit)
class CircuitAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'length_circuit', 'number_of_turns', 'type')
    list_filter = ('country', 'type')
    search_fields = ('name', 'country')


@admin.register(Race)
class RaceAdmin(admin.ModelAdmin):
    list_display = ('location', 'season', 'date', 'circuit', 'weather_condition')
    list_filter = ('season', 'weather_condition', 'circuit')
    search_fields = ('location', 'circuit__name')
    date_hierarchy = 'date'


@admin.register(RaceEntry)
class RaceEntryAdmin(admin.ModelAdmin):
    list_display = ('race', 'driver', 'car', 'grid_position', 'grid_position_final')
    list_filter = ('race', 'driver', 'car')
    search_fields = ('driver__name', 'race__location')


@admin.register(RaceResults)
class RaceResultsAdmin(admin.ModelAdmin):
    list_display = ('race', 'driver', 'final_position', 'points_scored', 'dnf_status')
    list_filter = ('race', 'driver', 'dnf_status')
    search_fields = ('driver__name', 'race__location')


@admin.register(Penalties)
class PenaltiesAdmin(admin.ModelAdmin):
    list_display = ('entry', 'penalty_type', 'penalty_reason', 'penalty_status')
    list_filter = ('penalty_type', 'penalty_status')
    search_fields = ('penalty_reason', 'entry__driver__name')


@admin.register(Failures)
class FailuresAdmin(admin.ModelAdmin):
    list_display = ('entry', 'failure_type', 'failure_description', 'failure_lap', 'dnf')
    list_filter = ('failure_type', 'dnf')
    search_fields = ('failure_description', 'entry__driver__name')


@admin.register(Records)
class RecordsAdmin(admin.ModelAdmin):
    list_display = ('record_type', 'record_description', 'driver_of_the_day')
    list_filter = ('record_type',)
    search_fields = ('record_description', 'driver_of_the_day')