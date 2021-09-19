from rest_framework import serializers
from compass_website_app.models import Compass, MagneticField


class CompassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compass
        fields = [
            "pk",
            "name",
            "inertial_moment",
            "visc_frictions",
            "magnet_rem",
            "magnet_vol",
            "magnet_mass",
            "magnet_offset",
            "liquid_density",
            "disk_diameter",
        ]


class MagneticFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = MagneticField
        fields = ["pk", "name_mag", "latitude", "longitude", "intensity", "angle"]
