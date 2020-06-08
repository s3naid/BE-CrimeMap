from django.conf.urls import include, re_path
from .views import DjeloViewSet, NaseljeViewSet, OpstinaViewSet

from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"crimeDownload", DjeloViewSet)
router.register(r"naselja", NaseljeViewSet)
router.register(r"opstine", OpstinaViewSet)


urlpatterns = router.urls
