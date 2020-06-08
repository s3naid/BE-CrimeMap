from rest_framework import viewsets

from .serializers import DjeloSerializer, NaseljeSerializer, OpstinaSerializer
from .models import Djelo, Naselje, Opstina


class DjeloViewSet(viewsets.ModelViewSet):
    serializer_class = DjeloSerializer
    queryset = Djelo.objects.all()


class NaseljeViewSet(viewsets.ModelViewSet):
    serializer_class = NaseljeSerializer
    queryset = Naselje.objects.all()


class OpstinaViewSet(viewsets.ModelViewSet):
    serializer_class = OpstinaSerializer
    queryset = Opstina.objects.all()
