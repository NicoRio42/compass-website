from django.forms import ModelForm
from compass_website_app.models import Compass, MagneticField


class CompassForm(ModelForm):
    class Meta:
        model = Compass
        fields = [
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


class MagneticFieldForm(ModelForm):
    class Meta:
        model = MagneticField
        fields = ["name_mag", "latitude", "longitude", "intensity", "angle"]
