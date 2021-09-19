from django.db import models


class ExperimentalValue(models.Model):
    disk_diameter = models.FloatField("Disk diameter")
    magnet_offset = models.FloatField("Magnet offset")
    balance = models.FloatField("Balance test result")
    stability = models.FloatField("Stability test result")
    rapidity = models.FloatField("Rapidity test result")


class Compass(models.Model):
    name = models.CharField("Name", max_length=200)
    inertial_moment = models.FloatField("Inertial moment of the needle assembly")
    visc_frictions = models.FloatField("Viscous frictions coefficient")
    magnet_rem = models.FloatField("Magnet remanent magnetic field")
    magnet_vol = models.FloatField("Magnet volume")
    magnet_mass = models.FloatField("Magnet mass")
    magnet_offset = models.FloatField("Magnet offset")
    liquid_density = models.FloatField("Capsule liquid density")
    disk_diameter = models.FloatField("Disk diameter")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name"], name="unique_name_compass"),
        ]


class MagneticField(models.Model):
    name_mag = models.CharField("Name", max_length=200)
    latitude = models.FloatField("Latitude")
    longitude = models.FloatField("Longitude")
    intensity = models.FloatField("Earth magnetic field intensity")
    angle = models.FloatField("Earth magnetic field angle")

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name_mag"], name="unique_name_mag"),
        ]
