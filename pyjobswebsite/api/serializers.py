
from rest_framework import serializers
from .models import Ads, Company, Person, Application


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ["company_id", "name"]


class AdsSerializer(serializers.ModelSerializer):
    company = CompanySerializer(read_only=True)

    class Meta:
        model = Ads
        fields = [
            "ad_id",
            "title",
            "company",
            "category",
            "city",
            "contract_type",
            "salary_min",
            "salary_max",
            "work_mode",
            "work_time",
            "experience_level",
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
            "ad_id",
            "title",
            "company_id",
            "category",
            "city",
            "contract_type",
            "salary_min",
            "salary_max",
            "work_mode",
            "work_time",
            "experience_level",
            "description",
        ]
class ApplicationSerializer(serializers.ModelSerializer):
    person_id = serializers.PrimaryKeyRelatedField(
        queryset=Person.objects.all(),
        source="person",
        write_only=True,
    )

    ad_id = serializers.PrimaryKeyRelatedField(
        queryset=Ads.objects.all(),
        source="ad",
        write_only=True,
    )

    class Meta:
        model = Application
        fields = [
            "application_id",
            "person_id",
            "ad_id",
            "message",
            "application_date",
        ]
        read_only_fields = ["application_id", "application_date"]

        
class ApplicationListSerializer(serializers.ModelSerializer):
    person = serializers.StringRelatedField()
    ad = serializers.StringRelatedField()

    class Meta:
        model = Application
        fields = [
            "application_id",
            "person",
            "ad",
            "message",
            "application_date",
        ]
    