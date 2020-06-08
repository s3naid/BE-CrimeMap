from rest_framework import serializers
from .models import Naselje, Djelo, Opstina
from .Collect_crime_data import list_of_crimes
from .Collect_crime_data import IDS
from .Collect_crime_data import baseURL
from rest_framework_gis.serializers import GeoFeatureModelSerializer


class DjeloSerializer(serializers.ModelSerializer):
    class Meta:
        model = Djelo
        fields = (
            "ulica",
            "opstina",
            "djelo",
            "link",
            "datum",
            "naselje",
            "ulaz",
        )
        read_only_fields = ["ulica", "opstina", "djelo", "link", "datum", "naselje"]

    def create(self, validated_data):
        if validated_data["ulaz"]:
            for id in IDS:
                lista = list_of_crimes(baseURL.format(id, 2, 5, 2020, 3, 5, 2020))
                for item in lista:
                    if item[3] != "no address":
                        instance = Djelo.objects.create(
                            ulica=item[3],
                            opstina=IDS[id],
                            djelo=item[1],
                            link=item[2],
                            datum=item[0],
                            naselje=Naselje.objects.filter(
                                ulica__ulica=item[3]
                            ).first(),
                        )
                    else:
                        instance = Djelo.objects.create(
                            ulica=item[3],
                            opstina=IDS[id],
                            djelo=item[1],
                            link=item[2],
                            datum=item[0],
                            naselje=None,
                        )
            instance.save()
            return instance


class NaseljeSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Naselje
        geo_field = "geom"
        fields = (
            "geom",
            "name",
            "opstina",
            "kriminalitet",
        )


class OpstinaSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Opstina
        geo_field = "geom"
        fields = (
            "geom",
            "name",
            "kriminalitet",
            "brDjela",
        )
