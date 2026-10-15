
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.db.models.deletion import ProtectedError
from rest_framework import generics, serializers, status
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import Ads, Application, Company, Person, UserProfile
from .serializers import CompanySerializer


class AdminUserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="first_name", max_length=100)
    role = serializers.ChoiceField(
        choices=["candidate", "employer"],
        required=False,
    )
    password = serializers.CharField(
        write_only=True,
        required=False,
        trim_whitespace=False,
    )

    class Meta:
        model = User
        fields = [
            "id", "name", "email", "role",
            "is_active", "password",
        ]
        read_only_fields = ["id"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["role"] = (
            "admin" if instance.is_staff
            else instance.profile.role
            if hasattr(instance, "profile")
            else "candidate"
        )
        return data

    def validate_email(self, value):
        email = value.strip().lower()
        users = User.objects.filter(email__iexact=email)
        persons = Person.objects.filter(email__iexact=email)

        if self.instance:
            users = users.exclude(pk=self.instance.pk)
            persons = persons.exclude(user=self.instance)

        if users.exists() or persons.exists():
            raise serializers.ValidationError(
                "Cette adresse e-mail est déjà utilisée."
            )

        return email

    def validate_password(self, value):
        try:
            validate_password(value, user=self.instance)
        except DjangoValidationError as error:
            raise serializers.ValidationError(error.messages)
        return value

    def validate(self, attrs):
        if self.instance is None:
            if not attrs.get("password"):
                raise serializers.ValidationError({
                    "password": "Le mot de passe est obligatoire."
                })
            if not attrs.get("role"):
                raise serializers.ValidationError({
                    "role": "Choisissez candidat ou employeur."
                })

        if self.instance and self.instance.is_staff:
            raise serializers.ValidationError({
                "detail": (
                    "Les comptes administrateurs ne peuvent pas "
                    "être modifiés depuis cette interface."
                )
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        role = validated_data.pop("role")
        password = validated_data.pop("password")
        name = validated_data.get("first_name", "")
        email = validated_data["email"]

        user = User.objects.create_user(
            username=email,
            email=email,
            first_name=name,
            password=password,
            is_active=validated_data.get("is_active", True),
        )

        Person.objects.create(
            user=user,
            name=name,
            email=email,
        )
        UserProfile.objects.create(user=user, role=role)
        return user

    @transaction.atomic
    def update(self, instance, validated_data):
        role = validated_data.pop("role", None)
        password = validated_data.pop("password", None)

        name = validated_data.get("first_name", instance.first_name)
        email = validated_data.get("email", instance.email)

        instance.first_name = name
        instance.email = email
        instance.username = email
        instance.is_active = validated_data.get(
            "is_active", instance.is_active
        )

        if password:
            instance.set_password(password)

        instance.save()

        Person.objects.filter(user=instance).update(
            name=name,
            email=email,
        )

        if role is not None:
            UserProfile.objects.update_or_create(
                user=instance,
                defaults={"role": role},
            )

        return instance


class AdminUserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.select_related("profile").order_by("id")
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.select_related("profile").all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    http_method_names = [
        "get", "patch", "delete", "head", "options",
    ]

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()

        if user.is_staff or user.is_superuser:
            return Response(
                {
                    "detail": (
                        "La suppression d'un compte administrateur "
                        "est interdite depuis cette interface."
                    )
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            with transaction.atomic():
                user.delete()
        except ProtectedError:
            return Response(
                {
                    "detail": (
                        "Ce compte possède des données protégées. "
                        "Supprimez ou traitez d'abord les éléments liés."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCompanyListView(generics.ListAPIView):
    queryset = Company.objects.all().order_by("company_id")
    serializer_class = CompanySerializer
    permission_classes = [IsAdminUser]


class AdminCompanyDetailView(generics.DestroyAPIView):
    queryset = Company.objects.all()
    permission_classes = [IsAdminUser]
    lookup_field = "company_id"

    def destroy(self, request, *args, **kwargs):
        company = self.get_object()

        try:
            with transaction.atomic():
                company.delete()
        except ProtectedError:
            return Response(
                {
                    "detail": (
                        "Cette entreprise possède des annonces. "
                        "Traitez d'abord ses annonces."
                    )
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCompanyCreateSerializer(serializers.ModelSerializer):
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(
            is_staff=False,
            is_active=True,
            profile__role="employer",
        ),
        source="owner",
    )

    class Meta:
        model = Company
        fields = ["company_id", "name", "owner_id"]
        read_only_fields = ["company_id"]

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError(
                "Le nom de l'entreprise est obligatoire."
            )
        return value


class AdminCompanyCreateView(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = AdminCompanyCreateSerializer
    permission_classes = [IsAdminUser]


class AdminApplicationDetailView(generics.DestroyAPIView):
    queryset = Application.objects.all()
    permission_classes = [IsAdminUser]
    lookup_field = "application_id"
