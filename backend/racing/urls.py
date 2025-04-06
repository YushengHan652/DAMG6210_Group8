from django.urls import path
from . import views

app_name = 'racing'

urlpatterns = [
    # Dashboard
    path('', views.DashboardView.as_view(), name='dashboard'),
    
    # Teams
    path('teams/', views.TeamListView.as_view(), name='team_list'),
    path('teams/<int:pk>/', views.TeamDetailView.as_view(), name='team_detail'),
    
    # Drivers
    path('drivers/', views.DriverListView.as_view(), name='driver_list'),
    path('drivers/<int:pk>/', views.DriverDetailView.as_view(), name='driver_detail'),
    
    # Races
    path('races/', views.RaceListView.as_view(), name='race_list'),
    path('races/<int:pk>/', views.RaceDetailView.as_view(), name='race_detail'),
    
    # Seasons
    path('seasons/', views.SeasonListView.as_view(), name='season_list'),
    path('seasons/<int:pk>/', views.SeasonDetailView.as_view(), name='season_detail'),
    
    # Circuits
    path('circuits/', views.CircuitListView.as_view(), name='circuit_list'),
    path('circuits/<int:pk>/', views.CircuitDetailView.as_view(), name='circuit_detail'),
    
    # External API integration
    path('api/external/', views.fetch_external_data, name='fetch_external_data'),
    
    # Data sync
    path('sync/', views.sync_data, name='sync_data'),
]