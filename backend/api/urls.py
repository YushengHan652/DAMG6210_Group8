from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TeamViewSet, DriverViewSet, SeasonViewSet, CircuitViewSet, RaceViewSet,
    StaffViewSet, SponsorViewSet, CarViewSet, RaceEntryViewSet, RaceResultsViewSet,
    PenaltiesViewSet, FailuresViewSet, RecordsViewSet
)

router = DefaultRouter()
router.register(r'teams', TeamViewSet)
router.register(r'drivers', DriverViewSet)
router.register(r'seasons', SeasonViewSet)
router.register(r'circuits', CircuitViewSet)
router.register(r'races', RaceViewSet)
router.register(r'staff', StaffViewSet)
router.register(r'sponsors', SponsorViewSet)
router.register(r'cars', CarViewSet)
router.register(r'race-entries', RaceEntryViewSet)
router.register(r'race-results', RaceResultsViewSet)
router.register(r'penalties', PenaltiesViewSet)
router.register(r'failures', FailuresViewSet)
router.register(r'records', RecordsViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]