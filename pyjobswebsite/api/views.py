from django.contrib.auth import authenticate, login, logout
from django.db.models.deletion import ProtectedError

from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import (
    AllowAny, BasePermission, IsAdminUser, IsAuthenticated
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Ads, Application, Company, Person
from .serializers import (
    AdsSerializer,
    AdsCreateSerializer,
    ApplicationSerializer,
    ApplicationListSerializer,
    MyApplicationSerializer,
    CompanySerializer,
    CompanyCreateSerializer,
    RegisterSerializer,
)


def has_role(user, role):
    return (
        user.is_authenticated
        and hasattr(user, "profile")
        and user.profile.role == role
    )


class IsAdminOrCompanyOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return (
            hasattr(request.user, "profile")
            and request.user.profile.role == "employer"
            and obj.company.owner_id == request.user.id
        )


class AdsListView(generics.ListAPIView):
    queryset = Ads.objects.select_related("company").all()
    serializer_class = AdsSerializer
    permission_classes = [AllowAny]


class CompanyCreateView(generics.CreateAPIView):
    serializer_class = CompanyCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not (
            request.user.is_staff
            or has_role(request.user, "employer")
        ):
            raise PermissionDenied(
                "Seuls les employeurs et les administrateurs "
                "peuvent créer une entreprise."
            )
        return super().create(request, *args, **kwargs)


class MyCompaniesView(generics.ListAPIView):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Company.objects.all()
        return Company.objects.filter(owner=self.request.user)


class AdsCreateView(generics.CreateAPIView):
    queryset = Ads.objects.all()
    serializer_class = AdsCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        if not (
            request.user.is_staff
            or has_role(request.user, "employer")
        ):
            raise PermissionDenied(
                "Seuls les employeurs et les administrateurs "
                "peuvent créer des annonces."
            )
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        company = serializer.validated_data["company"]

        if (
            not self.request.user.is_staff
            and company.owner_id != self.request.user.id
        ):
            raise PermissionDenied(
                "Tu ne peux publier que pour ta propre entreprise."
            )

        serializer.save()


class AdsDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ads.objects.select_related("company").all()
    serializer_class = AdsSerializer
    lookup_field = "ad_id"

    def get_permissions(self):
        if self.request.method in ("GET", "HEAD", "OPTIONS"):
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminOrCompanyOwner()]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        try:
            self.perform_destroy(instance)
        except ProtectedError:
            return Response(
                {"detail": "Cette annonce possède des candidatures."},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class ApplicationCreateView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        person = Person.objects.filter(
            email__iexact=self.request.user.email
        ).first()

        if person is None:
            raise PermissionDenied("Fiche candidat introuvable.")

        serializer.save(person=person)


class MyApplicationsView(generics.ListAPIView):
    serializer_class = MyApplicationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        person = Person.objects.filter(
            email__iexact=self.request.user.email
        ).first()

        if person is None:
            return Application.objects.none()

        return Application.objects.filter(
            person=person
        ).select_related("ad", "ad__company")


class ApplicationListView(generics.ListAPIView):
    queryset = Application.objects.select_related("person", "ad").all()
    serializer_class = ApplicationListSerializer
    permission_classes = [IsAdminUser]


class EmployerApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Application.objects.select_related(
                "person", "ad"
            ).all()

        if not has_role(self.request.user, "employer"):
            raise PermissionDenied("Accès réservé aux employeurs.")

        return Application.objects.filter(
            ad__company__owner=self.request.user
        ).select_related("person", "ad")


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if not email or not password:
            return Response(
                {"detail": "L'e-mail et le mot de passe sont obligatoires."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(
            request, username=email, password=password
        )

        if user is None:
            return Response(
                {"detail": "E-mail ou mot de passe incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)

        role = (
            "admin" if user.is_staff
            else user.profile.role if hasattr(user, "profile")
            else "candidate"
        )

        return Response(
            {
                "message": "Connexion réussie.",
                "email": user.email,
                "role": role,
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(
            {"message": "Déconnexion réussie."},
            status=status.HTTP_200_OK,
        )