from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers

from .models import Ads, Company, Person, Application, UserProfile


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["company_id", "name"]


class CompanyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["company_id", "name"]

    def create(self, validated_data):
        return Company.objects.create(
            **validated_data,
            owner=self.context["request"].user,
        )


class AdsSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Ads
        fields = [
            "ad_id", "title", "company", "category", "city",
            "contract_type", "salary_min", "salary_max",
            "work_mode", "work_time", "experience_level",
            "description",
        ]


class AdsCreateSerializer(serializers.ModelSerializer):
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(),
        source="company",
        write_only=True,
    )

    class Meta:
        model = Ads
        fields = [
            "ad_id", "title", "company_id", "category", "city",
            "contract_type", "salary_min", "salary_max",
            "work_mode", "work_time", "experience_level",
            "description",
        ]
        read_only_fields = ["ad_id"]


class ApplicationSerializer(serializers.ModelSerializer):
    ad_id = serializers.PrimaryKeyRelatedField(
        queryset=Ads.objects.all(),
        source="ad",
        write_only=True,
    )

    class Meta:
        model = Application
        fields = [
            "application_id", "ad_id", "message", "application_date",
        ]
        read_only_fields = ["application_id", "application_date"]

    def validate(self, attrs):
        request = self.context["request"]

        if not hasattr(request.user, "profile"):
            raise serializers.ValidationError(
                {"detail": "Profil utilisateur introuvable."}
            )

        if request.user.profile.role != "candidate":
            raise serializers.ValidationError(
                {"detail": "Seuls les candidats peuvent postuler."}
            )

        person = Person.objects.filter(
            email__iexact=request.user.email
        ).first()

        if person is None:
            raise serializers.ValidationError(
                {"detail": "Fiche candidat introuvable."}
            )

        if Application.objects.filter(
            person=person, ad=attrs["ad"]
        ).exists():
            raise serializers.ValidationError(
                {"detail": "Tu as déjà postulé à cette annonce."}
            )

        return attrs


class ApplicationListSerializer(serializers.ModelSerializer):
    person = serializers.StringRelatedField()
    ad = serializers.StringRelatedField()

    class Meta:
        model = Application
        fields = [
            "application_id", "person", "ad",
            "message", "application_date",
        ]


class MyApplicationSerializer(serializers.ModelSerializer):
    ad = AdsSerializer(read_only=True)

    class Meta:
        model = Application
        fields = [
            "application_id", "ad", "message", "application_date",
        ]


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(
        choices=UserProfile.ROLE_CHOICES,
        default="candidate",
    )

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Un compte utilise déjà cette adresse e-mail."
            )

        if Person.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "Une fiche candidat utilise déjà cette adresse e-mail."
            )

        return value

    @transaction.atomic
    def create(self, validated_data):
        name = validated_data["name"]
        email = validated_data["email"]
        password = validated_data["password"]
        role = validated_data["role"]

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name,
        )

        Person.objects.create(name=name, email=email)

        UserProfile.objects.create(user=user, role=role)

        return user

    def to_representation(self, instance):
        return {
            "message": "Compte créé avec succès.",
            "email": instance.email,
            "role": instance.profile.role,
        }