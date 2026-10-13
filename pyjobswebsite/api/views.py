
from rest_framework import generics

from .models import Ads, Application
from .serializers import (
    AdsSerializer,
    AdsCreateSerializer,
    ApplicationSerializer,
    ApplicationListSerializer,
)


class AdsListView(generics.ListAPIView):
    queryset = Ads.objects.select_related("company").all()
    serializer_class = AdsSerializer


class AdsCreateView(generics.CreateAPIView):
    queryset = Ads.objects.all()
    serializer_class = AdsCreateSerializer


class ApplicationCreateView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer


class AdsDetailView(generics.RetrieveAPIView):
    queryset = Ads.objects.select_related("company").all()
    serializer_class = AdsSerializer
    lookup_field = "ad_id"


class ApplicationListView(generics.ListAPIView):
    queryset = Application.objects.select_related("person", "ad").all()
    serializer_class = ApplicationListSerializer
