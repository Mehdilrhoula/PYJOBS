from django.urls import path

from .views import (
    AdsListView,
    AdsCreateView,
    AdsDetailView,
    CompanyCreateView,
    MyCompaniesView,
    ApplicationCreateView,
    ApplicationListView,
    MyApplicationsView,
    EmployerApplicationsView,
    RegisterView,
    LoginView,
    LogoutView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),

    path("ads/", AdsListView.as_view(), name="ads-list"),
    path("ads/create/", AdsCreateView.as_view(), name="ads-create"),
    path("ads/<int:ad_id>/", AdsDetailView.as_view(), name="ads-detail"),

    path("companies/create/", CompanyCreateView.as_view(), name="company-create"),
    path("my-companies/", MyCompaniesView.as_view(), name="my-companies"),

    path("applications/create/", ApplicationCreateView.as_view(), name="application-create"),
    path("applications/", ApplicationListView.as_view(), name="application-list"),
    path("my-applications/", MyApplicationsView.as_view(), name="my-applications"),
    path("employer-applications/", EmployerApplicationsView.as_view(), name="employer-applications"),
]