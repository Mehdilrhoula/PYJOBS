from .admin_views import (
    AdminApplicationDetailView,
    AdminCompanyCreateView,
    AdminUserListCreateView,
    AdminUserDetailView,
    AdminCompanyListView,
    AdminCompanyDetailView,
)


from django.urls import path

from .session_views import SessionView
from .views import (
    AdsListView,
    AdsCreateView,
    AdsDetailView,
    CompanyCreateView,
    CompanyUpdateView,
    MyCompaniesView,
    ApplicationCreateView,
    ApplicationListView,
    MyApplicationsView,
    EmployerApplicationsView,
    ApplicationStatusUpdateView,
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
)


urlpatterns = [
    path("admin/applications/<int:application_id>/", AdminApplicationDetailView.as_view(), name="admin-application-detail"),

    path("admin/companies/create/", AdminCompanyCreateView.as_view(), name="admin-company-create"),

    path(
        "admin/companies/",
        AdminCompanyListView.as_view(),
        name="admin-companies",
    ),
    path(
        "admin/companies/<int:company_id>/",
        AdminCompanyDetailView.as_view(),
        name="admin-company-detail",
    ),

    path("admin/users/", AdminUserListCreateView.as_view(), name="admin-users"),
    path("admin/users/<int:pk>/", AdminUserDetailView.as_view(), name="admin-user-detail"),

    path(
        "session/",
        SessionView.as_view(),
        name="session",
    ),
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),
    path(
        "profile/",
        ProfileView.as_view(),
        name="profile",
    ),
    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change-password",
    ),
    path(
        "ads/",
        AdsListView.as_view(),
        name="ads-list",
    ),
    path(
        "ads/create/",
        AdsCreateView.as_view(),
        name="ads-create",
    ),
    path(
        "ads/<int:ad_id>/",
        AdsDetailView.as_view(),
        name="ads-detail",
    ),
    path(
        "companies/create/",
        CompanyCreateView.as_view(),
        name="company-create",
    ),
    path(
        "companies/<int:company_id>/",
        CompanyUpdateView.as_view(),
        name="company-update",
    ),
    path(
        "my-companies/",
        MyCompaniesView.as_view(),
        name="my-companies",
    ),
    path(
        "applications/create/",
        ApplicationCreateView.as_view(),
        name="application-create",
    ),
    path(
        "applications/",
        ApplicationListView.as_view(),
        name="application-list",
    ),
    path(
        "my-applications/",
        MyApplicationsView.as_view(),
        name="my-applications",
    ),
    path(
        "employer-applications/",
        EmployerApplicationsView.as_view(),
        name="employer-applications",
    ),
    path(
        "applications/<int:application_id>/status/",
        ApplicationStatusUpdateView.as_view(),
        name="application-status-update",
    ),
]
