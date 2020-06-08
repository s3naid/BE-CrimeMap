from django.contrib.gis import admin
from .models import Naselje, Ulica


class NaseljeAdmin(admin.GeoModelAdmin):
    list_display = ["name", "geom"]
    search_fields = ["name"]


class UlicaAdmin(admin.GeoModelAdmin):

    list_display = ["ulica", "opstina", "naselje", "geom"]
    search_fields = ["ulica", "naselje"]


admin.site.register(Naselje, NaseljeAdmin)
admin.site.register(Ulica, UlicaAdmin)
