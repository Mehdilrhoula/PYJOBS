
from django.urls import path
from .views import (
    AdsListView,
    AdsCreateView,
    AdsDetailView,
    ApplicationCreateView,
    ApplicationListView,
)

urlpatterns = [
    path("ads/", AdsListView.as_view(), name="ads-list"),
    path("ads/create/", AdsCreateView.as_view(), name="ads-create"),
    path("ads/<int:ad_id>/", AdsDetailView.as_view(), name="ads-detail"),
    path("applications/", ApplicationListView.as_view(), name="application-list"),
    path(
    "applications/create/",
    ApplicationCreateView.as_view(),
    name="application-create",
    ),
]
