from django.contrib.gis.db import models
from django.db.models import Manager as GeoManager
from django.db.models import Count


class Opstina(models.Model):
    geom = models.MultiPolygonField(blank=True, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)

    class Meta:
        db_table = "Opstina"

    objects = GeoManager()

    @property
    def kriminalitet(self):
        return len(Djelo.objects.filter(naselje__isnull=True, opstina=self.id))

    @property
    def brDjela(self):
        return (
            Djelo.objects.filter(opstina=self.id)
            .values("djelo")
            .annotate(c=Count("djelo"))
            .order_by("-c")[:10]
        )


class Naselje(models.Model):
    geom = models.PointField(srid=4326, blank=True, null=True)
    name = models.CharField(max_length=300, blank=True, null=True)
    opstina = models.ForeignKey(Opstina, models.CASCADE)

    @property
    def kriminalitet(self):
        return len(Djelo.objects.filter(naselje=self.id))

    class Meta:
        db_table = "Naselje"

    objects = GeoManager()

    def __str__(self):
        return self.name


class Ulica(models.Model):
    geom = models.MultiLineStringField(srid=4326, blank=True, null=True)
    ulica = models.CharField(max_length=301, blank=True, null=True)
    opstina = models.ForeignKey(Opstina, models.CASCADE, blank=True, null=True)
    naselje = models.ForeignKey(Naselje, models.CASCADE, blank=True, null=True)

    class Meta:
        db_table = "Ulica"

    def __str__(self):
        return self.ulica

    objects = GeoManager()


class Djelo(models.Model):
    ulaz = models.BooleanField(max_length=300, null=True, default=None)
    ulica = models.CharField(max_length=300)
    opstina = models.ForeignKey(Opstina, on_delete=models.CASCADE)
    djelo = models.CharField(max_length=300)
    link = models.CharField(max_length=300)
    datum = models.CharField(max_length=300)
    naselje = models.ForeignKey(
        Naselje, on_delete=models.CASCADE, blank=True, null=True
    )

    class Meta:
        db_table = "reporter_djelo"
